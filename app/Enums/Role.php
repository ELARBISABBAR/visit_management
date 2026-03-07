<?php

namespace App\Enums;

enum Role: string
{
    case ADMIN = 'admin';
    case DEMANDEUR = 'demandeur';
    case ACCUEIL = 'accueil';

    /**
     * Return all role values.
     *
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(
            static fn (self $role): string => $role->value,
            self::cases(),
        );
    }
}

