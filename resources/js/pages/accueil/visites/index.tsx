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
import AppLayout from '@/layouts/app-layout';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { BreadcrumbItem } from '@/types';

type VisitRow = {
    id: number;
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
    visits: { data: VisitRow[] };
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
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des visites" />

            <div className="space-y-4">
                <div className="flex justify-end">
                    <Link
                        href="/accueil/visites/nouvelle"
                        className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        Nouvelle visite
                    </Link>
                </div>

                <div className="grid gap-4 rounded-xl border border-sidebar-border/70 bg-background p-4 md:grid-cols-4 dark:border-sidebar-border">
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-date" className="text-sm font-medium">
                            Filtrer par date
                        </label>
                        <input
                            id="filter-date"
                            type="date"
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={filters.date ?? ''}
                            onChange={(e) => updateFilter('date', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-department" className="text-sm font-medium">
                            Filtrer par département
                        </label>
                        <select
                            id="filter-department"
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                        <label htmlFor="filter-status" className="text-sm font-medium">
                            Filtrer par statut
                        </label>
                        <select
                            id="filter-status"
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                        <label htmlFor="filter-search" className="text-sm font-medium">
                            Rechercher par nom du visiteur
                        </label>
                        <input
                            id="filter-search"
                            type="text"
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                            defaultValue={filters.search ?? ''}
                            onBlur={(e) => updateFilter('search', e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
                    <h1 className="mb-4 text-lg font-semibold">Gestion des visites</h1>
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 pr-4">#</th>
                                <th className="py-2 pr-4">Nom du visiteur</th>
                                <th className="py-2 pr-4">Type de visiteur</th>
                                <th className="py-2 pr-4">Société</th>
                                <th className="py-2 pr-4">Demandeur (hôte)</th>
                                <th className="py-2 pr-4">Département</th>
                                <th className="py-2 pr-4">Date et heure de visite</th>
                                <th className="py-2 pr-4">Statut de la visite</th>
                                <th className="py-2 pr-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visits.data.map((visit, index) => (
                                <tr key={visit.id} className="border-b last:border-b-0">
                                    <td className="py-2 pr-4 text-muted-foreground">{index + 1}</td>
                                    <td className="py-2 pr-4">{visit.visitor_name}</td>
                                    <td className="py-2 pr-4">{visit.visitor_type}</td>
                                    <td className="py-2 pr-4">{visit.company ?? '—'}</td>
                                    <td className="py-2 pr-4">{visit.demandeur ?? '—'}</td>
                                    <td className="py-2 pr-4">{visit.department ?? '—'}</td>
                                    <td className="py-2 pr-4">{visit.scheduled_at ?? '—'}</td>
                                    <td className="py-2 pr-4">{visit.status_label ?? '—'}</td>
                                    <td className="py-2 pr-4 text-right space-x-2">
                                        <Link
                                            href={`/accueil/visites/${visit.id}`}
                                            className="rounded-md border px-2 py-1 text-xs"
                                        >
                                            Voir la visite
                                        </Link>
                                        <VisitPreviewModal visit={visit} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

function VisitPreviewModal({ visit }: { visit: VisitRow }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="inline-flex items-center rounded-md border px-2 py-1 text-xs"
                    aria-label="Aperçu de la visite"
                    title="Aperçu rapide"
                >
                    <Eye className="size-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Voir la visite</DialogTitle>
                    <DialogDescription>
                        Informations complètes de la visite sélectionnée.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-lg border p-3">
                        <UserCircle2 className="mt-1 size-10 text-muted-foreground" />
                        <div>
                            <h3 className="text-2xl font-semibold">{visit.visitor_name}</h3>
                            <p className="text-sm text-muted-foreground">Type de visiteur</p>
                            <p className="text-base font-medium">{visit.visitor_type}</p>
                            <p className="mt-2 text-sm text-muted-foreground">Son entreprise</p>
                            <p className="text-base">{visit.company ?? '—'}</p>
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <InfoItem icon={<User className="size-4" />} label="Hôte" value={visit.demandeur ?? '—'} />
                        <InfoItem
                            icon={<Building2 className="size-4" />}
                            label="Département"
                            value={visit.department ?? '—'}
                        />
                    </div>

                    <div className="grid gap-3 border-t pt-3 md:grid-cols-2">
                        <InfoItem
                            icon={<CalendarDays className="size-4" />}
                            label="Date de visite"
                            value={visit.scheduled_at ?? '—'}
                        />
                        <div className="flex items-center justify-end">
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                                {visit.status_label ?? '—'}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-3 border-t pt-3 md:grid-cols-3">
                        <InfoItem
                            icon={<LogIn className="size-4" />}
                            label="Arrivée"
                            value={visit.arrival_at ?? '—'}
                        />
                        <InfoItem
                            icon={<LogOut className="size-4" />}
                            label="Départ"
                            value={visit.departure_at ?? '—'}
                        />
                        <InfoItem
                            icon={<Timer className="size-4" />}
                            label="Durée de visite"
                            value={visit.time_with_demandeur ?? '—'}
                        />
                    </div>

                    <div className="space-y-2 border-t pt-3">
                        <p className="text-sm font-medium">Motif de la visite</p>
                        <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
                            {visit.reason || '—'}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
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
        <div className="rounded-md border p-2">
            <p className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                {label}
            </p>
            <p className="text-base font-medium">{value}</p>
        </div>
    );
}

