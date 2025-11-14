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
  BarChart3
} from 'lucide-react';

export default function OrganizerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    events: 0,
    competitions: 0,
    editions: 0,
    upcomingEditions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real stats from API
    // For now, using placeholder data
    setStats({
      events: 0,
      competitions: 0,
      editions: 0,
      upcomingEditions: 0,
    });
    setLoading(false);
  }, []);

  const quickActions = [
    {
      title: 'Nuevo Evento',
      description: 'Crear un nuevo evento desde cero',
      icon: MapPin,
      href: '/organizer/events/new',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      title: 'Nueva Competición',
      description: 'Añadir una competición a un evento',
      icon: Flag,
      href: '/organizer/competitions/new',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      disabled: true,
      note: 'Requiere seleccionar un evento primero',
    },
    {
      title: 'Nueva Edición',
      description: 'Crear una edición de una competición',
      icon: Calendar,
      href: '/organizer/editions/new',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      disabled: true,
      note: 'Requiere seleccionar una competición primero',
    },
  ];

  const sections = [
    {
      title: 'Eventos',
      description: 'Gestiona tus eventos deportivos',
      icon: MapPin,
      href: '/organizer/events',
      count: stats.events,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Competiciones',
      description: 'Administra las competiciones',
      icon: Flag,
      href: '/organizer/competitions',
      count: stats.competitions,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Ediciones',
      description: 'Gestiona las ediciones anuales',
      icon: Calendar,
      href: '/organizer/editions',
      count: stats.editions,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
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
            Panel de Organizador
          </h1>
          <p className="text-gray-600">
            Gestiona tus eventos, competiciones y ediciones desde aquí
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Eventos</p>
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
                <p className="text-sm text-gray-600 mb-1">Competiciones</p>
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
                <p className="text-sm text-gray-600 mb-1">Ediciones</p>
                <p className="text-3xl font-bold text-gray-900">{stats.editions}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Próximas</p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Gestión</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            ¿Necesitas ayuda?
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            El flujo de trabajo típico es: <strong>Evento → Competición → Edición</strong>
          </p>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• <strong>Evento</strong>: Un evento deportivo (ej. "Ultra Trail del Mont Blanc")</li>
            <li>• <strong>Competición</strong>: Una modalidad dentro del evento (ej. "UTMB 170K", "CCC 100K")</li>
            <li>• <strong>Edición</strong>: Una edición anual de la competición (ej. "UTMB 170K 2024")</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
