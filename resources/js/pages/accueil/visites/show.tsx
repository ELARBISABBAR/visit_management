import { Head, Link, router } from '@inertiajs/react';
import { ActionConfirmDialog } from '@/components/action-confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import { formatDateTime, formatDurationHoursMinutes, formatTime } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type VisitDetails = {
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
    reason?: string | null;
    badge_color?: string | null;
    arrival_at?: string | null;
    departure_at?: string | null;
    time_with_demandeur?: string | null;
};

type VisitShowProps = {
    visit: VisitDetails;
};

export default function AccueilVisitShow({ visit }: VisitShowProps) {
    const badgeColorLabel = badgeColorByVisitorType(visit.visitor_type);
    const isVisitClosed = isClosedVisit(visit.status, visit.status_label);
    const isVisitInProgress = isInProgressVisit(visit.status, visit.status_label);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord – Accueil', href: '/accueil/dashboard' },
        { title: 'Gestion des visites', href: '/accueil/visites' },
        { title: 'Voir la visite', href: `/accueil/visites/${visit.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Voir la visite" />
            <div className="p-5">
            <div className="space-y-4 rounded-xl border  bg-background p-4 dark:border-sidebar-border">
                <h1 className="text-lg font-semibold">Voir la visite</h1>
                <dl className="grid gap-4 md:grid-cols-2">
                    <Detail
                        label={visit.is_event ? "Nom de l'événement" : 'Nom du visiteur'}
                        value={visit.is_event ? visit.event_name ?? visit.visitor_name : visit.visitor_name}
                    />
                    <Detail label="Type de visiteur" value={visit.visitor_type} />
                    <Detail label="Société" value={visit.company ?? '—'} />
                    <Detail label="Demandeur (hôte)" value={visit.demandeur ?? '—'} />
                    <Detail label="Département" value={visit.department ?? '—'} />
                    <Detail label="Date et heure de visite" value={formatDateTime(visit.scheduled_at)} />
                    <Detail label="Statut de la visite" value={visit.status_label ?? '—'} />
                    <Detail label="Couleur du badge" value={badgeColorLabel} />
                    <Detail label="Heure d'arrivée" value={formatTime(visit.arrival_at)} />
                    <Detail label="Heure de départ" value={formatTime(visit.departure_at)} />
                    <Detail
                        label="Temps passé avec le demandeur"
                        value={formatDurationHoursMinutes(visit.time_with_demandeur)}
                    />
                </dl>
                {visit.is_event && (
                    <div>
                        <p className="text-sm font-medium">Participants de l'événement</p>
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
                    <p className="text-sm font-medium">Motif de la visite</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {visit.reason || '—'}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href="/accueil/visites"
                        className="inline-flex items-center rounded-md bg-[#3B82F6] px-3 py-2 text-sm font-medium text-white hover:bg-[#2563EB]"
                    >
                        Retour
                    </Link>

                    {!isVisitClosed && !isVisitInProgress && (
                        <>
                            <Link
                                href={`/accueil/visites/${visit.id}/modifier`}
                                className="inline-flex items-center rounded-md bg-[#3B82F6] px-3 py-2 text-sm font-medium text-white hover:bg-[#2563EB]"
                            >
                                Modifier la visite
                            </Link>
                            <ActionConfirmDialog
                                triggerLabel="Annuler la visite"
                                title="Confirmer l'annulation"
                                description="Voulez-vous vraiment annuler cette visite ?"
                                confirmLabel="Oui, annuler"
                                onConfirm={() => router.post(`/accueil/visites/${visit.id}/annuler`)}
                                triggerClassName="rounded-md border border-destructive px-3 py-2 text-sm text-destructive"
                                confirmClassName="inline-flex text-white items-center rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90"
                            />
                            <ActionConfirmDialog
                                triggerLabel="Enregistrer l'arrivée"
                                title="Confirmer l'arrivée"
                                description="Confirmer l'enregistrement de l'arrivée du visiteur ?"
                                confirmLabel="Oui, enregistrer"
                                onConfirm={() => router.post(`/accueil/visites/${visit.id}/arrivee`)}
                                triggerClassName="inline-flex items-center rounded-md bg-[#22C55E] px-3 py-2 text-sm font-medium text-white hover:bg-[#16A34A]"
                            />
                        </>
                    )}

                    {!isVisitClosed && (
                        <ActionConfirmDialog
                            triggerLabel="Clôturer la visite"
                            title="Confirmer la clôture"
                            description="Confirmer la clôture de la visite et le retour du badge ?"
                            confirmLabel="Oui, clôturer"
                            onConfirm={() =>
                                router.post(`/accueil/visites/${visit.id}/cloturer`, {
                                    badge_returned: true,
                                })
                            }
                            triggerClassName="inline-flex items-center rounded-md bg-[#EF4444] px-3 py-2 text-sm font-medium text-white hover:bg-[#DC2626]"
                        />
                    )}
                </div>
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

function isClosedVisit(status?: string | null, statusLabel?: string | null): boolean {
    const normalizedStatus = normalizeStatusValue(status);
    const normalizedLabel = normalizeStatusValue(statusLabel);

    return (
        normalizedStatus === 'closed' ||
        normalizedStatus === 'terminee' ||
        normalizedStatus === 'cancelled' ||
        normalizedStatus === 'annulee' ||
        normalizedLabel.includes('terminee') ||
        normalizedLabel.includes('cloturee') ||
        normalizedLabel.includes('closed') ||
        normalizedLabel.includes('annulee') ||
        normalizedLabel.includes('cancelled')
    );
}

function isInProgressVisit(status?: string | null, statusLabel?: string | null): boolean {
    const normalizedStatus = normalizeStatusValue(status);
    const normalizedLabel = normalizeStatusValue(statusLabel);

    return (
        normalizedStatus === 'in_progress' ||
        normalizedStatus === 'encours' ||
        normalizedLabel.includes('en cours') ||
        normalizedLabel.includes('encours')
    );
}

function normalizeStatusValue(value?: string | null): string {
    return (value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

