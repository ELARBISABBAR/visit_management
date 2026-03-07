import { Head, Link, router } from '@inertiajs/react';
import { ActionConfirmDialog } from '@/components/action-confirm-dialog';
import { PaginationControls } from '@/components/pagination-controls';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableCell, DataTableRow } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type VisitRow = {
    id: number;
    visitor_name: string;
    company?: string | null;
    department?: string | null;
    scheduled_at?: string | null;
    status?: string | null;
    status_label?: string | null;
};

type VisitsIndexProps = {
    visits: {
        data: VisitRow[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord – Demandeur',
        href: '/demandeur/dashboard',
    },
    {
        title: 'Mes visites',
        href: '/demandeur/visites',
    },
];

export default function VisitsIndex({ visits }: VisitsIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes visites" />
            <div className="mb-4 flex justify-end px-4 pt-4 md:px-6">
                <Link
                    href="/demandeur/visites/nouvelle"
                    className="inline-flex items-center rounded-lg bg-[#F4B400] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#D99A00]"
                >
                    Nouvelle visite
                </Link>
            </div>
            <div className="space-y-4 px-4 pb-4 md:px-6 md:pb-6">
                <DataTable headers={['Visitor', 'Company', 'Department', 'Arrival', 'Status', 'Actions']}>
                    {visits.data.length === 0 ? (
                        <DataTableRow>
                            <DataTableCell colSpan={6} className="py-6 text-center text-[#6B7280]">
                                Aucune visite trouvée.
                            </DataTableCell>
                        </DataTableRow>
                    ) : (
                        visits.data.map((visit) => (
                            <DataTableRow key={visit.id}>
                                <DataTableCell className="font-medium">{visit.visitor_name}</DataTableCell>
                                <DataTableCell className="text-[#6B7280]">{visit.company ?? '—'}</DataTableCell>
                                <DataTableCell className="text-[#6B7280]">{visit.department ?? '—'}</DataTableCell>
                                <DataTableCell className="text-[#6B7280]">{visit.scheduled_at ?? '—'}</DataTableCell>
                                <DataTableCell>
                                    <StatusBadge status={visit.status} label={visit.status_label} />
                                </DataTableCell>
                                <DataTableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/demandeur/visites/${visit.id}`}>Détails</Link>
                                        </Button>
                                        {visit.status === 'planned' && (
                                            <ActionConfirmDialog
                                                triggerLabel="Annuler"
                                                title="Confirmer l'annulation"
                                                description="Voulez-vous vraiment annuler cette visite ?"
                                                confirmLabel="Oui, annuler"
                                                onConfirm={() =>
                                                    router.post(
                                                        `/demandeur/visites/${visit.id}/annuler`,
                                                        {},
                                                        { preserveScroll: true },
                                                    )
                                                }
                                                triggerClassName="inline-flex items-center rounded-lg bg-[#EF4444] px-3 py-2 text-xs font-medium text-white hover:bg-red-500"
                                                confirmClassName="inline-flex items-center rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90"
                                            />
                                        )}
                                    </div>
                                </DataTableCell>
                            </DataTableRow>
                        ))
                    )}
                </DataTable>
                <PaginationControls pagination={visits} />
            </div>
        </AppLayout>
    );
}

