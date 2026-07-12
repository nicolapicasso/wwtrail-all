'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Flag,
  MapPin,
  Home as HomeIcon,
  FileText,
  Tag,
  Building2,
  Users,
  BarChart3,
  Settings,
  Shield,
  Award,
  AlertCircle,
  BookOpen,
  Layers,
  Globe,
  Ticket,
} from 'lucide-react';
import { adminService } from '@/lib/api/admin.service';

export default function DashboardPage() {
  const t = useTranslations('boMisc');
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState(0);

  // Proteger la ruta - redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  // Fetch pending count for admins
  useEffect(() => {
    const fetchPending = async () => {
      if (user?.role === 'ADMIN') {
        try {
          const counts = await adminService.getPendingContentCounts();
          setPendingCount(counts.total);
        } catch (err) {
          console.error('Error fetching pending counts:', err);
        }
      }
    };
    if (user) fetchPending();
  }, [user]);

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (se redirige en useEffect)
  if (!isAuthenticated || !user) {
    return null;
  }

  const isAdmin = user.role === 'ADMIN';

  // Secciones disponibles para todos
  const mainSections = [
    {
      title: t('dashEventManagement'),
      description: t('dashEventManagementDesc'),
      icon: Award,
      href: '/organizer',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      subsections: [
        { name: t('dashEvents'), href: '/organizer/events' },
        { name: t('dashCompetitions'), href: '/organizer/competitions' },
        { name: t('dashEditions'), href: '/organizer/editions' },
      ],
    },
    {
      title: t('dashServices'),
      description: t('dashServicesDesc'),
      icon: Building2,
      href: '/organizer/services',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      title: t('dashBlogArticles'),
      description: t('dashBlogArticlesDesc'),
      icon: BookOpen,
      href: '/organizer/posts',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
    },
  ];

  // Secciones solo para admin
  const adminSections = isAdmin ? [
    {
      title: t('dashPendingContent'),
      description: t('dashPendingContentDesc'),
      icon: AlertCircle,
      href: '/organizer/pending',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      count: pendingCount,
      highlight: pendingCount > 0,
    },
    {
      title: t('dashWebAdmin'),
      description: t('dashWebAdminDesc'),
      icon: Globe,
      href: '/dashboard/home-config',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      subsections: [
        { name: t('dashConfigHome'), href: '/dashboard/home-config' },
        { name: 'Footer', href: '/organizer/footer' },
        { name: 'Landings', href: '/organizer/landings' },
      ],
    },
    {
      title: t('dashSpecialSeries'),
      description: t('dashSpecialSeriesDesc'),
      icon: Layers,
      href: '/organizer/special-series',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      title: t('dashPromotions'),
      description: t('dashPromotionsDesc'),
      icon: Ticket,
      href: '/organizer/promotions',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      title: t('dashUsers'),
      description: t('dashUsersDesc'),
      icon: Users,
      href: '/organizer/users',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: t('dashStats'),
      description: t('dashStatsDesc'),
      icon: BarChart3,
      href: '/organizer/stats',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  ] : [];

  // Accesos rápidos
  const quickLinks = [
    {
      title: t('dashEvents'),
      icon: MapPin,
      href: '/organizer/events',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      title: t('dashCompetitions'),
      icon: Flag,
      href: '/organizer/competitions',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      title: t('dashEditions'),
      icon: Calendar,
      href: '/organizer/editions',
      color: 'bg-gray-800',
      hoverColor: 'hover:bg-black',
    },
    {
      title: t('dashServices'),
      icon: Building2,
      href: '/organizer/services',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isAdmin ? t('dashPanelAdmin') : t('dashPanelOrganizer')}
          </h1>
          <p className="text-gray-600">
            {t('dashWelcome', { name: user.firstName || user.username })}
          </p>
        </div>

        {/* User Info Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${isAdmin ? 'bg-red-100' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
              <Shield className={`w-6 h-6 ${isAdmin ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-600">
                {t('dashRole')}: <span className={`uppercase font-medium ${isAdmin ? 'text-red-600' : 'text-blue-600'}`}>{user.role}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{t('dashMemberSince')}</p>
            <p className="font-medium text-gray-900">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                  })
                : t('dashNotAvailable')}
            </p>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dashQuickAccess')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={`${link.color} ${link.hoverColor} text-white rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-colors shadow hover:shadow-lg`}
              >
                <link.icon className="w-6 h-6" />
                <span className="text-sm font-medium text-center">{link.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Sections */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dashContentManagement')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainSections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className={`bg-white rounded-lg shadow border-l-4 ${section.borderColor} p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                    <section.icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{section.description}</p>

                {section.subsections && (
                  <div className="flex flex-wrap gap-2">
                    {section.subsections.map((sub) => (
                      <span
                        key={sub.name}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Sections */}
        {isAdmin && adminSections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dashAdministration')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminSections.map((section: any) => (
                <Link
                  key={section.title}
                  href={section.href}
                  className={`bg-white rounded-lg shadow border-l-4 ${section.borderColor} p-6 hover:shadow-lg transition-shadow ${
                    section.highlight ? 'ring-2 ring-red-500 ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                      <section.icon className={`w-6 h-6 ${section.color}`} />
                    </div>
                    {section.count > 0 && (
                      <span className={`text-2xl font-bold ${section.color}`}>
                        {section.count}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{section.description}</p>

                  {section.subsections && (
                    <div className="flex flex-wrap gap-2">
                      {section.subsections.map((sub: any) => (
                        <span
                          key={sub.name}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {t('dashWorkflow')}
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                {t('dashWorkflowIntro')}
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>{t('dashWorkflowEventLabel')}</strong>: {t('dashWorkflowEventDesc')}</li>
                <li>• <strong>{t('dashWorkflowCompetitionLabel')}</strong>: {t('dashWorkflowCompetitionDesc')}</li>
                <li>• <strong>{t('dashWorkflowEditionLabel')}</strong>: {t('dashWorkflowEditionDesc')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
