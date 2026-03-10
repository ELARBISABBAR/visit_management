<?php

namespace App\Http\Controllers\Demandeur;

use App\Enums\VisitStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Demandeur\StoreVisitRequest;
use App\Http\Requests\Demandeur\UpdateVisitRequest;
use App\Models\Visit;
use App\Services\Demandeur\VisitService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class VisitController extends Controller
{
    public function __construct(
        private readonly VisitService $visitService,
    ) {
    }

    public function index(Request $request): Response
    {
        $demandeur = $request->user();
        $filters = $request->only(['date', 'department_id', 'status', 'search']);

        $visits = $this->visitService->paginateForDemandeur($demandeur, $filters);

        return Inertia::render('demandeur/visites/index', [
            'visits' => $visits,
            'filters' => $filters,
            'departments' => \App\Models\Department::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'statusOptions' => collect(VisitStatus::cases())
                ->reject(fn (VisitStatus $status) => $status === VisitStatus::AWAITING_BADGE_RETURN)
                ->map(fn (VisitStatus $status) => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])
                ->values(),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Visit::class);

        return Inertia::render('demandeur/visites/create', [
            'departments' => \App\Models\Department::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(StoreVisitRequest $request): RedirectResponse
    {
        $this->authorize('create', Visit::class);

        try {
            $visit = $this->visitService->create($request->user(), $request->validated());
        } catch (ValidationException $e) {
            throw $e;
        }

        return redirect()
            ->route('demandeur.visites.show', $visit)
            ->with('success', 'La visite a été créée avec succès.');
    }

    public function show(Request $request, Visit $visit): Response
    {
        $this->authorize('view', $visit);

        $visit->load('department');

        return Inertia::render('demandeur/visites/show', [
            'visit' => [
                'id' => $visit->id,
                'visitor_name' => $visit->visitor_name,
                'is_event' => $visit->is_event,
                'event_name' => $visit->event_name,
                'event_visitors' => $visit->event_visitors ?? [],
                'visitor_type' => $visit->visitor_type,
                'company' => $visit->company,
                'department' => $visit->department?->name,
                'department_id' => $visit->department_id,
                'scheduled_at' => optional($visit->scheduled_at)?->toDateTimeString(),
                'reason' => $visit->reason,
                'status' => $visit->status?->value,
                'status_label' => $visit->status?->label(),
                'arrival_at' => optional($visit->arrival_at)?->toDateTimeString(),
                'badge_color' => $visit->badge_color,
            ],
            'canEdit' => $request->user()->can('update', $visit),
            'canCancel' => $request->user()->can('cancel', $visit),
        ]);
    }

    public function edit(Request $request, Visit $visit): Response
    {
        $this->authorize('update', $visit);

        $visit->load('department');

        return Inertia::render('demandeur/visites/edit', [
            'visit' => [
                'id' => $visit->id,
                'visitor_name' => $visit->visitor_name,
                'is_event' => $visit->is_event,
                'event_name' => $visit->event_name,
                'event_visitors' => $visit->event_visitors ?? [],
                'visitor_type' => $visit->visitor_type,
                'company' => $visit->company,
                'department_id' => $visit->department_id,
                'visit_date' => optional($visit->scheduled_at)?->toDateString(),
                'visit_time' => optional($visit->scheduled_at)?->format('H:i'),
                'reason' => $visit->reason,
            ],
            'departments' => \App\Models\Department::query()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function update(UpdateVisitRequest $request, Visit $visit): RedirectResponse
    {
        $this->authorize('update', $visit);

        try {
            $this->visitService->update($visit, $request->validated());
        } catch (ValidationException $e) {
            if ($e->errors()['visit'] ?? false) {
                return back()->withErrors([
                    'visit' => "Cette visite est déjà en cours et ne peut pas être modifiée.",
                ]);
            }

            throw $e;
        }

        return redirect()
            ->route('demandeur.visites.show', $visit)
            ->with('success', 'La visite a été mise à jour avec succès.');
    }

    public function cancel(Request $request, Visit $visit): RedirectResponse
    {
        $this->authorize('cancel', $visit);

        $this->visitService->cancel($visit);

        return redirect()
            ->route('demandeur.visites.index')
            ->with('success', 'La visite a été annulée.');
    }

    public function history(Request $request): Response
    {
        $demandeur = $request->user();

        $filters = $request->only(['search', 'status', 'date_from', 'date_to']);

        $visits = $this->visitService->history($demandeur, $filters);

        return Inertia::render('demandeur/visites/historique', [
            'visits' => $visits,
            'filters' => $filters,
            'statusOptions' => collect(VisitStatus::cases())
                ->reject(fn (VisitStatus $status) => $status === VisitStatus::AWAITING_BADGE_RETURN)
                ->map(fn (VisitStatus $status) => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])
                ->values(),
        ]);
    }
}

