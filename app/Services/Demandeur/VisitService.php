<?php

namespace App\Services\Demandeur;

use App\Enums\VisitStatus;
use App\Models\Department;
use App\Models\User;
use App\Models\Visit;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class VisitService
{
    /**
     * Build dashboard statistics and lists for a demandeur.
     *
     * @return array{
     *     stats: array<string, int>,
     *     upcoming: array<int, array<string, mixed>>,
     *     today: array<int, array<string, mixed>>,
     *     history: array<int, array<string, mixed>>,
     * }
     */
    public function getDashboardData(User $demandeur): array
    {
        $now = Carbon::now();
        $todayStart = $now->copy()->startOfDay();
        $todayEnd = $now->copy()->endOfDay();
        $chartStart = $now->copy()->subDays(6)->startOfDay();

        $baseQuery = Visit::query()->where('demandeur_id', $demandeur->id);
        $dailyCounts = (clone $baseQuery)
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

        $stats = [
            'upcoming' => (clone $baseQuery)
                ->where('status', VisitStatus::PLANNED)
                ->where('scheduled_at', '>', $now)
                ->count(),
            'today' => (clone $baseQuery)
                ->whereBetween('scheduled_at', [$todayStart, $todayEnd])
                ->count(),
            'in_progress' => (clone $baseQuery)
                ->where('status', VisitStatus::IN_PROGRESS)
                ->count(),
            'completed' => (clone $baseQuery)
                ->where('status', VisitStatus::COMPLETED)
                ->count(),
        ];

        $mapVisit = static function (Visit $visit): array {
            return [
                'id' => $visit->id,
                'visitor_name' => $visit->visitor_name,
                'company' => $visit->company,
                'department' => $visit->department?->name,
                'scheduled_at' => optional($visit->scheduled_at)?->toDateTimeString(),
                'status' => $visit->status?->value,
                'status_label' => $visit->status?->label(),
            ];
        };

        $upcoming = (clone $baseQuery)
            ->where('status', VisitStatus::PLANNED)
            ->where('scheduled_at', '>', $now)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map($mapVisit)
            ->all();

        $today = (clone $baseQuery)
            ->whereBetween('scheduled_at', [$todayStart, $todayEnd])
            ->orderByDesc('created_at')
            ->get()
            ->map($mapVisit)
            ->all();

        $history = (clone $baseQuery)
            ->where('scheduled_at', '<', $todayStart)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map($mapVisit)
            ->all();

        return [
            'stats' => $stats,
            'upcoming' => $upcoming,
            'today' => $today,
            'history' => $history,
            'visitor_chart' => [
                'labels' => $chartLabels,
                'data' => $chartData,
            ],
        ];
    }

    /**
     * Paginate all visits created by the demandeur.
     */
    public function paginateForDemandeur(User $demandeur, int $perPage = 15): LengthAwarePaginator
    {
        return Visit::query()
            ->where('demandeur_id', $demandeur->id)
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->through(function (Visit $visit) {
                return [
                    'id' => $visit->id,
                    'visitor_name' => $visit->visitor_name,
                    'company' => $visit->company,
                    'department' => $visit->department?->name,
                    'scheduled_at' => optional($visit->scheduled_at)?->toDateTimeString(),
                    'status' => $visit->status?->value,
                    'status_label' => $visit->status?->label(),
                ];
            });
    }

    /**
     * Create a visit for a demandeur.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(User $demandeur, array $data): Visit
    {
        // Ensure department exists at domain level as well.
        Department::findOrFail($data['department_id']);

        $scheduledAt = $this->buildScheduledAt($data['visit_date'], $data['visit_time']);

        if ($scheduledAt->isPast()) {
            throw ValidationException::withMessages([
                'visit_date' => 'La date et l\'heure de visite doivent être dans le futur.',
            ]);
        }

        if (! $this->isTimeSlotAvailable((int) $data['department_id'], $scheduledAt)) {
            throw ValidationException::withMessages([
                'visit_time' => "Ce créneau n'est pas disponible pour ce département.",
            ]);
        }

        return Visit::create([
            'demandeur_id' => $demandeur->id,
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
     * Update a planned visit.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Visit $visit, array $data): void
    {
        if ($visit->status !== VisitStatus::PLANNED) {
            throw ValidationException::withMessages([
                'visit' => "Cette visite est déjà en cours et ne peut pas être modifiée.",
            ]);
        }

        Department::findOrFail($data['department_id']);

        $scheduledAt = $this->buildScheduledAt($data['visit_date'], $data['visit_time']);

        if ($scheduledAt->isPast()) {
            throw ValidationException::withMessages([
                'visit_date' => 'La date et l\'heure de visite doivent être dans le futur.',
            ]);
        }

        if (! $this->isTimeSlotAvailable((int) $data['department_id'], $scheduledAt, $visit->id)) {
            throw ValidationException::withMessages([
                'visit_time' => "Ce créneau n'est pas disponible pour ce département.",
            ]);
        }

        $visit->fill([
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
        $visit->status = VisitStatus::CANCELLED;
        $visit->save();
    }

    /**
     * Visit history with filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function history(User $demandeur, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Visit::query()
            ->where('demandeur_id', $demandeur->id)
            ->orderByDesc('created_at');

        if (! empty($filters['search'])) {
            $query->where('visitor_name', 'like', '%'.$filters['search'].'%');
        }

        if (! empty($filters['status']) && in_array($filters['status'], VisitStatus::values(), true)) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['date_from'])) {
            $query->whereDate('scheduled_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->whereDate('scheduled_at', '<=', $filters['date_to']);
        }

        return $query->paginate($perPage)->through(function (Visit $visit) {
            return [
                'id' => $visit->id,
                'visitor_name' => $visit->visitor_name,
                'company' => $visit->company,
                'department' => $visit->department?->name,
                'scheduled_at' => optional($visit->scheduled_at)?->toDateTimeString(),
                'status' => $visit->status?->value,
                'status_label' => $visit->status?->label(),
            ];
        });
    }

    private function buildScheduledAt(string $date, string $time): Carbon
    {
        return Carbon::createFromFormat('Y-m-d H:i', $date.' '.$time);
    }

    /**
     * Simple time-slot availability check per department.
     */
    private function isTimeSlotAvailable(int $departmentId, Carbon $scheduledAt, ?int $ignoreVisitId = null): bool
    {
        $query = Visit::query()
            ->where('department_id', $departmentId)
            ->whereDate('scheduled_at', $scheduledAt->toDateString())
            ->whereTime('scheduled_at', $scheduledAt->toTimeString());

        if ($ignoreVisitId !== null) {
            $query->where('id', '!=', $ignoreVisitId);
        }

        return ! $query->exists();
    }
}

