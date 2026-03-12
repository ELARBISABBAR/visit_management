import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

function parseDateTime(value?: string | null): Date | null {
    if (!value) return null;

    if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
        const timeOnly = new Date(`1970-01-01T${value}`);
        if (!Number.isNaN(timeOnly.getTime())) return timeOnly;
    }

    const normalized = value.includes('T') ? value : value.replace(' ', 'T');
    const parsed = new Date(normalized);

    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
}

export function formatTime(value?: string | null): string {
    const parsed = parseDateTime(value);
    if (!parsed) return '—';

    return parsed.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

export function formatDate(value?: string | null): string {
    const parsed = parseDateTime(value);
    if (!parsed) return '—';

    return parsed.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export function formatDateTime(value?: string | null): string {
    const parsed = parseDateTime(value);
    if (!parsed) return '—';

    return `${formatDate(value)} • ${formatTime(value)}`;
}

export function formatDurationHoursMinutes(value?: string | null): string {
    if (!value) return '—';

    const trimmed = value.trim();
    if (!trimmed) return '—';

    const hhmmssMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (hhmmssMatch) {
        const hours = Number(hhmmssMatch[1]);
        const minutes = Number(hhmmssMatch[2]);
        const totalMinutes = hours * 60 + minutes;
        return formatDurationLabel(totalMinutes);
    }

    const normalized = trimmed.toLowerCase().replace(',', '.');
    const hourMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(h|heure|heures)/);
    const minuteMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(m|min|minute|minutes)/);

    if (hourMatch || minuteMatch) {
        const hours = hourMatch ? Number(hourMatch[1]) : 0;
        const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
        const totalMinutes = Math.round(hours * 60 + minutes);
        return formatDurationLabel(totalMinutes);
    }

    const numberOnly = Number(normalized);
    if (!Number.isNaN(numberOnly)) {
        const totalMinutes = Math.round(numberOnly);
        return formatDurationLabel(totalMinutes);
    }

    return '—';
}

function formatDurationLabel(totalMinutes: number): string {
    const safeMinutes = Math.max(0, totalMinutes);

    if (safeMinutes < 60) {
        return `${safeMinutes}min`;
    }

    const hours = Math.floor(safeMinutes / 60);
    const minutes = safeMinutes % 60;

    return `${hours}h ${String(minutes).padStart(2, '0')}min`;
}
