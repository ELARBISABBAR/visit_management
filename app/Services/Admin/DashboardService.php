<?php

namespace App\Services\Admin;

use App\Enums\Role;
use App\Models\Badge;
use App\Models\Department;
use App\Models\User;

class DashboardService
{
    /**
     * Get high-level analytics for the admin dashboard.
     *
     * @return array<string, int>
     */
    public function getMetrics(): array
    {
        return [
            'total_users' => User::count(),
            'admins' => User::where('role', Role::ADMIN->value)->count(),
            'demandeurs' => User::where('role', Role::DEMANDEUR->value)->count(),
            'accueils' => User::where('role', Role::ACCUEIL->value)->count(),
            'departments' => Department::count(),
            'badges' => Badge::count(),
        ];
    }
}

