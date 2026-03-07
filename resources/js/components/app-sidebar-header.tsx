import { usePage } from '@inertiajs/react';
import { Bell, Search } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import type { Auth } from '@/types';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const page = usePage<{ auth: Auth; notifications?: Array<{ id: string }> }>();
    const user = page.props.auth.user;
    const getInitials = useInitials();
    const notificationsCount = page.props.notifications?.length ?? 0;
    const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.title ?? 'Dashboard';

    return (
        <header className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white/95 px-4 py-3 backdrop-blur-sm md:px-6">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <SidebarTrigger className="-ml-1 border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]" />
                    <div className="min-w-0">
                        <h1 className="truncate text-base font-semibold text-[#111827] md:text-lg">
                            {pageTitle}
                        </h1>
                        {breadcrumbs.length > 1 && (
                            <div className="hidden text-xs text-[#6B7280] md:block">
                                <Breadcrumbs breadcrumbs={breadcrumbs} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-10 rounded-full p-1 hover:bg-[#F3F4F6]">
                                <Avatar className="size-8 overflow-hidden rounded-full border border-[#E5E7EB]">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="bg-[#FFF4CC] text-[#111827]">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 border-[#E5E7EB]">
                            <UserMenuContent user={user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
