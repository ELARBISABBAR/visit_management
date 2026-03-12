import { Head, router, usePage } from '@inertiajs/react';
import { Building2, CalendarDays, Clock3, Users } from 'lucide-react';
import { useEffect } from 'react';
import { VisitorsLineChart } from '@/components/charts/visitors-line-chart';
import { DataTable, DataTableCell, DataTableRow } from '@/components/ui/data-table';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import { formatDateTime, formatTime } from '@/lib/utils';
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

            <div className="space-y-6 p-4 md:p-6">
                {/* Stats */}
                <section>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <StatCard title="Visites totales" value={stats.upcoming} icon={CalendarDays} trend="Visites programmées à venir" />
                        <StatCard title="Visiteurs aujourd'hui" value={stats.today} icon={Users} trend="Visites prévues pour aujourd'hui" />
                        <StatCard title="Visiteurs à l'intérieur" value={stats.in_progress} icon={Building2} trend="Visites actuellement en cours" />
                        <StatCard title="Visites terminées" value={stats.completed} icon={Clock3} trend="Nombre de visites clôturées" />
                    </div>
                </section>

                {/* Section 2: Chart left + visits right */}
                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="">
                        <VisitorsLineChart
                            labels={visitorChart.labels}
                            data={visitorChart.data}
                            title="Total de vos visiteurs par jour"
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
                                            onChange={(e) =>
                                                updateChartFilters({ month: e.target.value })
                                            }
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
                    </div>
                </section>

                {/* Section 3: Notifications */}
                <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#111827]">Notifications</h2>
                    {notifications.length === 0 ? (
                        <p className="mt-3 text-sm text-[#6B7280]">
                            Aucune notification pour le moment.
                        </p>
                    ) : (
                        <ul className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {notifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-sm"
                                >
                                    <p className="font-medium text-[#111827]">
                                        {notification.data.message ?? 'Notification'}
                                    </p>
                                    {notification.data.visitor_name && (
                                        <p className="text-xs text-[#6B7280]">
                                            Visiteur : {notification.data.visitor_name}
                                        </p>
                                    )}
                                    {notification.data.company && (
                                        <p className="text-xs text-[#6B7280]">
                                            Société : {notification.data.company}
                                        </p>
                                    )}
                                    {notification.data.arrival_time && (
                                        <p className="text-xs text-[#6B7280]">
                                            Heure d&apos;arrivée : {formatTime(notification.data.arrival_time)}
                                        </p>
                                    )}
                                    {notification.data.department && (
                                        <p className="text-xs text-[#6B7280]">
                                            Département : {notification.data.department}
                                        </p>
                                    )}
                                    {notification.data.badge_color && (
                                        <p className="text-xs text-[#6B7280]">
                                            Couleur du badge : {notification.data.badge_color}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}

type DashboardSectionProps = {
    title: string;
    visits: VisitSummary[];
    emptyText: string;
};

function DashboardSection({ title, visits, emptyText }: DashboardSectionProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
            {visits.length === 0 ? (
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 text-sm text-[#6B7280] shadow-sm">
                    {emptyText}
                </div>
            ) : (
                <DataTable headers={['Visitor', 'Company', 'Department', 'Date', 'Status']}>
                    {visits.map((visit) => (
                        <DataTableRow key={visit.id}>
                            <DataTableCell className="font-medium">{visit.visitor_name}</DataTableCell>
                            <DataTableCell className="text-[#6B7280]">{visit.company ?? '-'}</DataTableCell>
                            <DataTableCell className="text-[#6B7280]">{visit.department ?? '-'}</DataTableCell>
                            <DataTableCell className="text-[#6B7280]">{formatDateTime(visit.scheduled_at)}</DataTableCell>
                            <DataTableCell>
                                <StatusBadge status={visit.status} label={visit.status_label} />
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTable>
            )}
        </div>
    );
}

