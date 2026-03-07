import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Badge = {
    id: number;
    code: string;
    label?: string | null;
    visitor_type: 'visiteur' | 'prestataire' | 'fournisseur';
    status: string;
};

type BadgeForm = {
    code: string;
    label: string;
    visitor_type: 'visiteur' | 'prestataire' | 'fournisseur';
};

type EditBadgePageProps = {
    badge: Badge;
};

export default function EditBadge({ badge }: EditBadgePageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin dashboard',
            href: '/admin',
        },
        {
            title: 'Badges',
            href: '/admin/badges',
        },
        {
            title: 'Edit badge',
            href: `/admin/badges/${badge.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm<BadgeForm>({
        code: badge.code,
        label: badge.label ?? '',
        visitor_type: badge.visitor_type,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/badges/${badge.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit badge" />
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border"
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <Field
                        label="Code"
                        name="code"
                        value={data.code}
                        onChange={(value) => setData('code', value)}
                        error={errors.code}
                    />
                    <Field
                        label="Label"
                        name="label"
                        value={data.label}
                        onChange={(value) => setData('label', value)}
                        error={errors.label}
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="visitor_type" className="text-sm font-medium">
                        Type de visiteur
                    </label>
                    <select
                        id="visitor_type"
                        name="visitor_type"
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={data.visitor_type}
                        onChange={(e) =>
                            setData(
                                'visitor_type',
                                e.target.value as 'visiteur' | 'prestataire' | 'fournisseur',
                            )
                        }
                    >
                        <option value="visiteur">Visiteur</option>
                        <option value="prestataire">Prestataire</option>
                        <option value="fournisseur">Fournisseur</option>
                    </select>
                    {errors.visitor_type && (
                        <p className="text-xs text-destructive">{errors.visitor_type}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Save changes
                </button>
            </form>
        </AppLayout>
    );
}

type FieldProps = {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
};

function Field({ label, name, value, onChange, error }: FieldProps) {
    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={name} className="text-sm font-medium">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type="text"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

