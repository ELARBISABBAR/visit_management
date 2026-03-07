import { Head, Link, router } from '@inertiajs/react';
import { PaginationControls } from '@/components/pagination-controls';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Badge = {
    id: number;
    code: string;
    label?: string | null;
    visitor_type: 'visiteur' | 'prestataire' | 'fournisseur';
    status: string;
};

type BadgesPageProps = {
    badges: {
        data: Badge[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin dashboard',
        href: '/admin',
    },
    {
        title: 'Badges',
        href: '/admin/badges',
    },
];

export default function BadgesIndex({ badges }: BadgesPageProps) {
    const handleDelete = (id: number) => {
        if (!window.confirm('Delete this badge?')) return;
        router.delete(`/admin/badges/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Badges" />
            <div className="mb-4 flex justify-end">
                <Link
                    href="/admin/badges/create"
                    className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                    Create badge
                </Link>
            </div>
            <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
                <table className="min-w-full text-left text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 pr-4">Code (couleur du badge)</th>
                            <th className="py-2 pr-4">Label</th>
                            <th className="py-2 pr-4">Type de visiteur</th>
                            <th className="py-2 pr-4">Status</th>
                            <th className="py-2 pr-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {badges.data.map((badge) => (
                            <tr key={badge.id} className="border-b last:border-b-0">
                                <td className="py-2 pr-4">{badge.code}</td>
                                <td className="py-2 pr-4 text-muted-foreground">
                                    {badge.label ?? '—'}
                                </td>
                                <td className="py-2 pr-4">{badge.visitor_type}</td>
                                <td className="py-2 pr-4">{badge.visitor_type}</td>
                                <td className="py-2 pr-4 text-right space-x-2">
                                    <Link
                                        href={`/admin/badges/${badge.id}/edit`}
                                        className="rounded-md border px-2 py-1 text-xs"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(badge.id)}
                                        className="rounded-md border border-destructive px-2 py-1 text-xs text-destructive"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <PaginationControls pagination={badges} />
            </div>
        </AppLayout>
    );
}

