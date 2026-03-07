<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService,
    ) {
    }

    public function index(Request $request): Response
    {
        $metrics = $this->dashboardService->getMetrics();

        return Inertia::render('admin/dashboard', [
            'metrics' => $metrics,
        ]);
    }
}

