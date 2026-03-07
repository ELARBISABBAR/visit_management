import { Head, Link, router } from '@inertiajs/react';
import { PaginationControls } from '@/components/pagination-controls';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableCell, DataTableRow } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { VisitorTypeBadge } from '@/components/ui/visitor-type-badge';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Badge = {
    id: number;
    code: string;
    label?: string | null;
    visitor_type: 'visiteur' | 'prestataire' | 'fournisseur';
    status: string;
};

type BadgesPageProps = {
    badges: {
        data: Badge[];
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
        title: 'Badges',
        href: '/admin/badges',
    },
];

export default function BadgesIndex({ badges }: BadgesPageProps) {
    const handleDelete = (id: number) => {
        if (!window.confirm('Delete this badge?')) return;
        router.delete(`/admin/badges/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Badges" />
            <div className="mb-4 flex justify-end px-4 pt-4 md:px-6">
                <Link
                    href="/admin/badges/create"
                    className="inline-flex items-center rounded-lg bg-[#F4B400] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#D99A00]"
                >
                    Create badge
                </Link>
            </div>
            <div className="space-y-4 px-4 pb-4 md:px-6 md:pb-6">
                <DataTable headers={['Badge', 'Label', 'Visitor type', 'Status', 'Actions']}>
                    {badges.data.map((badge) => (
                        <DataTableRow key={badge.id}>
                            <DataTableCell className="font-medium">{badge.code}</DataTableCell>
                            <DataTableCell className="text-[#6B7280]">{badge.label ?? '—'}</DataTableCell>
                            <DataTableCell>
                                <VisitorTypeBadge type={badge.visitor_type} />
                            </DataTableCell>
                            <DataTableCell>
                                <StatusBadge status={badge.status} label={badge.status} />
                            </DataTableCell>
                            <DataTableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/badges/${badge.id}/edit`}>Edit</Link>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(badge.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTable>
                <PaginationControls pagination={badges} />
            </div>
        </AppLayout>
    );
}

