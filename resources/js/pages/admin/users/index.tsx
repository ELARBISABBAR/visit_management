import { Head, Link, router } from '@inertiajs/react';
import { PaginationControls } from '@/components/pagination-controls';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableCell, DataTableRow } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';

type PaginatedUsers = {
    data: (Pick<User, 'id' | 'name' | 'email'> & { role?: string; created_at?: string | null })[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
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
            <div className="mb-4 flex justify-end px-4 pt-4 md:px-6">
                <Link
                    href="/admin/users/create"
                    className="inline-flex items-center rounded-lg bg-[#F4B400] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#D99A00]"
                >
                    Create user
                </Link>
            </div>
            <div className="space-y-4 px-4 pb-4 md:px-6 md:pb-6">
                <DataTable headers={['Name', 'Email', 'Role', 'Created at', 'Actions']}>
                    {users.data.map((user) => (
                        <DataTableRow key={user.id}>
                            <DataTableCell className="font-medium">{user.name}</DataTableCell>
                            <DataTableCell>{user.email}</DataTableCell>
                            <DataTableCell>
                                <select
                                    className="rounded-lg border border-input bg-white px-3 py-2 text-sm"
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
                            </DataTableCell>
                            <DataTableCell className="text-[#6B7280]">{user.created_at ?? '—'}</DataTableCell>
                            <DataTableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/users/${user.id}/edit`}>Edit</Link>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTable>
                <PaginationControls pagination={users} />
            </div>
        </AppLayout>
    );
}

