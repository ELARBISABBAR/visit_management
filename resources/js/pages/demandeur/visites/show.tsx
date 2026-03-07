import { Head, Link, router } from '@inertiajs/react';
import { ActionConfirmDialog } from '@/components/action-confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type VisitDetails = {
    id: number;
    is_event?: boolean;
    event_name?: string | null;
    event_visitors?: string[] | null;
    visitor_name: string;
    visitor_type: string;
    company?: string | null;
    department?: string | null;
    department_id: number;
    scheduled_at?: string | null;
    reason: string;
    status?: string | null;
    status_label?: string | null;
    arrival_at?: string | null;
    badge_color?: string | null;
};

type VisitShowProps = {
    visit: VisitDetails;
    canEdit: boolean;
    canCancel: boolean;
};

export default function VisitShow({ visit, canEdit, canCancel }: VisitShowProps) {
    const badgeColorLabel = badgeColorByVisitorType(visit.visitor_type);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tableau de bord – Demandeur',
            href: '/demandeur/dashboard',
        },
        {
            title: 'Mes visites',
            href: '/demandeur/visites',
        },
        {
            title: 'Détails de la visite',
            href: `/demandeur/visites/${visit.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Détails de la visite" />
            <div className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
                <h1 className="text-lg font-semibold">Détails de la visite</h1>

                <dl className="grid gap-4 md:grid-cols-2">
                    <Detail
                        label={visit.is_event ? "Nom de l'événement" : 'Nom du visiteur'}
                        value={visit.is_event ? visit.event_name ?? visit.visitor_name : visit.visitor_name}
                    />
                    <Detail label="Type de visiteur" value={visit.visitor_type} />
                    <Detail label="Entreprise / Société" value={visit.company ?? '—'} />
                    <Detail label="Département" value={visit.department ?? '—'} />
                    <Detail label="Date / heure de visite" value={visit.scheduled_at ?? '—'} />
                    <Detail label="Statut" value={visit.status_label ?? '—'} />
                    <Detail label="Heure d'arrivée" value={visit.arrival_at ?? '—'} />
                    <Detail label="Couleur du badge attribué" value={badgeColorLabel} />
                </dl>

                {visit.is_event && (
                    <div>
                        <h2 className="mb-1 text-sm font-medium">Participants de l'événement</h2>
                        {visit.event_visitors && visit.event_visitors.length > 0 ? (
                            <ul className="list-inside list-disc text-sm text-muted-foreground">
                                {visit.event_visitors.map((name, index) => (
                                    <li key={`${name}-${index}`}>{name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">Aucun participant renseigné.</p>
                        )}
                    </div>
                )}

                <div>
                    <h2 className="mb-1 text-sm font-medium">Motif de la visite</h2>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {visit.reason}
                    </p>
                </div>

                <div className="flex gap-3">
                    {canEdit && (
                        <Link
                            href={`/demandeur/visites/${visit.id}/modifier`}
                            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted"
                        >
                            Modifier la visite
                        </Link>
                    )}
                    {canCancel && (
                        <ActionConfirmDialog
                            triggerLabel="Annuler la visite"
                            title="Confirmer l'annulation"
                            description="Voulez-vous vraiment annuler cette visite ?"
                            confirmLabel="Oui, annuler"
                            onConfirm={() => router.post(`/demandeur/visites/${visit.id}/annuler`)}
                            triggerClassName="inline-flex items-center rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive shadow-sm hover:bg-destructive/10"
                            confirmClassName="inline-flex items-center rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90"
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase text-muted-foreground">{label}</dt>
            <dd className="text-sm">{value}</dd>
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

