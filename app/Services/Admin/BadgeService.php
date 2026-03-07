<?php

namespace App\Services\Admin;

use App\Models\Badge;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BadgeService
{
    public function paginateBadges(int $perPage = 10): LengthAwarePaginator
    {
        return Badge::query()
            ->orderBy('code')
            ->paginate($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Badge
    {
        return Badge::create([
            'code' => $data['code'],
            'label' => $data['label'] ?? null,
            'visitor_type' => $data['visitor_type'],
            'status' => $data['status'] ?? 'available',
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Badge $badge, array $data): void
    {
        $badge->fill([
            'code' => $data['code'],
            'label' => $data['label'] ?? null,
            'visitor_type' => $data['visitor_type'],
            'status' => $data['status'] ?? $badge->status,
        ]);

        $badge->save();
    }

    public function delete(Badge $badge): void
    {
        $badge->delete();
    }
}

