import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Department = {
    id: number;
    name: string;
    description?: string | null;
    is_active: boolean;
};

type DepartmentForm = {
    name: string;
    description: string;
    is_active: boolean;
};

type EditDepartmentPageProps = {
    department: Department;
};

export default function EditDepartment({ department }: EditDepartmentPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin dashboard',
            href: '/admin',
        },
        {
            title: 'Departments',
            href: '/admin/departments',
        },
        {
            title: 'Edit department',
            href: `/admin/departments/${department.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm<DepartmentForm>({
        name: department.name,
        description: department.description ?? '',
        is_active: department.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/departments/${department.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit department" />
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border"
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <Field
                        label="Name"
                        name="name"
                        value={data.name}
                        onChange={(value) => setData('name', value)}
                        error={errors.name}
                    />
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="is_active" className="text-sm font-medium">
                            Active
                        </label>
                        <input
                            id="is_active"
                            name="is_active"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                        />
                    </div>
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="description" className="text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    {errors.description && (
                        <p className="text-xs text-destructive">{errors.description}</p>
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

