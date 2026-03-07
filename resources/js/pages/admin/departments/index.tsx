import { Head, Link, router } from '@inertiajs/react';
import { PaginationControls } from '@/components/pagination-controls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableCell, DataTableRow } from '@/components/ui/data-table';
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
            <div className="mb-4 flex justify-end px-4 pt-4 md:px-6">
                <Link
                    href="/admin/departments/create"
                    className="inline-flex items-center rounded-lg bg-[#F4B400] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#D99A00]"
                >
                    Create department
                </Link>
            </div>
            <div className="space-y-4 px-4 pb-4 md:px-6 md:pb-6">
                <DataTable headers={['Name', 'Description', 'Status', 'Actions']}>
                    {departments.data.map((department) => (
                        <DataTableRow key={department.id}>
                            <DataTableCell className="font-medium">{department.name}</DataTableCell>
                            <DataTableCell className="text-[#6B7280]">{department.description ?? '—'}</DataTableCell>
                            <DataTableCell>
                                <Badge className={department.is_active ? 'border-[#86EFAC] bg-[#F0FDF4] text-[#15803D]' : 'border-[#D1D5DB] bg-[#F9FAFB] text-[#4B5563]'}>
                                    {department.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </DataTableCell>
                            <DataTableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/departments/${department.id}/edit`}>Edit</Link>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(department.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTable>
                <PaginationControls pagination={departments} />
            </div>
        </AppLayout>
    );
}

