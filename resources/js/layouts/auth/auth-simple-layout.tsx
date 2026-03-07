import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-[#F8FAFC] p-6 md:p-10">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bg-login.jpg')" }}
            />
            <div className="absolute inset-0 bg-[#111827]/65" />

            <div className="relative w-full max-w-sm">
                <div className="flex flex-col gap-8 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xl backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex items-center w-25 justify-center rounded-lg bg-[#FFF4CC] p-2">
                                <AppLogoIcon className=" text-[var(--foreground)]" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-semibold text-[#111827]">{title}</h1>
                            <p className="text-center text-sm text-[#6B7280]">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
