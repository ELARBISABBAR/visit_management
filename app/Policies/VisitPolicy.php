<?php

namespace App\Policies;

use App\Enums\Role;
use App\Enums\VisitStatus;
use App\Models\User;
use App\Models\Visit;

class VisitPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [Role::DEMANDEUR, Role::ACCUEIL, Role::ADMIN], true);
    }

    public function view(User $user, Visit $visit): bool
    {
        if (in_array($user->role, [Role::ACCUEIL, Role::ADMIN], true)) {
            return true;
        }

        // Demandeur can only see their own visits
        if ($user->role === Role::DEMANDEUR) {
            return $visit->demandeur_id === $user->id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [Role::DEMANDEUR, Role::ACCUEIL, Role::ADMIN], true);
    }

    public function update(User $user, Visit $visit): bool
    {
        if (in_array($user->role, [Role::ACCUEIL, Role::ADMIN], true)) {
            return $visit->status !== VisitStatus::COMPLETED;
        }

        if ($user->role !== Role::DEMANDEUR || $visit->demandeur_id !== $user->id) {
            return false;
        }

        // Cannot update once the visit has started
        return $visit->status === VisitStatus::PLANNED;
    }

    public function cancel(User $user, Visit $visit): bool
    {
        if (in_array($user->role, [Role::ACCUEIL, Role::ADMIN], true)) {
            return ! in_array($visit->status, [VisitStatus::COMPLETED, VisitStatus::CANCELLED], true);
        }

        if ($user->role !== Role::DEMANDEUR || $visit->demandeur_id !== $user->id) {
            return false;
        }

        return $visit->status === VisitStatus::PLANNED;
    }

    /**
     * These actions are reserved for Accueil/Admin.
     */
    public function assignBadge(User $user, Visit $visit): bool
    {
        return in_array($user->role, [Role::ACCUEIL, Role::ADMIN], true);
    }

    public function registerArrival(User $user, Visit $visit): bool
    {
        return in_array($user->role, [Role::ACCUEIL, Role::ADMIN], true);
    }

    public function registerDeparture(User $user, Visit $visit): bool
    {
        return in_array($user->role, [Role::ACCUEIL, Role::ADMIN], true);
    }
}

