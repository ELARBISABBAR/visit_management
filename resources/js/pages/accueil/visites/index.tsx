import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    CalendarDays,
    Eye,
    LogIn,
    LogOut,
    Timer,
    User,
    UserCircle2,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { PaginationControls } from '@/components/pagination-controls';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableCell, DataTableRow } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { VisitorTypeBadge } from '@/components/ui/visitor-type-badge';
import AppLayout from '@/layouts/app-layout';
import { formatDateTime, formatDurationHoursMinutes, formatTime } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type VisitRow = {
    id: number;
    is_event?: boolean;
    event_name?: string | null;
    event_visitors?: string[] | null;
    visitor_name: string;
    visitor_type: string;
    company?: string | null;
    demandeur?: string | null;
    department?: string | null;
    scheduled_at?: string | null;
    status?: string | null;
    status_label?: string | null;
    badge_color?: string | null;
    reason?: string | null;
    arrival_at?: string | null;
    departure_at?: string | null;
    time_with_demandeur?: string | null;
};

type Option = {
    id?: number;
    name?: string;
    value?: string;
    label?: string;
};

type VisitsIndexProps = {
    visits: {
        data: VisitRow[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters: {
        date?: string;
        department_id?: string;
        status?: string;
        search?: string;
    };
    departments: Option[];
    statusOptions: Option[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord – Accueil', href: '/accueil/dashboard' },
    { title: 'Gestion des visites', href: '/accueil/visites' },
];

export default function AccueilVisitsIndex({
    visits,
    filters,
    departments,
    statusOptions,
}: VisitsIndexProps) {
    const updateFilter = (key: keyof VisitsIndexProps['filters'], value: string) => {
        router.get(
            '/accueil/visites',
            {
                ...filters,
                [key]: value,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des visites" />

            <div className="space-y-4 p-4 md:p-6">
                <div className="flex justify-end">
                    <Link
                        href="/accueil/visites/nouvelle"
                        className="inline-flex items-center rounded-lg bg-[#F4B400] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#D99A00]"
                    >
                        Nouvelle visite
                    </Link>
                </div>

                <div className="grid gap-4 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm md:grid-cols-4">
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-date" className="text-sm font-medium text-[#374151]">
                            Filtrer par date
                        </label>
                        <Input
                            id="filter-date"
                            type="date"
                            value={filters.date ?? ''}
                            onChange={(e) => updateFilter('date', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-department" className="text-sm font-medium text-[#374151]">
                            Filtrer par département
                        </label>
                        <select
                            id="filter-department"
                            className="h-10 rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400]/40"
                            value={filters.department_id ?? ''}
                            onChange={(e) => updateFilter('department_id', e.target.value)}
                        >
                            <option value="">Tous</option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-status" className="text-sm font-medium text-[#374151]">
                            Filtrer par statut
                        </label>
                        <select
                            id="filter-status"
                            className="h-10 rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400]/40"
                            value={filters.status ?? ''}
                            onChange={(e) => updateFilter('status', e.target.value)}
                        >
                            <option value="">Tous</option>
                            {statusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-search" className="text-sm font-medium text-[#374151]">
                            Rechercher par nom du visiteur
                        </label>
                        <Input
                            id="filter-search"
                            type="text"
                            defaultValue={filters.search ?? ''}
                            onBlur={(e) => updateFilter('search', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <DataTable
                        headers={[
                            '#',
                            'Visitor',
                            'Type',
                            'Company',
                            'Host',
                            'Department',
                            'Arrival',
                            'Status',
                            'Actions',
                        ]}
                    >
                        {visits.data.map((visit, index) => (
                            <DataTableRow key={visit.id}>
                                <DataTableCell className="text-[#6B7280]">{index + 1}</DataTableCell>
                                <DataTableCell className="font-medium">
                                    {visit.is_event ? visit.event_name ?? visit.visitor_name : visit.visitor_name}
                                </DataTableCell>
                                <DataTableCell>
                                    <VisitorTypeBadge type={visit.visitor_type} />
                                </DataTableCell>
                                <DataTableCell className="text-[#6B7280]">{visit.company ?? '—'}</DataTableCell>
                                <DataTableCell className="text-[#6B7280]">{visit.demandeur ?? '—'}</DataTableCell>
                                <DataTableCell className="text-[#6B7280]">{visit.department ?? '—'}</DataTableCell>
                                <DataTableCell className="text-[#6B7280]">{formatDateTime(visit.scheduled_at)}</DataTableCell>
                                <DataTableCell>
                                    <StatusBadge status={visit.status} label={visit.status_label} />
                                </DataTableCell>
                                <DataTableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/accueil/visites/${visit.id}`}>Voir</Link>
                                        </Button>
                                        <VisitPreviewModal visit={visit} />
                                    </div>
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                    </DataTable>
                    <PaginationControls pagination={visits} />
                </div>
            </div>
        </AppLayout>
    );
}

function VisitPreviewModal({ visit }: { visit: VisitRow }) {
    const badgeColorLabel = badgeColorByVisitorType(visit.visitor_type);

    return (
        <Modal
            trigger={
                <button
                    type="button"
                    className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#374151] hover:bg-[#F3F4F6]"
                    aria-label="Aperçu de la visite"
                    title="Aperçu rapide"
                >
                    <Eye className="size-4" />
                </button>
            }
            title="Voir la visite"
            description="Informations complètes de la visite sélectionnée."
        >
                <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                        <UserCircle2 className="mt-1 size-10 text-[#6B7280]" />
                        <div>
                            <h3 className="text-2xl font-semibold text-[#111827]">
                                {visit.is_event ? visit.event_name ?? visit.visitor_name : visit.visitor_name}
                            </h3>
                            <p className="text-sm text-[#6B7280]">Type de visiteur</p>
                            <div className="mt-1">
                                <VisitorTypeBadge type={visit.visitor_type} />
                            </div>
                            <p className="mt-2 text-sm text-[#6B7280]">Son entreprise</p>
                            <p className="text-base text-[#111827]">{visit.company ?? '—'}</p>
                        </div>
                    </div>

                    {visit.is_event && (
                        <div className="space-y-2 border-t pt-3">
                            <p className="text-sm font-medium text-[#374151]">Participants de l'événement</p>
                            <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm">
                                {visit.event_visitors && visit.event_visitors.length > 0 ? (
                                    <ul className="list-inside list-disc">
                                        {visit.event_visitors.map((name, index) => (
                                            <li key={`${name}-${index}`}>{name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    'Aucun participant renseigné.'
                                )}
                            </div>
                        </div>
                    )}

                    <div className="grid gap-3 md:grid-cols-2">
                        <InfoItem icon={<User className="size-4" />} label="Hôte" value={visit.demandeur ?? '—'} />
                        <InfoItem
                            icon={<Building2 className="size-4" />}
                            label="Département"
                            value={visit.department ?? '—'}
                        />
                        <InfoItem
                            icon={<UserCircle2 className="size-4" />}
                            label="Couleur du badge"
                            value={badgeColorLabel}
                        />
                    </div>

                    <div className="grid gap-3 border-t pt-3 md:grid-cols-2">
                        <InfoItem
                            icon={<CalendarDays className="size-4" />}
                            label="Date de visite"
                            value={formatDateTime(visit.scheduled_at)}
                        />
                        <div className="flex items-center justify-end">
                            <StatusBadge status={visit.status} label={visit.status_label} />
                        </div>
                    </div>

                    <div className="grid gap-3 border-t pt-3 md:grid-cols-3">
                        <InfoItem
                            icon={<LogIn className="size-4" />}
                            label="Arrivée"
                            value={formatTime(visit.arrival_at)}
                        />
                        <InfoItem
                            icon={<LogOut className="size-4" />}
                            label="Départ"
                            value={formatTime(visit.departure_at)}
                        />
                        <InfoItem
                            icon={<Timer className="size-4" />}
                            label="Durée de visite"
                            value={formatDurationHoursMinutes(visit.time_with_demandeur)}
                        />
                    </div>

                    <div className="space-y-2 border-t pt-3">
                        <p className="text-sm font-medium text-[#374151]">Motif de la visite</p>
                        <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm">
                            {visit.reason || '—'}
                        </div>
                    </div>
                </div>
        </Modal>
    );
}

function InfoItem({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-md border border-[#E5E7EB] bg-white p-2">
            <p className="mb-1 flex items-center gap-2 text-sm text-[#6B7280]">
                {icon}
                {label}
            </p>
            <p className="text-base font-medium text-[#111827]">{value}</p>
        </div>
    );
}

function badgeColorByVisitorType(visitorType: string): string {
    const type = visitorType.toLowerCase();

    if (type === 'visiteur') {
        return 'Badge bleu';
    }

    if (type === 'prestataire') {
        return 'Badge jaune';
    }

    if (type === 'fournisseur') {
        return 'Badge rouge';
    }

    return '—';
}

