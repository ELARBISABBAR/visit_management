import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type EmailSettings = {
    host?: string | null;
    port?: number | null;
    encryption?: string | null;
    username?: string | null;
    password?: string | null;
    from_address?: string | null;
    from_name?: string | null;
    test_email?: string | null;
    smtp_test?: string | null;
};

type SettingsPageProps = {
    emailSettings: EmailSettings | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin dashboard',
        href: '/admin',
    },
    {
        title: 'Settings',
        href: '/admin/settings',
    },
];

export default function SettingsIndex({ emailSettings }: SettingsPageProps) {
    const { data, setData, put, post, processing, errors } = useForm<EmailSettings>({
        host: emailSettings?.host ?? '',
        port: emailSettings?.port ?? undefined,
        encryption: emailSettings?.encryption ?? '',
        username: emailSettings?.username ?? '',
        password: emailSettings?.password ?? '',
        from_address: emailSettings?.from_address ?? '',
        from_name: emailSettings?.from_name ?? '',
        test_email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/settings');
    };

    const handleTestSmtp = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings/test-smtp', { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin settings" />
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border"
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <TextField
                        label="SMTP host"
                        name="host"
                        value={data.host ?? ''}
                        error={errors.host}
                        onChange={(value) => setData('host', value)}
                    />
                    <TextField
                        label="SMTP port"
                        name="port"
                        type="number"
                        value={data.port?.toString() ?? ''}
                        error={errors.port}
                        onChange={(value) =>
                            setData('port', value ? Number.parseInt(value, 10) : undefined)
                        }
                    />
                    <TextField
                        label="Encryption"
                        name="encryption"
                        value={data.encryption ?? ''}
                        error={errors.encryption}
                        onChange={(value) => setData('encryption', value)}
                    />
                    <TextField
                        label="Username"
                        name="username"
                        value={data.username ?? ''}
                        error={errors.username}
                        onChange={(value) => setData('username', value)}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={data.password ?? ''}
                        error={errors.password}
                        onChange={(value) => setData('password', value)}
                    />
                    <TextField
                        label="From address"
                        name="from_address"
                        value={data.from_address ?? ''}
                        error={errors.from_address}
                        onChange={(value) => setData('from_address', value)}
                    />
                    <TextField
                        label="From name"
                        name="from_name"
                        value={data.from_name ?? ''}
                        error={errors.from_name}
                        onChange={(value) => setData('from_name', value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Save settings
                </button>
            </form>

            <form
                onSubmit={handleTestSmtp}
                className="mt-4 space-y-4 rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border"
            >
                <h2 className="text-base font-semibold">Tester la configuration SMTP</h2>
                <TextField
                    label="Email de test"
                    name="test_email"
                    type="email"
                    value={data.test_email ?? ''}
                    error={errors.test_email || errors.smtp_test}
                    onChange={(value) => setData('test_email', value)}
                />
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Tester SMTP
                </button>
            </form>
        </AppLayout>
    );
}

type TextFieldProps = {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
};

function TextField({ label, name, value, onChange, error, type = 'text' }: TextFieldProps) {
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

