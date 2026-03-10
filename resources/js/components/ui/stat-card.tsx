import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCardProps = {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend?: string;
    className?: string;
};

export function StatCard({
    title,
    value,
    icon: Icon,
    trend = 'Mise a jour en temps reel',
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md',
                className,
            )}
        >
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-[#6B7280]">{title}</p>
                <div className="rounded-lg bg-[#FFF4CC] p-2 text-[#D99A00]">
                    <Icon className="size-4" />
                </div>
            </div>
            <p className="text-3xl font-semibold text-[#111827]">{value}</p>
            <p className="mt-2 inline-flex items-center gap-1 text-xs text-[#6B7280]">
                <ArrowUpRight className="size-3 text-[#22C55E]" />
                {trend}
            </p>
        </div>
    );
}
