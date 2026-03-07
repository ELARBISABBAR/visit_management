import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type ActionConfirmDialogProps = {
    triggerLabel: string;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
    triggerClassName?: string;
    confirmClassName?: string;
};

export function ActionConfirmDialog({
    triggerLabel,
    title,
    description,
    confirmLabel,
    onConfirm,
    triggerClassName,
    confirmClassName,
}: ActionConfirmDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button type="button" className={triggerClassName}>
                    {triggerLabel}
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium shadow-sm hover:bg-muted"
                        >
                            Annuler
                        </button>
                    </DialogClose>
                    <DialogClose asChild>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={
                                confirmClassName ??
                                'inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90'
                            }
                        >
                            {confirmLabel}
                        </button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

