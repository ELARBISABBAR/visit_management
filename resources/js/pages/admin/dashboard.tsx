import { Head } from '@inertiajs/react';
import {
    Building2,
    IdCard,
    ShieldCheck,
    UserCog,
    Users,
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
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
            <div className="space-y-6 p-4 md:p-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Total Visits" value={metrics.total_users} icon={Users} trend="Global user base" />
                    <StatCard title="Visitors Today" value={metrics.demandeurs} icon={UserCog} trend="Demanders active" />
                    <StatCard title="Visitors Inside" value={metrics.accueils} icon={ShieldCheck} trend="Reception staff available" />
                    <StatCard title="Departments" value={metrics.departments} icon={Building2} trend="Active departments" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <StatCard title="Admin Users" value={metrics.admins} icon={Users} trend="Governance and permissions" />
                    <StatCard title="Badges" value={metrics.badges} icon={IdCard} trend="Available badge inventory" />
                </div>
            </div>
        </AppLayout>
    );
}
