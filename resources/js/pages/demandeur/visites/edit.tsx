import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Department = {
    id: number;
    name: string;
};

type VisitEdit = {
    id: number;
    is_event?: boolean;
    event_name?: string | null;
    event_visitors?: string[] | null;
    visitor_name: string;
    visitor_type: string;
    company?: string | null;
    department_id: number;
    visit_date: string;
    visit_time: string;
    reason: string;
};

type EditVisitForm = {
    is_event: boolean;
    visitor_name: string;
    event_name: string;
    event_visitors: string[];
    visitor_type: string;
    company: string;
    department_id: number | '';
    visit_date: string;
    visit_time: string;
    reason: string;
};

type EditVisitPageProps = {
    visit: VisitEdit;
    departments: Department[];
};

export default function EditVisit({ visit, departments }: EditVisitPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tableau de bord – Demandeur',
            href: '/demandeur/dashboard',
        },
        {
            title: 'Mes visites',
            href: '/demandeur/visites',
        },
        {
            title: 'Modifier la visite',
            href: `/demandeur/visites/${visit.id}/modifier`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm<EditVisitForm>({
        is_event: Boolean(visit.is_event),
        visitor_name: visit.visitor_name,
        event_name: visit.event_name ?? visit.visitor_name,
        event_visitors: visit.event_visitors && visit.event_visitors.length > 0 ? visit.event_visitors : [''],
        visitor_type: visit.visitor_type,
        company: visit.company ?? '',
        department_id: visit.department_id,
        visit_date: visit.visit_date,
        visit_time: visit.visit_time,
        reason: visit.reason,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/demandeur/visites/${visit.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modifier la visite" />
            <div className="p-5">
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-xl border bg-background p-4 dark:border-sidebar-border"
            >
                <h1 className="text-lg font-semibold ">Modifier la visite</h1>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="is_event" className="text-sm font-medium">
                            Type de visite
                        </label>
                        <select
                            id="is_event"
                            name="is_event"
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={data.is_event ? '1' : '0'}
                            onChange={(e) => setData('is_event', e.target.value === '1')}
                        >
                            <option value="0">Visite normale</option>
                            <option value="1">Visite événement</option>
                        </select>
                    </div>

                    <Field
                        label={data.is_event ? "Nom de l'événement" : 'Nom du visiteur'}
                        name="visitor_name"
                        value={data.is_event ? data.event_name : data.visitor_name}
                        onChange={(value) =>
                            data.is_event ? setData('event_name', value) : setData('visitor_name', value)
                        }
                        error={data.is_event ? errors.event_name : errors.visitor_name}
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

                {data.is_event && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-medium">Participants de l'événement</h2>
                            <button
                                type="button"
                                className="rounded-md border px-3 py-1 text-xs"
                                onClick={() => setData('event_visitors', [...data.event_visitors, ''])}
                            >
                                Ajouter un nom
                            </button>
                        </div>

                        <div className="space-y-2">
                            {data.event_visitors.map((name, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder={`Participant ${index + 1}`}
                                        value={name}
                                        onChange={(e) => {
                                            const next = [...data.event_visitors];
                                            next[index] = e.target.value;
                                            setData('event_visitors', next);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="rounded-md border border-destructive px-3 py-2 text-xs text-destructive"
                                        onClick={() => {
                                            const next = data.event_visitors.filter((_, i) => i !== index);
                                            setData('event_visitors', next.length > 0 ? next : ['']);
                                        }}
                                    >
                                        Retirer
                                    </button>
                                </div>
                            ))}
                        </div>
                        {(errors.event_visitors || errors['event_visitors.0']) && (
                            <p className="text-xs text-destructive">
                                {errors.event_visitors ?? errors['event_visitors.0']}
                            </p>
                        )}
                    </div>
                )}

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
                    <p className="text-sm font-medium text-destructive">
                        Cette visite est déjà en cours et ne peut pas être modifiée.
                    </p>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Enregistrer les modifications
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
            </div>
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

