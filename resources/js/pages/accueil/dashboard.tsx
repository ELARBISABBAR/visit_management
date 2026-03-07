import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { VisitorsLineChart } from '@/components/charts/visitors-line-chart';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type VisitRow = {
    id: number;
    visitor_name: string;
    company?: string | null;
    department?: string | null;
    demandeur?: string | null;
    scheduled_at?: string | null;
    status_label?: string | null;
    badge_color?: string | null;
};

type DashboardProps = {
    stats: {
        planned_today: number;
        present_now: number;
        completed_today: number;
        cancelled_today: number;
    };
    todayVisits: VisitRow[];
    presentVisitors: VisitRow[];
    latestVisits: VisitRow[];
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord – Accueil',
        href: '/accueil/dashboard',
    },
];

export default function AccueilDashboard({
    stats,
    todayVisits,
    presentVisitors,
    latestVisits,
    visitorChart,
    chartFilters,
}: DashboardProps) {
    useEffect(() => {
        const interval = window.setInterval(() => {
            router.reload({
                only: ['stats', 'todayVisits', 'presentVisitors', 'latestVisits', 'visitorChart'],
            });
        }, 30000);

        return () => window.clearInterval(interval);
    }, []);

    const updateChartFilters = (next: Partial<DashboardProps['chartFilters']>) => {
        const merged = { ...chartFilters, ...next };
        router.get(
            '/accueil/dashboard',
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
            <Head title="Tableau de bord – Accueil" />
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard label="Visites prévues aujourd'hui" value={stats.planned_today} />
                    <StatCard
                        label="Visiteurs présents dans le bâtiment"
                        value={stats.present_now}
                    />
                    <StatCard label="Visites terminées aujourd'hui" value={stats.completed_today} />
                    <StatCard label="Visites annulées" value={stats.cancelled_today} />
                </div>

                <DashboardTable title="Visites d'aujourd'hui" rows={todayVisits} />
                <DashboardTable title="Visiteurs actuellement présents" rows={presentVisitors} />
                <DashboardTable title="Dernières visites" rows={latestVisits} />
                <VisitorsLineChart
                    labels={visitorChart.labels}
                    data={visitorChart.data}
                    title="Total des visiteurs par jour"
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
                                    onChange={(e) => updateChartFilters({ month: e.target.value })}
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

function DashboardTable({ title, rows }: { title: string; rows: VisitRow[] }) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
            <h2 className="mb-3 text-lg font-semibold">{title}</h2>
            {rows.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune donnée disponible.</p>
            ) : (
                <ul className="space-y-2 text-sm">
                    {rows.map((row) => (
                        <li key={row.id} className="flex items-center justify-between rounded-md border p-2">
                            <div>
                                <p className="font-medium">{row.visitor_name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {row.company ?? '—'} • {row.demandeur ?? '—'} • {row.department ?? '—'}
                                </p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                                <p>{row.scheduled_at ?? '—'}</p>
                                <p>{row.status_label ?? '—'}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

