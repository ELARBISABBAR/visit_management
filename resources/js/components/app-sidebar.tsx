import { Link, usePage } from '@inertiajs/react';
import { Building2, IdCard, LayoutGrid, Settings2, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { Auth, NavItem } from '@/types';
import AppLogoIcon from './app-logo-icon';

export function AppSidebar() {
    const { props } = usePage<{ auth: Auth }>();
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const userRole = (props.auth?.user as any)?.role as string | undefined;
    const roleHomeLink =
        userRole === 'admin'
            ? '/admin'
            : userRole === 'accueil'
              ? '/accueil/dashboard'
              : userRole === 'demandeur'
                ? '/demandeur/dashboard'
                : '/';

    const mainNavItems: NavItem[] = [
        ...(userRole === 'admin'
            ? ([
                  {
                      title: 'Dashboard',
                      href: '/admin',
                      icon: LayoutGrid,
                  },
                  {
                      title: 'Users',
                      href: '/admin/users',
                      icon: Users,
                  },
                  {
                      title: 'Departments',
                      href: '/admin/departments',
                      icon: Building2,
                  },
                  {
                      title: 'Badges',
                      href: '/admin/badges',
                      icon: IdCard,
                  },
                  {
                      title: 'Settings',
                      href: '/admin/settings',
                      icon: Settings2,
                  },
              ] as NavItem[])
            : []),
        ...(userRole === 'demandeur'
            ? ([
                  {
                      title: 'Dashboard',
                      href: '/demandeur/dashboard',
                      icon: LayoutGrid,
                  },
                  {
                      title: 'Visits',
                      href: '/demandeur/visites',
                      icon: IdCard,
                  },
              ] as NavItem[])
            : []),
        ...(userRole === 'accueil'
            ? ([
                  {
                      title: 'Dashboard',
                      href: '/accueil/dashboard',
                      icon: LayoutGrid,
                  },
                  {
                      title: 'Visits',
                      href: '/accueil/visites',
                      icon: IdCard,
                  },
              ] as NavItem[])
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-[#374151]">
            <SidebarHeader className="px-4 py-5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent data-[active=true]:bg-transparent">
                            <Link href={roleHomeLink} prefetch>
                                <div className="w-25 mx-auto">
                                    <AppLogoIcon />
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-3 pb-4">
                <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                    Main menu
                </p>
                <SidebarMenu className="gap-1.5">
                    {mainNavItems.map((item) => {
                        const active = isCurrentOrParentUrl(item.href);
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={active}
                                    tooltip={{ children: item.title }}
                                    className={cn(
                                        'h-10 rounded-lg px-3 text-[#D1D5DB] transition-all duration-200 hover:bg-[#374151] hover:text-white',
                                        active && 'bg-[#F4B400] font-semibold text-[#111827] hover:bg-[#D99A00]',
                                    )}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon className="size-4" />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="border-t border-[#374151] px-3 py-3">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
