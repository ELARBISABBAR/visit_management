<?php

namespace App\Http\Controllers\Accueil;

use App\Http\Controllers\Controller;
use App\Services\Accueil\VisitWorkflowService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly VisitWorkflowService $visitWorkflowService,
    ) {
    }

    public function index(Request $request): Response
    {
        $data = $this->visitWorkflowService->dashboardData();

        return Inertia::render('accueil/dashboard', [
            'stats' => $data['stats'],
            'todayVisits' => $data['today_visits'],
            'presentVisitors' => $data['present_visitors'],
            'latestVisits' => $data['latest_visits'],
            'visitorChart' => $data['visitor_chart'],
        ]);
    }
}

