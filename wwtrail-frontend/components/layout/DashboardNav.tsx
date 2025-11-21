'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Home,
  Award,
  MapPin,
  Flag,
  Calendar,
  Building2,
  FileText,
  Tag,
  Users,
  BarChart3,
  ChevronRight,
  ChevronDown,
  Briefcase,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  badge?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Configuración Home',
    href: '/dashboard/home-config',
    icon: Home,
    adminOnly: true,
  },
  {
    label: 'Gestión de eventos',
    href: '/organizer',
    icon: Award,
    children: [
      {
        label: 'Eventos',
        href: '/organizer/events',
        icon: MapPin,
      },
      {
        label: 'Competiciones',
        href: '/organizer/competitions',
        icon: Flag,
      },
      {
        label: 'Ediciones',
        href: '/organizer/editions',
        icon: Calendar,
      },
      {
        label: 'Organizadores',
        href: '/organizer/organizers',
        icon: Briefcase,
      },
      {
        label: 'Series Especiales',
        href: '/organizer/special-series',
        icon: Sparkles,
      },
    ],
  },
  {
    label: 'Servicios',
    icon: Building2,
    children: [
      {
        label: 'Gestionar servicios',
        href: '/organizer/services',
        icon: Building2,
      },
      {
        label: 'Categorías',
        href: '/organizer/services/categories',
        icon: Tag,
      },
    ],
  },
  {
    label: 'Blog y Artículos',
    href: '/organizer/posts',
    icon: BookOpen,
  },
  {
    label: 'Ofertas y Cupones',
    href: '/offers',
    icon: Tag,
    badge: 'Pronto',
  },
  {
    label: 'Usuarios',
    href: '/users',
    icon: Users,
    badge: 'Pronto',
    adminOnly: true,
  },
  {
    label: 'Estadísticas',
    href: '/stats',
    icon: BarChart3,
    badge: 'Pronto',
    adminOnly: true,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Gestión de eventos', 'Servicios']);

  const filteredItems = navItems.filter((item) => {
    if (item.adminOnly) {
      return isAdmin;
    }
    return true;
  });

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isChildActive = (children?: NavItem[]) => {
    if (!children) return false;
    return children.some((child) => pathname.startsWith(child.href));
  };

  return (
    <nav className="space-y-1">
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        const childActive = isChildActive(item.children);
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.label);
        const disabled = !!item.badge;

        return (
          <div key={item.label}>
            {/* Main Item */}
            {disabled ? (
              <div
                className={`
                  flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg
                  opacity-60 cursor-not-allowed text-gray-500
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
            ) : hasChildren ? (
              <button
                onClick={() => toggleExpand(item.label)}
                className={`
                  flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg
                  transition-colors
                  ${
                    active || childActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <Link
                href={item.href!}
                className={`
                  flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg
                  transition-colors
                  ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            )}

            {/* Children */}
            {hasChildren && isExpanded && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                {item.children!.map((child) => {
                  const ChildIcon = child.icon;
                  const childIsActive = pathname.startsWith(child.href);

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`
                        flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg
                        transition-colors
                        ${
                          childIsActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <ChildIcon className="w-4 h-4" />
                      <span>{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
