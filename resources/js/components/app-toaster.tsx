import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type ToastItem = {
    id: number;
    message: string;
    type: 'success' | 'error';
};

type PageProps = {
    flash?: {
        success?: string;
        error?: string;
    };
};

// Prevent duplicate toasts (notably in React StrictMode double effects).
const activeToastKeys = new Set<string>();

export function AppToaster() {
    const { props } = usePage<PageProps>();
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        const flash = props.flash;

        if (flash?.success) {
            pushToast(flash.success, 'success');
        }

        if (flash?.error) {
            pushToast(flash.error, 'error');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.flash?.success, props.flash?.error]);

    const pushToast = (message: string, type: 'success' | 'error') => {
        const toastKey = `${type}:${message}`;
        if (activeToastKeys.has(toastKey)) {
            return;
        }

        activeToastKeys.add(toastKey);
        const id = Date.now() + Math.floor(Math.random() * 1000);
        setToasts((current) => [...current, { id, message, type }]);

        window.setTimeout(() => {
            activeToastKeys.delete(toastKey);
            setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 3500);
    };

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto max-w-sm rounded-md border px-4 py-3 text-sm shadow-md ${
                        toast.type === 'success'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                            : 'border-rose-300 bg-rose-50 text-rose-800'
                    }`}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
}

