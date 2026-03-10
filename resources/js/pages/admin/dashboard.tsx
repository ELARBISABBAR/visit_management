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
                    <StatCard title="Utilisateurs totaux" value={metrics.total_users} icon={Users} trend="Base utilisateurs globale" />
                    <StatCard title="Demandeurs" value={metrics.demandeurs} icon={UserCog} trend="Demandeurs actifs" />
                    <StatCard title="Agents d'accueil" value={metrics.accueils} icon={ShieldCheck} trend="Personnel d'accueil disponible" />
                    <StatCard title="Départements" value={metrics.departments} icon={Building2} trend="Départements actifs" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <StatCard title="Administrateurs" value={metrics.admins} icon={Users} trend="Gouvernance et permissions" />
                    <StatCard title="Badges" value={metrics.badges} icon={IdCard} trend="Stock de badges disponible" />
                </div>
            </div>
        </AppLayout>
    );
}
