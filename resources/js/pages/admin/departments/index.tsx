import { Head, Link, router } from '@inertiajs/react';
import { PaginationControls } from '@/components/pagination-controls';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Department = {
    id: number;
    name: string;
    description?: string | null;
    is_active: boolean;
};

type DepartmentsPageProps = {
    departments: {
        data: Department[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin dashboard',
        href: '/admin',
    },
    {
        title: 'Departments',
        href: '/admin/departments',
    },
];

export default function DepartmentsIndex({ departments }: DepartmentsPageProps) {
    const handleDelete = (id: number) => {
        if (!window.confirm('Delete this department?')) return;
        router.delete(`/admin/departments/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            <div className="mb-4 flex justify-end">
                <Link
                    href="/admin/departments/create"
                    className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                    Create department
                </Link>
            </div>
            <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
                <table className="min-w-full text-left text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 pr-4">Name</th>
                            <th className="py-2 pr-4">Description</th>
                            <th className="py-2 pr-4">Status</th>
                            <th className="py-2 pr-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.data.map((department) => (
                            <tr key={department.id} className="border-b last:border-b-0">
                                <td className="py-2 pr-4">{department.name}</td>
                                <td className="py-2 pr-4 text-muted-foreground">
                                    {department.description ?? '—'}
                                </td>
                                <td className="py-2 pr-4">
                                    {department.is_active ? 'Active' : 'Inactive'}
                                </td>
                                <td className="py-2 pr-4 text-right space-x-2">
                                    <Link
                                        href={`/admin/departments/${department.id}/edit`}
                                        className="rounded-md border px-2 py-1 text-xs"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(department.id)}
                                        className="rounded-md border border-destructive px-2 py-1 text-xs text-destructive"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <PaginationControls pagination={departments} />
            </div>
        </AppLayout>
    );
}

