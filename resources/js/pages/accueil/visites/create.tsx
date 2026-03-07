import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Option = { id: number; name: string };

type CreatePageProps = {
    demandeurs: Option[];
    departments: Option[];
};

type VisitForm = {
    visitor_name: string;
    visitor_type: string;
    company: string;
    demandeur_id: number | '';
    department_id: number | '';
    visit_date: string;
    visit_time: string;
    reason: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord – Accueil', href: '/accueil/dashboard' },
    { title: 'Gestion des visites', href: '/accueil/visites' },
    { title: 'Créer une visite', href: '/accueil/visites/nouvelle' },
];

export default function CreateAccueilVisit({ demandeurs, departments }: CreatePageProps) {
    const { data, setData, post, processing, errors } = useForm<VisitForm>({
        visitor_name: '',
        visitor_type: 'visiteur',
        company: '',
        demandeur_id: '',
        department_id: '',
        visit_date: '',
        visit_time: '',
        reason: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/accueil/visites');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer une visite" />
            <form
                onSubmit={submit}
                className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border"
            >
                <h1 className="text-lg font-semibold">Créer une visite</h1>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field
                        label="Nom du visiteur"
                        value={data.visitor_name}
                        onChange={(v) => setData('visitor_name', v)}
                        error={errors.visitor_name}
                    />
                    <SelectField
                        label="Type de visiteur"
                        value={data.visitor_type}
                        onChange={(v) => setData('visitor_type', v)}
                        options={[
                            { value: 'visiteur', label: 'Visiteur' },
                            { value: 'prestataire', label: 'Prestataire' },
                            { value: 'fournisseur', label: 'Fournisseur' },
                        ]}
                        error={errors.visitor_type}
                    />
                    <Field
                        label="Société"
                        value={data.company}
                        onChange={(v) => setData('company', v)}
                        error={errors.company}
                    />
                    <SelectField
                        label="Demandeur (employé à visiter)"
                        value={data.demandeur_id === '' ? '' : String(data.demandeur_id)}
                        onChange={(v) => setData('demandeur_id', v ? Number.parseInt(v, 10) : '')}
                        options={demandeurs.map((d) => ({ value: String(d.id), label: d.name }))}
                        placeholder="Sélectionner un demandeur"
                        error={errors.demandeur_id}
                    />
                    <SelectField
                        label="Département"
                        value={data.department_id === '' ? '' : String(data.department_id)}
                        onChange={(v) => setData('department_id', v ? Number.parseInt(v, 10) : '')}
                        options={departments.map((d) => ({ value: String(d.id), label: d.name }))}
                        placeholder="Sélectionner un département"
                        error={errors.department_id}
                    />
                    <Field
                        label="Date de visite"
                        type="date"
                        value={data.visit_date}
                        onChange={(v) => setData('visit_date', v)}
                        error={errors.visit_date}
                    />
                    <Field
                        label="Heure de visite"
                        type="time"
                        value={data.visit_time}
                        onChange={(v) => setData('visit_time', v)}
                        error={errors.visit_time}
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Motif de la visite</label>
                    <textarea
                        className="min-h-[90px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={data.reason}
                        onChange={(e) => setData('reason', e.target.value)}
                    />
                    {errors.reason && <p className="text-xs text-destructive">{errors.reason}</p>}
                </div>
                {errors.visit && <p className="text-sm text-destructive">{errors.visit}</p>}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
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

function Field({
    label,
    value,
    onChange,
    error,
    type = 'text',
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
}) {
    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <input
                type={type}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

function SelectField({
    label,
    value,
    onChange,
    options,
    error,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    error?: string;
    placeholder?: string;
}) {
    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">{placeholder ?? 'Sélectionner'}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

