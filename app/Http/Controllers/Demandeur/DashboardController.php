<?php

namespace App\Http\Controllers\Demandeur;

use App\Http\Controllers\Controller;
use App\Services\Demandeur\VisitService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly VisitService $visitService,
    ) {
    }

    public function index(Request $request): Response
    {
        $demandeur = $request->user();
        $chartFilters = $request->only(['chart_mode', 'chart_month', 'chart_date_from', 'chart_date_to']);

        $this->authorize('create', \App\Models\Visit::class);

        $dashboardData = $this->visitService->getDashboardData($demandeur, $chartFilters);

        return Inertia::render('demandeur/dashboard', [
            'stats' => $dashboardData['stats'],
            'upcomingVisits' => $dashboardData['upcoming'],
            'todayVisits' => $dashboardData['today'],
            'historyVisits' => $dashboardData['history'],
            'visitorChart' => $dashboardData['visitor_chart'],
            'chartFilters' => $dashboardData['chart_filters'],
        ]);
    }
}

