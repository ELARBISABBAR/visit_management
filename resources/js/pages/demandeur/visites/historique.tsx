import { Head, Link, router } from '@inertiajs/react';
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
        };

        router.get('/demandeur/visites/historique', newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historique des visites" />

            <div className="space-y-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
                    <h1 className="mb-4 text-lg font-semibold">Historique des visites</h1>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="search" className="text-sm font-medium">
                                Rechercher par nom du visiteur
                            </label>
                            <input
                                id="search"
                                name="search"
                                type="text"
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                defaultValue={filters.search ?? ''}
                                onBlur={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label htmlFor="status" className="text-sm font-medium">
                                Statut de la visite
                            </label>
                            <select
                                id="status"
                                name="status"
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                            <label htmlFor="date_from" className="text-sm font-medium">
                                Date de début
                            </label>
                            <input
                                id="date_from"
                                name="date_from"
                                type="date"
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={filters.date_from ?? ''}
                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label htmlFor="date_to" className="text-sm font-medium">
                                Date de fin
                            </label>
                            <input
                                id="date_to"
                                name="date_to"
                                type="date"
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={filters.date_to ?? ''}
                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 pr-4">Nom du visiteur</th>
                                <th className="py-2 pr-4">Société</th>
                                <th className="py-2 pr-4">Département</th>
                                <th className="py-2 pr-4">Date / heure</th>
                                <th className="py-2 pr-4">Statut</th>
                                <th className="py-2 pr-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visits.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-4 text-center text-sm text-muted-foreground"
                                    >
                                        Aucune visite trouvée pour ces critères.
                                    </td>
                                </tr>
                            ) : (
                                visits.data.map((visit) => (
                                    <tr key={visit.id} className="border-b last:border-b-0">
                                        <td className="py-2 pr-4">{visit.visitor_name}</td>
                                        <td className="py-2 pr-4 text-muted-foreground">
                                            {visit.company ?? '—'}
                                        </td>
                                        <td className="py-2 pr-4 text-muted-foreground">
                                            {visit.department ?? '—'}
                                        </td>
                                        <td className="py-2 pr-4 text-muted-foreground">
                                            {visit.scheduled_at ?? '—'}
                                        </td>
                                        <td className="py-2 pr-4 text-muted-foreground">
                                            {visit.status_label ?? '—'}
                                        </td>
                                        <td className="py-2 pr-4 text-right">
                                            <Link
                                                href={`/demandeur/visites/${visit.id}`}
                                                className="rounded-md border px-2 py-1 text-xs"
                                            >
                                                Détails
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

