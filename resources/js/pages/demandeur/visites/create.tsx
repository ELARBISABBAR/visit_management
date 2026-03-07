import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Department = {
    id: number;
    name: string;
};

type CreateVisitForm = {
    visitor_name: string;
    visitor_type: string;
    company: string;
    department_id: number | '';
    visit_date: string;
    visit_time: string;
    reason: string;
};

type CreateVisitPageProps = {
    departments: Department[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord – Demandeur',
        href: '/demandeur/dashboard',
    },
    {
        title: 'Planifier une visite',
        href: '/demandeur/visites/nouvelle',
    },
];

export default function CreateVisit({ departments }: CreateVisitPageProps) {
    const { data, setData, post, processing, errors } = useForm<CreateVisitForm>({
        visitor_name: '',
        visitor_type: 'visiteur',
        company: '',
        department_id: '',
        visit_date: '',
        visit_time: '',
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/demandeur/visites');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Planifier une visite" />
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border"
            >
                <h1 className="text-lg font-semibold">Planifier une visite</h1>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field
                        label="Nom du visiteur"
                        name="visitor_name"
                        value={data.visitor_name}
                        onChange={(value) => setData('visitor_name', value)}
                        error={errors.visitor_name}
                    />

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="visitor_type" className="text-sm font-medium">
                            Type de visiteur
                        </label>
                        <select
                            id="visitor_type"
                            name="visitor_type"
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={data.visitor_type}
                            onChange={(e) => setData('visitor_type', e.target.value)}
                        >
                            <option value="visiteur">Visiteur</option>
                            <option value="prestataire">Prestataire</option>
                            <option value="fournisseur">Fournisseur</option>
                        </select>
                        {errors.visitor_type && (
                            <p className="text-xs text-destructive">{errors.visitor_type}</p>
                        )}
                    </div>

                    <Field
                        label="Entreprise / Société"
                        name="company"
                        value={data.company}
                        onChange={(value) => setData('company', value)}
                        error={errors.company}
                    />

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="department_id" className="text-sm font-medium">
                            Département à visiter
                        </label>
                        <select
                            id="department_id"
                            name="department_id"
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={data.department_id}
                            onChange={(e) =>
                                setData(
                                    'department_id',
                                    e.target.value ? Number.parseInt(e.target.value, 10) : '',
                                )
                            }
                        >
                            <option value="">Sélectionner un département</option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                        {errors.department_id && (
                            <p className="text-xs text-destructive">{errors.department_id}</p>
                        )}
                    </div>

                    <Field
                        label="Date de visite"
                        name="visit_date"
                        type="date"
                        value={data.visit_date}
                        onChange={(value) => setData('visit_date', value)}
                        error={errors.visit_date}
                    />

                    <Field
                        label="Heure de visite"
                        name="visit_time"
                        type="time"
                        value={data.visit_time}
                        onChange={(value) => setData('visit_time', value)}
                        error={errors.visit_time}
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="reason" className="text-sm font-medium">
                        Motif de la visite
                    </label>
                    <textarea
                        id="reason"
                        name="reason"
                        className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={data.reason}
                        onChange={(e) => setData('reason', e.target.value)}
                    />
                    {errors.reason && <p className="text-xs text-destructive">{errors.reason}</p>}
                </div>

                {errors.visit && (
                    <p className="text-sm font-medium text-destructive">{errors.visit}</p>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Créer la visite
                    </button>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted"
                    >
                        Annuler
                    </button>
                </div>
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
    type?: string;
};

function Field({ label, name, value, onChange, error, type = 'text' }: FieldProps) {
    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={name} className="text-sm font-medium">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

