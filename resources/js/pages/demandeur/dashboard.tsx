import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { VisitorsLineChart } from '@/components/charts/visitors-line-chart';
import AppLayout from '@/layouts/app-layout';
import type { Auth, BreadcrumbItem } from '@/types';

type VisitSummary = {
    id: number;
    visitor_name: string;
    company?: string | null;
    department?: string | null;
    scheduled_at?: string | null;
    status?: string | null;
    status_label?: string | null;
};

type DemandeurDashboardProps = {
    stats: {
        upcoming: number;
        today: number;
        in_progress: number;
        completed: number;
    };
    upcomingVisits: VisitSummary[];
    todayVisits: VisitSummary[];
    historyVisits: VisitSummary[];
    visitorChart: {
        labels: string[];
        data: number[];
    };
    chartFilters: {
        mode: 'month' | 'custom';
        month: string;
        date_from: string;
        date_to: string;
    };
};

type SharedPageProps = {
    auth: Auth;
    notifications?: Array<{
        id: string;
        data: {
            type: string;
            message: string;
            visitor_name?: string;
            company?: string;
            arrival_time?: string;
            department?: string;
            badge_color?: string;
        };
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord – Demandeur',
        href: '/demandeur/dashboard',
    },
];

export default function DemandeurDashboard({
    stats,
    upcomingVisits,
    todayVisits,
    historyVisits,
    visitorChart,
    chartFilters,
}: DemandeurDashboardProps) {
    const page = usePage<SharedPageProps>();

    // Simple automatic refresh to reflect status changes
    useEffect(() => {
        const interval = window.setInterval(() => {
            router.reload({
                only: ['stats', 'upcomingVisits', 'todayVisits', 'historyVisits', 'visitorChart'],
            });
        }, 30000);

        return () => window.clearInterval(interval);
    }, []);

    const notifications = page.props.notifications ?? [];
    const updateChartFilters = (next: Partial<DemandeurDashboardProps['chartFilters']>) => {
        const merged = { ...chartFilters, ...next };
        router.get(
            '/demandeur/dashboard',
            {
                chart_mode: merged.mode,
                chart_month: merged.month,
                chart_date_from: merged.date_from,
                chart_date_to: merged.date_to,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tableau de bord – Demandeur" />

            <div className="space-y-6">
                <section>
                    <h2 className="mb-3 text-lg font-semibold">Statistiques</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        <StatCard label="Visites prévues" value={stats.upcoming} />
                        <StatCard label="Visites aujourd'hui" value={stats.today} />
                        <StatCard label="Visites en cours" value={stats.in_progress} />
                        <StatCard label="Visites terminées" value={stats.completed} />
                    </div>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-semibold">Actions rapides</h2>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => router.get('/demandeur/visites/nouvelle')}
                            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            Nouvelle visite
                        </button>
                        <button
                            type="button"
                            onClick={() => router.get('/demandeur/visites')}
                            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted"
                        >
                            Voir les détails
                        </button>
                        <button
                            type="button"
                            onClick={() => router.get('/demandeur/visites/historique')}
                            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted"
                        >
                            Annuler la visite
                        </button>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                    <div className="space-y-6">
                        <DashboardSection
                            title="Mes visites à venir"
                            visits={upcomingVisits}
                            emptyText="Aucune visite à venir."
                        />
                        <DashboardSection
                            title="Visites d'aujourd'hui"
                            visits={todayVisits}
                            emptyText="Aucune visite prévue aujourd'hui."
                        />
                        <DashboardSection
                            title="Historique des visites"
                            visits={historyVisits}
                            emptyText="Aucune visite passée."
                        />
                        <VisitorsLineChart
                            labels={visitorChart.labels}
                            data={visitorChart.data}
                            title="Total de vos visiteurs par jour"
                            actions={
                                <div className="flex flex-wrap items-center gap-2">
                                    <select
                                        className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                                        value={chartFilters.mode}
                                        onChange={(e) =>
                                            updateChartFilters({
                                                mode: e.target.value as 'month' | 'custom',
                                            })
                                        }
                                    >
                                        <option value="month">Par mois</option>
                                        <option value="custom">Période personnalisée</option>
                                    </select>

                                    {chartFilters.mode === 'month' ? (
                                        <input
                                            type="month"
                                            className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                                            value={chartFilters.month}
                                            onChange={(e) =>
                                                updateChartFilters({ month: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <>
                                            <input
                                                type="date"
                                                className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                                                value={chartFilters.date_from}
                                                onChange={(e) =>
                                                    updateChartFilters({
                                                        date_from: e.target.value,
                                                    })
                                                }
                                            />
                                            <input
                                                type="date"
                                                className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                                                value={chartFilters.date_to}
                                                onChange={(e) =>
                                                    updateChartFilters({
                                                        date_to: e.target.value,
                                                    })
                                                }
                                            />
                                        </>
                                    )}
                                </div>
                            }
                        />
                    </div>

                    <aside className="space-y-3 rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
                        <h2 className="text-lg font-semibold">Notifications</h2>
                        {notifications.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Aucune notification pour le moment.
                            </p>
                        ) : (
                            <ul className="space-y-2 text-sm">
                                {notifications.map((notification) => (
                                    <li
                                        key={notification.id}
                                        className="rounded-md border bg-muted/40 p-2"
                                    >
                                        <p className="font-medium">
                                            {notification.data.message ?? 'Notification'}
                                        </p>
                                        {notification.data.visitor_name && (
                                            <p className="text-xs text-muted-foreground">
                                                Visiteur : {notification.data.visitor_name}
                                            </p>
                                        )}
                                        {notification.data.company && (
                                            <p className="text-xs text-muted-foreground">
                                                Société : {notification.data.company}
                                            </p>
                                        )}
                                        {notification.data.arrival_time && (
                                            <p className="text-xs text-muted-foreground">
                                                Heure d&apos;arrivée :{' '}
                                                {notification.data.arrival_time}
                                            </p>
                                        )}
                                        {notification.data.department && (
                                            <p className="text-xs text-muted-foreground">
                                                Département : {notification.data.department}
                                            </p>
                                        )}
                                        {notification.data.badge_color && (
                                            <p className="text-xs text-muted-foreground">
                                                Couleur du badge : {notification.data.badge_color}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </aside>
                </section>
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
    );
}

type DashboardSectionProps = {
    title: string;
    visits: VisitSummary[];
    emptyText: string;
};

function DashboardSection({ title, visits, emptyText }: DashboardSectionProps) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
            <h3 className="mb-3 text-base font-semibold">{title}</h3>
            {visits.length === 0 ? (
                <p className="text-sm text-muted-foreground">{emptyText}</p>
            ) : (
                <ul className="space-y-2 text-sm">
                    {visits.map((visit) => (
                        <li key={visit.id} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{visit.visitor_name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {visit.company ?? '—'} • {visit.department ?? '—'}
                                </p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                                <p>{visit.scheduled_at}</p>
                                {visit.status_label && <p>{visit.status_label}</p>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

