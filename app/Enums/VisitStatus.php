<?php

namespace App\Enums;

enum VisitStatus: string
{
    case PLANNED = 'planned';
    case IN_PROGRESS = 'in_progress';
    case AWAITING_BADGE_RETURN = 'awaiting_badge_return';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    /**
     * Get the French label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::PLANNED => 'Planifiée',
            self::IN_PROGRESS => 'En cours',
            self::AWAITING_BADGE_RETURN => 'En attente de retour du badge',
            self::COMPLETED => 'Terminée',
            self::CANCELLED => 'Annulée',
        };
    }

    /**
     * All status values.
     *
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $status): string => $status->value, self::cases());
    }
}

