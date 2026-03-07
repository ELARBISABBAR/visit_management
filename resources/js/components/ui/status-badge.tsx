import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
    planned: 'border-[#93C5FD] bg-[#EFF6FF] text-[#1D4ED8]',
    in_progress: 'border-[#86EFAC] bg-[#F0FDF4] text-[#15803D]',
    inside: 'border-[#86EFAC] bg-[#F0FDF4] text-[#15803D]',
    waiting_badge_return: 'border-[#FDBA74] bg-[#FFF7ED] text-[#C2410C]',
    closed: 'border-[#D1D5DB] bg-[#F9FAFB] text-[#4B5563]',
    cancelled: 'border-[#FCA5A5] bg-[#FEF2F2] text-[#B91C1C]',
};

const statusLabels: Record<string, string> = {
    planned: 'Planned visit',
    in_progress: 'Visitor inside',
    inside: 'Visitor inside',
    waiting_badge_return: 'Waiting badge return',
    closed: 'Visit closed',
    cancelled: 'Cancelled visit',
};

type StatusBadgeProps = {
    status?: string | null;
    label?: string | null;
    className?: string;
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
    if (!status && !label) {
        return <Badge variant="outline">-</Badge>;
    }

    const key = (status ?? '').toLowerCase();
    const text = label ?? statusLabels[key] ?? key.replaceAll('_', ' ');

    return (
        <Badge className={cn('font-medium capitalize', statusStyles[key] ?? 'border-border bg-muted text-muted-foreground', className)}>
            {text}
        </Badge>
    );
}
