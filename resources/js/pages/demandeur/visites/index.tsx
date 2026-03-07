import { Head, Link, router } from '@inertiajs/react';
import { ActionConfirmDialog } from '@/components/action-confirm-dialog';
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

type VisitsIndexProps = {
    visits: {
        data: VisitRow[];
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
            <div className="mb-4 flex justify-end">
                <Link
                    href="/demandeur/visites/nouvelle"
                    className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                    Nouvelle visite
                </Link>
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
                                    Aucune visite trouvée.
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
                                    <td className="py-2 pr-4 text-right space-x-2">
                                        <Link
                                            href={`/demandeur/visites/${visit.id}`}
                                            className="rounded-md border px-2 py-1 text-xs"
                                        >
                                            Détails
                                        </Link>
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
                                            triggerClassName="rounded-md border border-destructive px-2 py-1 text-xs text-destructive"
                                            confirmClassName="inline-flex items-center rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90"
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}

