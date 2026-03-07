import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DataTableProps = {
    headers: ReactNode[];
    children: ReactNode;
    className?: string;
};

export function DataTable({ headers, children, className }: DataTableProps) {
    return (
        <div className={cn('overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-sm', className)}>
            <table className="min-w-full text-left text-sm">
                <thead className="bg-[#F9FAFB] text-[#374151]">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="px-4 py-3 font-semibold">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">{children}</tbody>
            </table>
        </div>
    );
}

type DataTableCellProps = ComponentProps<'td'>;

export function DataTableCell({ children, className, ...props }: DataTableCellProps) {
    return (
        <td className={cn('px-4 py-3 align-middle', className)} {...props}>
            {children}
        </td>
    );
}

type DataTableRowProps = {
    children: ReactNode;
    className?: string;
};

export function DataTableRow({ children, className }: DataTableRowProps) {
    return <tr className={cn('transition-colors hover:bg-[#F3F4F6]', className)}>{children}</tr>;
}
