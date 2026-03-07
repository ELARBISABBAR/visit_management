import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type CreateUserForm = {
    name: string;
    email: string;
    password: string;
    role: string;
};

type CreateUserPageProps = {
    roles: string[];
};

const breadcrumbsBase: BreadcrumbItem[] = [
    {
        title: 'Admin dashboard',
        href: '/admin',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
];

export default function CreateUser({ roles }: CreateUserPageProps) {
    const { data, setData, post, processing, errors } = useForm<CreateUserForm>({
        name: '',
        email: '',
        password: '',
        role: roles[0] ?? 'demandeur',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AppLayout
            breadcrumbs={[
                ...breadcrumbsBase,
                { title: 'Create user', href: '/admin/users/create' },
            ]}
        >
            <Head title="Create user" />
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
                    <Field
                        label="Email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(value) => setData('email', value)}
                        error={errors.email}
                    />
                    <Field
                        label="Password"
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={(value) => setData('password', value)}
                        error={errors.password}
                    />
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="role" className="text-sm font-medium">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                        >
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p className="text-xs text-destructive">{errors.role}</p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Create user
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

