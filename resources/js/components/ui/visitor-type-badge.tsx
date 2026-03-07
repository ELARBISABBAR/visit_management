import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const visitorTypeStyles: Record<string, string> = {
    visiteur: 'border-[#93C5FD] bg-[#EFF6FF] text-[#1E40AF]',
    prestataire: 'border-[#FCD34D] bg-[#FFFBEB] text-[#A16207]',
    fournisseur: 'border-[#FCA5A5] bg-[#FEF2F2] text-[#B91C1C]',
};

type VisitorTypeBadgeProps = {
    type?: string | null;
    className?: string;
};

export function VisitorTypeBadge({ type, className }: VisitorTypeBadgeProps) {
    if (!type) {
        return <Badge variant="outline">-</Badge>;
    }

    const key = type.toLowerCase();
    return (
        <Badge className={cn('font-medium capitalize', visitorTypeStyles[key] ?? 'border-border bg-muted text-muted-foreground', className)}>
            {type}
        </Badge>
    );
}
