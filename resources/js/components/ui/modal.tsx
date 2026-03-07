import type { ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type ModalProps = {
    trigger: ReactNode;
    title: string;
    description?: string;
    children: ReactNode;
};

export function Modal({ trigger, title, description, children }: ModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="border-[#E5E7EB] sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-[#111827]">{title}</DialogTitle>
                    {description && <DialogDescription className="text-[#6B7280]">{description}</DialogDescription>}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
