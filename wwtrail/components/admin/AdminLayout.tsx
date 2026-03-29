'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  MapPin,
  Tag,
  Globe,
  Home,
  FileText,
  Layout as LayoutIcon,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Administración Web',
      href: '/admin/web',
      icon: Globe,
      subItems: [
        {
          title: 'HOME',
          href: '/dashboard/home-config',
          icon: Home,
        },
        {
          title: 'Footer',
          href: '/admin/footer',
          icon: LayoutIcon,
        },
        {
          title: 'Landings',
          href: '/admin/landings',
          icon: FileText,
        },
      ],
    },
    {
      title: 'Usuarios',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Eventos',
      href: '/admin/events',
      icon: Calendar,
    },
    {
      title: 'Servicios',
      href: '/admin/services',
      icon: MapPin,
      subItems: [
        {
          title: 'Categorías',
          href: '/admin/services/categories',
          icon: Tag,
        },
      ],
    },
    {
      title: 'Estadísticas',
      href: '/admin/stats',
      icon: BarChart3,
    },
    {
      title: 'Configuración',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(href);
  };

  // ✅ Construir nombre del usuario
  const getUserName = () => {
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user?.username || user?.email?.split('@')[0] || 'Admin';
  };

  const getUserInitial = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'A';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href="/admin" className="flex items-center">
            <span className="text-2xl font-bold text-black">WWTRAIL</span>
            <span className="ml-2 rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-black">
              ADMIN
            </span>
          </Link>
        </div>

        {/* User info */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black font-semibold">
              {getUserInitial()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors
                    ${
                      active
                        ? 'bg-gray-50 text-black'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`mr-3 h-5 w-5 ${active ? 'text-black' : 'text-gray-400'}`} />
                  {item.title}
                </Link>

                {/* Sub Items */}
                {hasSubItems && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const subActive = isActive(subItem.href);

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`
                            flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors
                            ${
                              subActive
                                ? 'bg-gray-50 text-black'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          <SubIcon className={`mr-3 h-4 w-4 ${subActive ? 'text-black' : 'text-gray-400'}`} />
                          {subItem.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white px-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Panel de Administración
          </h1>
        </header>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
