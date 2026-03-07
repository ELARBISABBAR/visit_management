<?php

namespace App\Services\Accueil;

use App\Enums\Role;
use App\Enums\VisitStatus;
use App\Models\Badge;
use App\Models\Department;
use App\Models\User;
use App\Models\Visit;
use App\Notifications\VisitCancelledNotification;
use App\Notifications\VisitCompletedNotification;
use App\Notifications\VisitorArrivedNotification;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;

class VisitWorkflowService
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function dashboardData(array $filters = []): array
    {
        $todayStart = Carbon::now()->startOfDay();
        $todayEnd = Carbon::now()->endOfDay();
        $chartStart = Carbon::now()->subDays(6)->startOfDay();

        $todayQuery = Visit::query()->whereBetween('scheduled_at', [$todayStart, $todayEnd]);
        $dailyCounts = Visit::query()
            ->selectRaw('DATE(scheduled_at) as day, COUNT(*) as total')
            ->whereDate('scheduled_at', '>=', $chartStart->toDateString())
            ->groupBy('day')
            ->pluck('total', 'day');

        $chartLabels = [];
        $chartData = [];
        for ($date = $chartStart->copy(); $date->lte($todayEnd); $date->addDay()) {
            $day = $date->toDateString();
            $chartLabels[] = $date->format('d/m');
            $chartData[] = (int) ($dailyCounts[$day] ?? 0);
        }

        return [
            'stats' => [
                'planned_today' => (clone $todayQuery)->where('status', VisitStatus::PLANNED)->count(),
                'present_now' => Visit::query()->where('status', VisitStatus::IN_PROGRESS)->count(),
                'completed_today' => (clone $todayQuery)->where('status', VisitStatus::COMPLETED)->count(),
                'cancelled_today' => (clone $todayQuery)->where('status', VisitStatus::CANCELLED)->count(),
            ],
            'today_visits' => $this->formatVisitCollection(
                (clone $todayQuery)->orderByDesc('created_at')->limit(15)->get(),
            ),
            'present_visitors' => $this->formatVisitCollection(
                Visit::query()
                    ->where('status', VisitStatus::IN_PROGRESS)
                    ->orderByDesc('created_at')
                    ->limit(15)
                    ->get(),
            ),
            'latest_visits' => $this->formatVisitCollection(
                Visit::query()->orderByDesc('updated_at')->limit(15)->get(),
            ),
            'visitor_chart' => [
                'labels' => $chartLabels,
                'data' => $chartData,
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public function paginateVisits(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Visit::query()->orderByDesc('created_at');

        $this->applyFilters($query, $filters);

        return $query->paginate($perPage)->through(fn (Visit $visit) => $this->formatVisit($visit));
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Visit
    {
        $demandeur = User::query()
            ->where('id', $data['demandeur_id'])
            ->where('role', Role::DEMANDEUR->value)
            ->first();

        if (! $demandeur) {
            throw ValidationException::withMessages([
                'demandeur_id' => 'Le demandeur sélectionné est invalide.',
            ]);
        }

        Department::findOrFail($data['department_id']);

        $scheduledAt = $this->buildScheduledAt($data['visit_date'], $data['visit_time']);

        return Visit::create([
            'demandeur_id' => $data['demandeur_id'],
            'visitor_name' => $data['visitor_name'],
            'visitor_type' => $data['visitor_type'],
            'company' => $data['company'] ?? null,
            'department_id' => $data['department_id'],
            'scheduled_at' => $scheduledAt,
            'reason' => $data['reason'] ?? '',
            'status' => VisitStatus::PLANNED,
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Visit $visit, array $data): void
    {
        if ($visit->status === VisitStatus::COMPLETED) {
            throw ValidationException::withMessages([
                'visit' => 'Les visites terminées ne peuvent pas être modifiées.',
            ]);
        }

        $scheduledAt = $this->buildScheduledAt($data['visit_date'], $data['visit_time']);

        if ($visit->status === VisitStatus::IN_PROGRESS && $visit->scheduled_at?->toDateString() !== $scheduledAt->toDateString()) {
            throw ValidationException::withMessages([
                'visit_date' => 'Les visites en cours ne peuvent pas changer de date.',
            ]);
        }

        $demandeur = User::query()
            ->where('id', $data['demandeur_id'])
            ->where('role', Role::DEMANDEUR->value)
            ->first();

        if (! $demandeur) {
            throw ValidationException::withMessages([
                'demandeur_id' => 'Le demandeur sélectionné est invalide.',
            ]);
        }

        Department::findOrFail($data['department_id']);

        $visit->fill([
            'demandeur_id' => $data['demandeur_id'],
            'visitor_name' => $data['visitor_name'],
            'visitor_type' => $data['visitor_type'],
            'company' => $data['company'] ?? null,
            'department_id' => $data['department_id'],
            'scheduled_at' => $scheduledAt,
            'reason' => $data['reason'] ?? '',
        ]);

        $visit->save();
    }

    public function cancel(Visit $visit): void
    {
        if (in_array($visit->status, [VisitStatus::COMPLETED, VisitStatus::CANCELLED], true)) {
            throw ValidationException::withMessages([
                'visit' => 'Cette visite ne peut pas être annulée.',
            ]);
        }

        $visit->status = VisitStatus::CANCELLED;
        $visit->save();

        $visit->demandeur?->notify(new VisitCancelledNotification($visit));
    }

    public function registerArrival(Visit $visit): void
    {
        if ($visit->status === VisitStatus::CANCELLED) {
            throw ValidationException::withMessages([
                'visit' => 'Les visites annulées ne peuvent pas être enregistrées à l’arrivée.',
            ]);
        }

        if ($visit->status !== VisitStatus::PLANNED) {
            throw ValidationException::withMessages([
                'visit' => "L'arrivée ne peut pas être enregistrée deux fois.",
            ]);
        }

        $badge = Badge::query()
            ->where('status', 'available')
            ->where('visitor_type', $visit->visitor_type)
            ->orderBy('code')
            ->first();

        $visit->arrival_at = Carbon::now();
        $visit->status = VisitStatus::IN_PROGRESS;
        $visit->badge_color = $badge?->code;
        $visit->save();

        if ($badge) {
            $badge->status = 'in_use';
            $badge->save();
        }

        $visit->load('department');
        $visit->demandeur?->notify(new VisitorArrivedNotification($visit));
    }

    public function closeVisit(Visit $visit, bool $badgeReturned): void
    {
        if (! $visit->arrival_at || $visit->status === VisitStatus::PLANNED) {
            throw ValidationException::withMessages([
                'visit' => "Le départ ne peut pas être enregistré avant l'arrivée.",
            ]);
        }

        if ($visit->status === VisitStatus::CANCELLED) {
            throw ValidationException::withMessages([
                'visit' => 'Les visites annulées ne peuvent pas être clôturées.',
            ]);
        }

        if (! $badgeReturned) {
            throw ValidationException::withMessages([
                'badge_returned' => 'La visite ne peut pas être clôturée si le badge n’est pas retourné.',
            ]);
        }

        if ($visit->status === VisitStatus::COMPLETED) {
            throw ValidationException::withMessages([
                'visit' => 'Cette visite est déjà clôturée.',
            ]);
        }

        if ($visit->badge_color) {
            $badge = Badge::query()
                ->where('status', 'in_use')
                ->where('visitor_type', $visit->visitor_type)
                ->where('code', $visit->badge_color)
                ->orderBy('id')
                ->first();

            if ($badge) {
                $badge->status = 'available';
                $badge->save();
            }
        }

        $visit->status = VisitStatus::COMPLETED;
        $visit->save();

        $visit->refresh();
        $visit->loadMissing('department');
        $visit->demandeur?->notify(new VisitCompletedNotification($visit));
    }

    /**
     * @param  array<int, Visit>  $visits
     * @return array<int, array<string, mixed>>
     */
    private function formatVisitCollection(iterable $visits): array
    {
        $rows = [];
        foreach ($visits as $visit) {
            $rows[] = $this->formatVisit($visit);
        }

        return $rows;
    }

    /**
     * @return array<string, mixed>
     */
    public function formatVisit(Visit $visit): array
    {
        $visit->loadMissing(['demandeur', 'department']);
        $departureAt = $visit->status === VisitStatus::COMPLETED
            ? $visit->updated_at
            : null;
        $durationMinutes = $visit->arrival_at && $departureAt
            ? $visit->arrival_at->diffInMinutes($departureAt)
            : null;

        return [
            'id' => $visit->id,
            'visitor_name' => $visit->visitor_name,
            'visitor_type' => $visit->visitor_type,
            'company' => $visit->company,
            'demandeur' => $visit->demandeur?->name,
            'department' => $visit->department?->name,
            'demandeur_id' => $visit->demandeur_id,
            'department_id' => $visit->department_id,
            'scheduled_at' => optional($visit->scheduled_at)?->toDateTimeString(),
            'visit_date' => optional($visit->scheduled_at)?->toDateString(),
            'visit_time' => optional($visit->scheduled_at)?->format('H:i'),
            'reason' => $visit->reason,
            'status' => $visit->status?->value,
            'status_label' => $visit->status?->label(),
            'badge_color' => $visit->badge_color,
            'arrival_at' => optional($visit->arrival_at)?->toDateTimeString(),
            'departure_at' => optional($departureAt)?->toDateTimeString(),
            'time_with_demandeur' => $durationMinutes !== null
                ? $durationMinutes.' min'
                : null,
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        if (! empty($filters['date'])) {
            $query->whereDate('scheduled_at', $filters['date']);
        }

        if (! empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        if (! empty($filters['status']) && in_array($filters['status'], VisitStatus::values(), true)) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $query->where('visitor_name', 'like', '%'.$filters['search'].'%');
        }
    }

    private function buildScheduledAt(string $date, string $time): Carbon
    {
        return Carbon::createFromFormat('Y-m-d H:i', $date.' '.$time);
    }
}

