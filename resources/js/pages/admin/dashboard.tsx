import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type AdminDashboardProps = {
    metrics: {
        total_users: number;
        admins: number;
        demandeurs: number;
        accueils: number;
        departments: number;
        badges: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin dashboard',
        href: '/admin',
    },
];

export default function AdminDashboard({ metrics }: AdminDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin dashboard" />
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard label="Total users" value={metrics.total_users} />
                <StatCard label="Admins" value={metrics.admins} />
                <StatCard label="Demandeurs" value={metrics.demandeurs} />
                <StatCard label="Accueil" value={metrics.accueils} />
                <StatCard label="Departments" value={metrics.departments} />
                <StatCard label="Badges" value={metrics.badges} />
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

