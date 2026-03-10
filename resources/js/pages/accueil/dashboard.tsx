import { Head, router } from '@inertiajs/react';
import { Building2, CalendarDays, Clock3, Users } from 'lucide-react';
import { useEffect } from 'react';
import { VisitorsLineChart } from '@/components/charts/visitors-line-chart';
import { DataTable, DataTableCell, DataTableRow } from '@/components/ui/data-table';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type VisitRow = {
    id: number;
    visitor_name: string;
    company?: string | null;
    department?: string | null;
    demandeur?: string | null;
    scheduled_at?: string | null;
    status?: string | null;
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
            <div className="space-y-6 p-4 md:p-6">
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Visites totales" value={stats.planned_today} icon={CalendarDays} trend="Visites programmées aujourd'hui" />
                    <StatCard title="Visiteurs aujourd'hui" value={todayVisits.length} icon={Users} trend="Arrivées attendues aujourd'hui" />
                    <StatCard title="Visiteurs à l'intérieur" value={stats.present_now} icon={Building2} trend="Actuellement dans le bâtiment" />
                    <StatCard title="Visites terminées" value={stats.completed_today} icon={Clock3} trend="Visites clôturées aujourd'hui" />
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <div>
                        <VisitorsLineChart
                            labels={visitorChart.labels}
                            data={visitorChart.data}
                            title="Total des visiteurs par jour"
                            actions={
                                <div className="flex flex-wrap items-center gap-2">
                                    <select
                                        className="rounded-lg border border-input bg-white px-3 py-2 text-xs"
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
                                            className="rounded-lg border border-input bg-white px-3 py-2 text-xs"
                                            value={chartFilters.month}
                                            onChange={(e) => updateChartFilters({ month: e.target.value })}
                                        />
                                    ) : (
                                        <>
                                            <input
                                                type="date"
                                                className="rounded-lg border border-input bg-white px-3 py-2 text-xs"
                                                value={chartFilters.date_from}
                                                onChange={(e) =>
                                                    updateChartFilters({
                                                        date_from: e.target.value,
                                                    })
                                                }
                                            />
                                            <input
                                                type="date"
                                                className="rounded-lg border border-input bg-white px-3 py-2 text-xs"
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

                    <div className="space-y-5">
                        <DashboardTable title="Visites d'aujourd'hui" rows={todayVisits} />
                        <DashboardTable title="Visiteurs actuellement présents" rows={presentVisitors} />
                    </div>

                </section>

                <DashboardTable title="Dernières visites" rows={latestVisits} />


            </div>
        </AppLayout>
    );
}

function DashboardTable({ title, rows }: { title: string; rows: VisitRow[] }) {
    return (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
            {rows.length === 0 ? (
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 text-sm text-[#6B7280] shadow-sm">
                    Aucune donnée disponible.
                </div>
            ) : (
                <DataTable headers={['Visitor', 'Company', 'Department', 'Host', 'Arrival', 'Status']}>
                    {rows.map((row) => (
                        <DataTableRow key={row.id}>
                            <DataTableCell className="font-medium">{row.visitor_name}</DataTableCell>
                            <DataTableCell className="text-[#6B7280]">{row.company ?? '-'}</DataTableCell>
                            <DataTableCell className="text-[#6B7280]">{row.department ?? '-'}</DataTableCell>
                            <DataTableCell className="text-[#6B7280]">{row.demandeur ?? '-'}</DataTableCell>
                            <DataTableCell className="text-[#6B7280]">{row.scheduled_at ?? '-'}</DataTableCell>
                            <DataTableCell>
                                <StatusBadge status={row.status} label={row.status_label} />
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTable>
            )}
        </div>
    );
}

