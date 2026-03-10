<?php

namespace App\Http\Controllers\Accueil;

use App\Enums\Role;
use App\Enums\VisitStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Accueil\CheckOutVisitRequest;
use App\Http\Requests\Accueil\StoreVisitRequest;
use App\Http\Requests\Accueil\UpdateVisitRequest;
use App\Models\Department;
use App\Models\User;
use App\Models\Visit;
use App\Services\Accueil\VisitWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class VisitController extends Controller
{
    public function __construct(
        private readonly VisitWorkflowService $visitWorkflowService,
    ) {
    }

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Visit::class);

        $filters = $request->only(['date', 'department_id', 'status', 'search']);
        $visits = $this->visitWorkflowService->paginateVisits($filters);

        return Inertia::render('accueil/visites/index', [
            'visits' => $visits,
            'filters' => $filters,
            'departments' => Department::query()->orderBy('name')->get(['id', 'name']),
            'statusOptions' => collect(VisitStatus::cases())
                ->reject(fn (VisitStatus $status) => $status === VisitStatus::AWAITING_BADGE_RETURN)
                ->map(fn (VisitStatus $status) => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])
                ->values(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Visit::class);

        return Inertia::render('accueil/visites/create', [
            'demandeurs' => User::query()
                ->where('role', Role::DEMANDEUR->value)
                ->orderBy('name')
                ->get(['id', 'name']),
            'departments' => Department::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreVisitRequest $request): RedirectResponse
    {
        $this->authorize('create', Visit::class);

        $visit = $this->visitWorkflowService->create($request->validated());

        return redirect()->route('accueil.visites.show', $visit)->with('success', 'La visite a été créée.');
    }

    public function show(Visit $visit): Response
    {
        $this->authorize('view', $visit);

        return Inertia::render('accueil/visites/show', [
            'visit' => $this->visitWorkflowService->formatVisit($visit),
        ]);
    }

    public function edit(Visit $visit): Response
    {
        $this->authorize('update', $visit);

        return Inertia::render('accueil/visites/edit', [
            'visit' => $this->visitWorkflowService->formatVisit($visit),
            'demandeurs' => User::query()
                ->where('role', Role::DEMANDEUR->value)
                ->orderBy('name')
                ->get(['id', 'name']),
            'departments' => Department::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateVisitRequest $request, Visit $visit): RedirectResponse
    {
        $this->authorize('update', $visit);

        $this->visitWorkflowService->update($visit, $request->validated());

        return redirect()->route('accueil.visites.show', $visit)->with('success', 'La visite a été mise à jour.');
    }

    public function cancel(Visit $visit): RedirectResponse
    {
        $this->authorize('cancel', $visit);

        try {
            $this->visitWorkflowService->cancel($visit);
        } catch (ValidationException $exception) {
            return back()->with('error', $this->firstValidationMessage($exception));
        }

        return back()->with('success', 'La visite a été annulée.');
    }

    public function checkIn(Visit $visit): RedirectResponse
    {
        $this->authorize('registerArrival', $visit);

        try {
            $this->visitWorkflowService->registerArrival($visit);
        } catch (ValidationException $exception) {
            return back()->with('error', $this->firstValidationMessage($exception));
        }

        return back()->with('success', "L'arrivée a été enregistrée.");
    }

    public function checkOut(CheckOutVisitRequest $request, Visit $visit): RedirectResponse
    {
        $this->authorize('registerDeparture', $visit);

        try {
            $this->visitWorkflowService->closeVisit($visit, (bool) $request->validated()['badge_returned']);
        } catch (ValidationException $exception) {
            return back()->with('error', $this->firstValidationMessage($exception));
        }

        return back()->with('success', 'La visite a été clôturée.');
    }

    private function firstValidationMessage(ValidationException $exception): string
    {
        $errors = $exception->errors();

        if (empty($errors)) {
            return 'Une erreur de validation est survenue.';
        }

        $firstFieldErrors = reset($errors);

        if (! is_array($firstFieldErrors) || empty($firstFieldErrors)) {
            return 'Une erreur de validation est survenue.';
        }

        return (string) $firstFieldErrors[0];
    }
}

