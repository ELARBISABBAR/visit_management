import { Head, Link, router } from '@inertiajs/react';
import { PaginationControls } from '@/components/pagination-controls';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableCell, DataTableRow } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type VisitRow = {
    id: number;
    visitor_name: string;
    company?: string | null;
    department?: string | null;
    scheduled_at?: string | null;
    status_label?: string | null;
};

type StatusOption = {
    value: string;
    label: string;
};

type HistoryPageProps = {
    visits: {
        data: VisitRow[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters: {
        search?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
    statusOptions: StatusOption[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord – Demandeur',
        href: '/demandeur/dashboard',
    },
    {
        title: 'Historique des visites',
        href: '/demandeur/visites/historique',
    },
];

export default function Historique({ visits, filters, statusOptions }: HistoryPageProps) {
    const handleFilterChange = (key: keyof HistoryPageProps['filters'], value: string) => {
        const newFilters = {
            ...filters,
            [key]: value,
            page: 1,
        };

        router.get('/demandeur/visites/historique', newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historique des visites" />

            <div className="space-y-4 p-4 md:p-6">
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                    <h1 className="mb-4 text-lg font-semibold text-[#111827]">Historique des visites</h1>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="search" className="text-sm font-medium text-[#374151]">
                                Rechercher par nom du visiteur
                            </label>
                            <Input
                                id="search"
                                name="search"
                                type="text"
                                defaultValue={filters.search ?? ''}
                                onBlur={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label htmlFor="status" className="text-sm font-medium text-[#374151]">
                                Statut de la visite
                            </label>
                            <select
                                id="status"
                                name="status"
                                className="h-10 rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400]/40"
                                value={filters.status ?? ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">Tous les statuts</option>
                                {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label htmlFor="date_from" className="text-sm font-medium text-[#374151]">
                                Date de début
                            </label>
                            <Input
                                id="date_from"
                                name="date_from"
                                type="date"
                                value={filters.date_from ?? ''}
                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label htmlFor="date_to" className="text-sm font-medium text-[#374151]">
                                Date de fin
                            </label>
                            <Input
                                id="date_to"
                                name="date_to"
                                type="date"
                                value={filters.date_to ?? ''}
                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <DataTable headers={['Visitor', 'Company', 'Department', 'Arrival', 'Status', 'Actions']}>
                        {visits.data.length === 0 ? (
                            <DataTableRow>
                                <DataTableCell colSpan={6} className="py-6 text-center text-[#6B7280]">
                                    Aucune visite trouvée pour ces critères.
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
                                        <StatusBadge label={visit.status_label} />
                                    </DataTableCell>
                                    <DataTableCell className="text-right">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/demandeur/visites/${visit.id}`}>Détails</Link>
                                        </Button>
                                    </DataTableCell>
                                </DataTableRow>
                            ))
                        )}
                    </DataTable>
                    <PaginationControls pagination={visits} />
                </div>
            </div>
        </AppLayout>
    );
}

