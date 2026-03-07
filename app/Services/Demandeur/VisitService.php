<?php

namespace App\Services\Demandeur;

use App\Enums\VisitStatus;
use App\Models\Department;
use App\Models\User;
use App\Models\Visit;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
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
    public function getDashboardData(User $demandeur, array $chartFilters = []): array
    {
        $now = Carbon::now();
        $todayStart = $now->copy()->startOfDay();
        $todayEnd = $now->copy()->endOfDay();
        $chartRange = $this->resolveChartRange($chartFilters, $now);
        $chartStart = $chartRange['start'];
        $chartEnd = $chartRange['end'];

        $baseQuery = Visit::query()->where('demandeur_id', $demandeur->id);
        $dailyCounts = (clone $baseQuery)
            ->selectRaw('DATE(scheduled_at) as day, COUNT(*) as total')
            ->whereDate('scheduled_at', '>=', $chartStart->toDateString())
            ->whereDate('scheduled_at', '<=', $chartEnd->toDateString())
            ->groupBy('day')
            ->pluck('total', 'day');

        $chartLabels = [];
        $chartData = [];
        for ($date = $chartStart->copy(); $date->lte($chartEnd); $date->addDay()) {
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
                'is_event' => $visit->is_event,
                'event_visitors' => $visit->event_visitors ?? [],
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
            'chart_filters' => [
                'mode' => $chartRange['mode'],
                'month' => $chartRange['month'],
                'date_from' => $chartRange['date_from'],
                'date_to' => $chartRange['date_to'],
            ],
        ];
    }

    /**
     * Paginate all visits created by the demandeur.
     */
    public function paginateForDemandeur(User $demandeur, int $perPage = 10): LengthAwarePaginator
    {
        return Visit::query()
            ->where('demandeur_id', $demandeur->id)
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->through(function (Visit $visit) {
                return [
                    'id' => $visit->id,
                    'visitor_name' => $visit->visitor_name,
                    'is_event' => $visit->is_event,
                    'event_visitors' => $visit->event_visitors ?? [],
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

        $isEvent = filter_var($data['is_event'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $eventVisitors = $this->normalizeEventVisitors($data['event_visitors'] ?? []);
        $name = $isEvent
            ? trim((string) ($data['event_name'] ?? ''))
            : trim((string) ($data['visitor_name'] ?? ''));

        return Visit::create([
            'demandeur_id' => $demandeur->id,
            'visitor_name' => $name,
            'is_event' => $isEvent,
            'event_name' => $isEvent ? $name : null,
            'event_visitors' => $isEvent ? $eventVisitors : [],
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

        $isEvent = filter_var($data['is_event'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $eventVisitors = $this->normalizeEventVisitors($data['event_visitors'] ?? []);
        $name = $isEvent
            ? trim((string) ($data['event_name'] ?? ''))
            : trim((string) ($data['visitor_name'] ?? ''));

        $visit->fill([
            'visitor_name' => $name,
            'is_event' => $isEvent,
            'event_name' => $isEvent ? $name : null,
            'event_visitors' => $isEvent ? $eventVisitors : [],
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
    public function history(User $demandeur, array $filters = [], int $perPage = 10): LengthAwarePaginator
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
                'is_event' => $visit->is_event,
                'event_visitors' => $visit->event_visitors ?? [],
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

    /**
     * @param  mixed  $eventVisitors
     * @return array<int, string>
     */
    private function normalizeEventVisitors(mixed $eventVisitors): array
    {
        if (! is_array($eventVisitors)) {
            return [];
        }

        $names = collect($eventVisitors)
            ->map(fn (mixed $name): string => trim((string) $name))
            ->filter(fn (string $name): bool => $name !== '')
            ->unique()
            ->values()
            ->all();

        return $names;
    }

    /**
     * @param  array<string, mixed>  $chartFilters
     * @return array{
     *   start: Carbon,
     *   end: Carbon,
     *   mode: string,
     *   month: string,
     *   date_from: string,
     *   date_to: string
     * }
     */
    private function resolveChartRange(array $chartFilters, Carbon $now): array
    {
        $requestedMode = (string) ($chartFilters['chart_mode'] ?? 'month');
        $mode = in_array($requestedMode, ['month', 'custom'], true)
            ? $requestedMode
            : 'month';

        if ($mode === 'custom') {
            $fromRaw = (string) ($chartFilters['chart_date_from'] ?? $now->copy()->subDays(6)->toDateString());
            $toRaw = (string) ($chartFilters['chart_date_to'] ?? $now->toDateString());
            try {
                $start = Carbon::parse($fromRaw)->startOfDay();
                $end = Carbon::parse($toRaw)->endOfDay();
            } catch (\Throwable) {
                $start = $now->copy()->subDays(6)->startOfDay();
                $end = $now->copy()->endOfDay();
            }

            if ($start->gt($end)) {
                [$start, $end] = [$end->copy()->startOfDay(), $start->copy()->endOfDay()];
            }

            return [
                'start' => $start,
                'end' => $end,
                'mode' => 'custom',
                'month' => $now->format('Y-m'),
                'date_from' => $start->toDateString(),
                'date_to' => $end->toDateString(),
            ];
        }

        $month = (string) ($chartFilters['chart_month'] ?? $now->format('Y-m'));
        try {
            $monthDate = Carbon::createFromFormat('Y-m', $month);
        } catch (\Throwable) {
            $monthDate = $now->copy();
        }
        $start = $monthDate->copy()->startOfMonth()->startOfDay();
        $end = $monthDate->copy()->endOfMonth()->endOfDay();

        return [
            'start' => $start,
            'end' => $end,
            'mode' => 'month',
            'month' => $monthDate->format('Y-m'),
            'date_from' => $start->toDateString(),
            'date_to' => $end->toDateString(),
        ];
    }
}

