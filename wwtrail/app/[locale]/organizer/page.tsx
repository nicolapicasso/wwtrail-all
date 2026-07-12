// app/organizer/page.tsx - Dashboard de organizadores

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Flag,
  MapPin,
  Plus,
  TrendingUp,
  Users,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  Layers,
  AlertCircle,
  Settings,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { adminService } from '@/lib/api/admin.service';
import { useTranslations } from 'next-intl';

export default function OrganizerDashboard() {
  const router = useRouter();
  const t = useTranslations('boEvents');
  const { isAdmin, isOrganizer } = useAuth();
  const [stats, setStats] = useState({
    events: 0,
    competitions: 0,
    editions: 0,
    upcomingEditions: 0,
    services: 0,
    specialSeries: 0,
    posts: 0,
    pendingTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (isAdmin) {
          // Admin gets comprehensive stats
          const [comprehensiveStats, pendingCounts] = await Promise.all([
            adminService.getComprehensiveStats(),
            adminService.getPendingContentCounts(),
          ]);

          setStats({
            events: comprehensiveStats.overview.totalEvents || 0,
            competitions: comprehensiveStats.overview.totalCompetitions || 0,
            editions: comprehensiveStats.overview.totalEditions || 0,
            upcomingEditions: 0,
            services: comprehensiveStats.overview.totalServices || 0,
            specialSeries: comprehensiveStats.overview.totalSpecialSeries || 0,
            posts: 0,
            pendingTotal: pendingCounts.total || 0,
          });
        } else {
          // Organizer gets their own stats
          setStats({
            events: 0,
            competitions: 0,
            editions: 0,
            upcomingEditions: 0,
            services: 0,
            specialSeries: 0,
            posts: 0,
            pendingTotal: 0,
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  const quickActions = [
    {
      title: t('newEvent'),
      description: t('newEventDesc'),
      icon: MapPin,
      href: '/organizer/events/new',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      title: t('newCompetition'),
      description: t('newCompetitionDesc'),
      icon: Flag,
      href: '/organizer/competitions/new',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      disabled: true,
      note: t('newCompetitionNote'),
    },
    {
      title: t('newEdition'),
      description: t('newEditionDesc'),
      icon: Calendar,
      href: '/organizer/editions/new',
      color: 'bg-gray-800',
      hoverColor: 'hover:bg-black',
      disabled: true,
      note: t('newEditionNote'),
    },
  ];

  const sections = [
    {
      title: t('sectionEvents'),
      description: t('sectionEventsDesc'),
      icon: MapPin,
      href: '/organizer/events',
      count: stats.events,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: t('sectionCompetitions'),
      description: t('sectionCompetitionsDesc'),
      icon: Flag,
      href: '/organizer/competitions',
      count: stats.competitions,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: t('sectionEditions'),
      description: t('sectionEditionsDesc'),
      icon: Calendar,
      href: '/organizer/editions',
      count: stats.editions,
      color: 'text-black',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
    {
      title: t('sectionServices'),
      description: t('sectionServicesDesc'),
      icon: Building2,
      href: '/organizer/services',
      count: stats.services,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      title: t('sectionArticles'),
      description: t('sectionArticlesDesc'),
      icon: BookOpen,
      href: '/organizer/posts',
      count: stats.posts,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
    },
  ];

  // Admin-only sections
  const adminSections = isAdmin ? [
    {
      title: t('sectionPending'),
      description: t('sectionPendingDesc'),
      icon: AlertCircle,
      href: '/organizer/pending',
      count: stats.pendingTotal,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      highlight: stats.pendingTotal > 0,
    },
    {
      title: t('sectionSpecialSeries'),
      description: t('sectionSpecialSeriesDesc'),
      icon: Layers,
      href: '/organizer/special-series',
      count: stats.specialSeries,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      title: t('sectionUsers'),
      description: t('sectionUsersDesc'),
      icon: Users,
      href: '/organizer/users',
      count: 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: t('sectionTranslations'),
      description: t('sectionTranslationsDesc'),
      icon: FileText,
      href: '/organizer/translations',
      count: 0,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
    },
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboardTitle')}
          </h1>
          <p className="text-gray-600">
            {t('dashboardSubtitle')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('totalEvents')}</p>
                <p className="text-3xl font-bold text-gray-900">{stats.events}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('sectionCompetitions')}</p>
                <p className="text-3xl font-bold text-gray-900">{stats.competitions}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Flag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('sectionEditions')}</p>
                <p className="text-3xl font-bold text-gray-900">{stats.editions}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('upcoming')}</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingEditions}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <div
                key={action.title}
                className={`bg-white rounded-lg shadow overflow-hidden ${
                  action.disabled ? 'opacity-60' : ''
                }`}
              >
                {action.disabled ? (
                  <div className="p-6 cursor-not-allowed">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                    {action.note && (
                      <p className="text-xs text-amber-600 italic">
                        {action.note}
                      </p>
                    )}
                  </div>
                ) : (
                  <Link
                    href={action.href}
                    className="block p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-12 h-12 ${action.color} ${action.hoverColor} rounded-lg flex items-center justify-center mb-4 transition-colors`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Sections */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('contentManagement')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className={`bg-white rounded-lg shadow border-l-4 ${section.borderColor} p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                    <section.icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <span className={`text-2xl font-bold ${section.color}`}>
                    {section.count}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600">{section.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Sections */}
        {isAdmin && adminSections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('administration')}</h2>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            {t('needHelp')}
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            {t('workflowIntro')} <strong>{t('workflowChain')}</strong>
          </p>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• <strong>{t('eventLabel')}</strong>: {t('helpEventText')}</li>
            <li>• <strong>{t('competitionLabel')}</strong>: {t('helpCompetitionText')}</li>
            <li>• <strong>{t('editionLabel')}</strong>: {t('helpEditionText')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
