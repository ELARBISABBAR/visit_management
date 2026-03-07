import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    FolderGit2,
    IdCard,
    LayoutGrid,
    Settings2,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
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
import type { Auth, NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { props } = usePage<{ auth: Auth }>();
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
                      title: 'Tableau de bord – Admin',
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
                      title: 'Tableau de bord – Demandeur',
                      href: '/demandeur/dashboard',
                      icon: LayoutGrid,
                  },
                  {
                      title: 'Mes visites',
                      href: '/demandeur/visites',
                      icon: IdCard,
                  },
                  {
                      title: 'Historique des visites',
                      href: '/demandeur/visites/historique',
                      icon: FolderGit2,
                  },
              ] as NavItem[])
            : []),
        ...(userRole === 'accueil'
            ? ([
                  {
                      title: 'Tableau de bord – Accueil',
                      href: '/accueil/dashboard',
                      icon: LayoutGrid,
                  },
                  {
                      title: 'Gestion des visites',
                      href: '/accueil/visites',
                      icon: IdCard,
                  },
              ] as NavItem[])
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={roleHomeLink} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
