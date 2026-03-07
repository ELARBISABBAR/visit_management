import { Link } from '@inertiajs/react';

type PaginationMeta = {
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type PaginationControlsProps = {
    pagination: PaginationMeta;
};

export function PaginationControls({ pagination }: PaginationControlsProps) {
    if (pagination.last_page <= 1) {
        return null;
    }

    return (
        <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
                Page {pagination.current_page} sur {pagination.last_page}
            </p>
            <div className="flex items-center gap-2">
                {pagination.prev_page_url ? (
                    <Link
                        href={pagination.prev_page_url}
                        preserveScroll
                        className="rounded-md border px-3 py-1 text-xs hover:bg-muted"
                    >
                        Précédent
                    </Link>
                ) : (
                    <span className="rounded-md border px-3 py-1 text-xs text-muted-foreground">
                        Précédent
                    </span>
                )}

                {pagination.next_page_url ? (
                    <Link
                        href={pagination.next_page_url}
                        preserveScroll
                        className="rounded-md border px-3 py-1 text-xs hover:bg-muted"
                    >
                        Suivant
                    </Link>
                ) : (
                    <span className="rounded-md border px-3 py-1 text-xs text-muted-foreground">
                        Suivant
                    </span>
                )}
            </div>
        </div>
    );
}

