import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';

type PaginatedUsers = {
    data: (Pick<User, 'id' | 'name' | 'email'> & { role?: string; created_at?: string | null })[];
};

type UsersPageProps = {
    users: PaginatedUsers;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin dashboard',
        href: '/admin',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
];

const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'demandeur', label: 'Demandeur' },
    { value: 'accueil', label: 'Accueil' },
];

export default function UsersIndex({ users }: UsersPageProps) {
    const handleRoleChange = (userId: number, role: string) => {
        router.put(`/admin/users/${userId}/role`, { role }, { preserveScroll: true });
    };

    const handleDelete = (userId: number) => {
        if (!window.confirm('Delete this user?')) return;
        router.delete(`/admin/users/${userId}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage users" />
            <div className="mb-4 flex justify-end">
                <Link
                    href="/admin/users/create"
                    className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                    Create user
                </Link>
            </div>
            <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
                <table className="min-w-full text-left text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 pr-4">Name</th>
                            <th className="py-2 pr-4">Email</th>
                            <th className="py-2 pr-4">Role</th>
                            <th className="py-2 pr-4">Created at</th>
                            <th className="py-2 pr-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((user) => (
                            <tr key={user.id} className="border-b last:border-b-0">
                                <td className="py-2 pr-4">{user.name}</td>
                                <td className="py-2 pr-4">{user.email}</td>
                                <td className="py-2 pr-4">
                                    <select
                                        className="rounded-md border bg-background px-2 py-1 text-sm"
                                        value={user.role ?? ''}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select role
                                        </option>
                                        {roles.map((role) => (
                                            <option key={role.value} value={role.value}>
                                                {role.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="py-2 pr-4 text-muted-foreground">
                                    {user.created_at ?? '—'}
                                </td>
                                <td className="py-2 pr-4 text-right space-x-2">
                                    <Link
                                        href={`/admin/users/${user.id}/edit`}
                                        className="rounded-md border px-2 py-1 text-xs"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(user.id)}
                                        className="rounded-md border border-destructive px-2 py-1 text-xs text-destructive"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}

