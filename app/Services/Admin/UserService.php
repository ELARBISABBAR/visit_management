<?php

namespace App\Services\Admin;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    public function paginateUsers(int $perPage = 10): LengthAwarePaginator
    {
        return User::query()
            ->orderBy('name')
            ->paginate($perPage)
            ->through(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role?->value,
                    'created_at' => $user->created_at?->toDateTimeString(),
                ];
            });
    }

    /**
     * Create a new user for the admin panel.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): User
    {
        if (! in_array($data['role'], Role::values(), true)) {
            throw new \InvalidArgumentException('Invalid role');
        }

        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
        ]);
    }

    /**
     * Update an existing user.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(User $user, array $data): void
    {
        if (isset($data['role']) && ! in_array($data['role'], Role::values(), true)) {
            throw new \InvalidArgumentException('Invalid role');
        }

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }

        if (isset($data['role'])) {
            $user->role = $data['role'];
        }

        $user->save();
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    public function updateUserRole(User $user, string $role): void
    {
        if (! in_array($role, Role::values(), true)) {
            throw new \InvalidArgumentException('Invalid role');
        }

        $user->role = $role;
        $user->save();
    }
}

