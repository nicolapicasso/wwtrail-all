'use client';

import React, { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
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
  Ticket,
  Search,
  Settings,
  Globe,
  Layout,
  AlertCircle,
  Star,
  UserCog,
  Upload,
  Download,
  PenSquare,
  Database,
  Languages,
  Wallet,
  Footprints,
} from 'lucide-react';
import { adminService, PendingContentCounts } from '@/lib/api/admin.service';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  badge?: string;
  dynamicBadge?: boolean; // For pending content count
  children?: NavItem[];
}

// `label` holds a stable cmpLayout translation key; rendered via t(label).
const navItems: NavItem[] = [
  {
    label: 'navDashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'navContenidoPendiente',
    href: '/organizer/pending',
    icon: AlertCircle,
    adminOnly: true,
    dynamicBadge: true,
  },
  {
    label: 'navAdministracionWeb',
    icon: Globe,
    adminOnly: true,
    children: [
      {
        label: 'navConfiguracionHome',
        href: '/dashboard/home-config',
        icon: Home,
      },
      {
        label: 'navFooter',
        href: '/organizer/footer',
        icon: Layout,
      },
      {
        label: 'navLandings',
        href: '/organizer/landings',
        icon: FileText,
      },
      {
        label: 'navAjustesSitio',
        href: '/dashboard/site-config',
        icon: Settings,
      },
    ],
  },
  {
    label: 'navGestionEventos',
    href: '/organizer',
    icon: Award,
    children: [
      {
        label: 'navEventos',
        href: '/organizer/events',
        icon: MapPin,
      },
      {
        label: 'navCompeticiones',
        href: '/organizer/competitions',
        icon: Flag,
      },
      {
        label: 'navEdiciones',
        href: '/organizer/editions',
        icon: Calendar,
      },
      {
        label: 'navOrganizadores',
        href: '/organizer/organizers',
        icon: Briefcase,
      },
    ],
  },
  {
    label: 'navSeriesEspeciales',
    href: '/organizer/special-series',
    icon: Sparkles,
    adminOnly: true,
  },
  {
    label: 'navServicios',
    icon: Building2,
    children: [
      {
        label: 'navGestionarServicios',
        href: '/organizer/services',
        icon: Building2,
      },
    ],
  },
  {
    label: 'navCategoriasServicios',
    href: '/organizer/services/categories',
    icon: Tag,
    adminOnly: true,
  },
  {
    label: 'navBlogArticulos',
    href: '/organizer/posts',
    icon: BookOpen,
  },
  {
    label: 'navPromociones',
    icon: Ticket,
    adminOnly: true,
    children: [
      {
        label: 'navGestionarPromociones',
        href: '/organizer/promotions',
        icon: Ticket,
      },
      {
        label: 'navCategorias',
        href: '/organizer/promotions/categories',
        icon: Tag,
      },
      {
        label: 'navConfigurarEmail',
        href: '/organizer/promotions/settings/email-templates',
        icon: FileText,
      },
      {
        label: 'navAnalitica',
        href: '/organizer/promotions/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    label: 'navSeo',
    icon: Search,
    adminOnly: true,
    children: [
      {
        label: 'navSeo',
        href: '/organizer/seo',
        icon: Search,
      },
      {
        label: 'navConfiguracion',
        href: '/organizer/seo/config',
        icon: Settings,
      },
    ],
  },
  {
    label: 'navUsuarios',
    icon: Users,
    adminOnly: true,
    children: [
      {
        label: 'navGestionUsuarios',
        href: '/organizer/users',
        icon: UserCog,
      },
      {
        label: 'navInsiders',
        href: '/organizer/insiders',
        icon: Star,
      },
    ],
  },
  {
    label: 'navEstadisticas',
    href: '/organizer/stats',
    icon: BarChart3,
    adminOnly: true,
  },
  {
    label: 'navDatos',
    icon: Database,
    adminOnly: true,
    children: [
      {
        label: 'navImportacion',
        href: '/organizer/import',
        icon: Upload,
      },
      {
        label: 'navImportadorIA',
        href: '/organizer/scraper',
        icon: Sparkles,
      },
      {
        label: 'navExportacion',
        href: '/organizer/export',
        icon: Download,
      },
      {
        label: 'navEditorMasivo',
        href: '/organizer/bulk-edit',
        icon: PenSquare,
      },
      {
        label: 'navTraducciones',
        href: '/organizer/translations',
        icon: Languages,
      },
    ],
  },
  {
    label: 'navOmniwallet',
    icon: Wallet,
    adminOnly: true,
    children: [
      {
        label: 'navConfiguracion',
        href: '/organizer/omniwallet',
        icon: Settings,
      },
      {
        label: 'navAccionesPuntos',
        href: '/organizer/omniwallet/actions',
        icon: Footprints,
      },
    ],
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const t = useTranslations('cmpLayout');
  const { user, isAdmin } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['navAdministracionWeb', 'navGestionEventos', 'navServicios', 'navPromociones', 'navSeo', 'navUsuarios', 'navDatos', 'navOmniwallet']);
  const [pendingCounts, setPendingCounts] = useState<PendingContentCounts | null>(null);

  // Fetch pending content counts for admins
  useEffect(() => {
    const fetchPendingCounts = async () => {
      if (isAdmin) {
        try {
          const counts = await adminService.getPendingContentCounts();
          setPendingCounts(counts);
        } catch (err) {
          console.error('Error fetching pending counts:', err);
        }
      }
    };

    fetchPendingCounts();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPendingCounts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isAdmin]);

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
    return children.some((child) => pathname.startsWith(child.href || ""));
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
                  <span>{t(item.label)}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
            ) : item.dynamicBadge ? (
              <Link
                href={item.href!}
                className={`
                  flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg
                  transition-colors
                  ${
                    active
                      ? 'bg-red-50 text-red-700'
                      : pendingCounts && pendingCounts.total > 0
                      ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${pendingCounts && pendingCounts.total > 0 ? 'text-red-500' : ''}`} />
                  <span>{t(item.label)}</span>
                </div>
                {pendingCounts && pendingCounts.total > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {pendingCounts.total > 99 ? '99+' : pendingCounts.total}
                  </span>
                )}
              </Link>
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
                  <span>{t(item.label)}</span>
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
                  <span>{t(item.label)}</span>
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
                  const childIsActive = pathname.startsWith(child.href || "");

                  return (
                    <Link
                      key={child.href}
                      href={child.href || "#"}
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
                      <span>{t(child.label)}</span>
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
