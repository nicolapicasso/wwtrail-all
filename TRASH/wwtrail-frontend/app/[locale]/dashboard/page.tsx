'use client';

import { useAuth } from '@/contexts/AuthContext';
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
      title: 'Gestión de Eventos',
      description: 'Administra eventos, competiciones y ediciones',
      icon: Award,
      href: '/organizer',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      subsections: [
        { name: 'Eventos', href: '/organizer/events' },
        { name: 'Competiciones', href: '/organizer/competitions' },
        { name: 'Ediciones', href: '/organizer/editions' },
      ],
    },
    {
      title: 'Servicios',
      description: 'Gestiona alojamientos, restaurantes, tiendas, etc.',
      icon: Building2,
      href: '/organizer/services',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Blog y Artículos',
      description: 'Gestiona contenido editorial y noticias',
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
      title: 'Contenido Pendiente',
      description: 'Revisa y aprueba contenido de organizadores',
      icon: AlertCircle,
      href: '/organizer/pending',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      count: pendingCount,
      highlight: pendingCount > 0,
    },
    {
      title: 'Administración Web',
      description: 'Configura Home, Footer y Landings',
      icon: Globe,
      href: '/dashboard/home-config',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      subsections: [
        { name: 'Config Home', href: '/dashboard/home-config' },
        { name: 'Footer', href: '/organizer/footer' },
        { name: 'Landings', href: '/organizer/landings' },
      ],
    },
    {
      title: 'Series Especiales',
      description: 'Gestiona circuitos y series de competiciones',
      icon: Layers,
      href: '/organizer/special-series',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      title: 'Promociones',
      description: 'Gestiona ofertas, cupones y promociones',
      icon: Ticket,
      href: '/organizer/promotions',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      title: 'Usuarios',
      description: 'Administra usuarios y permisos',
      icon: Users,
      href: '/organizer/users',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Estadísticas',
      description: 'Ver métricas y analíticas del sistema',
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
      title: 'Eventos',
      icon: MapPin,
      href: '/organizer/events',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      title: 'Competiciones',
      icon: Flag,
      href: '/organizer/competitions',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      title: 'Ediciones',
      icon: Calendar,
      href: '/organizer/editions',
      color: 'bg-gray-800',
      hoverColor: 'hover:bg-black',
    },
    {
      title: 'Servicios',
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
            Panel de {isAdmin ? 'Administración' : 'Organizador'}
          </h1>
          <p className="text-gray-600">
            Bienvenido, {user.firstName || user.username}! Gestiona tu contenido desde aquí
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
                Rol: <span className={`uppercase font-medium ${isAdmin ? 'text-red-600' : 'text-blue-600'}`}>{user.role}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Miembro desde</p>
            <p className="font-medium text-gray-900">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                  })
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Accesos Rápidos</h2>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Gestión de Contenido</h2>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Administración</h2>
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
                Flujo de Trabajo
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                El flujo típico para añadir contenido es:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Evento</strong>: Un evento deportivo (ej. "Ultra Trail del Mont Blanc")</li>
                <li>• <strong>Competición</strong>: Una modalidad dentro del evento (ej. "UTMB 170K", "CCC 100K")</li>
                <li>• <strong>Edición</strong>: Una edición anual de la competición (ej. "UTMB 170K 2024")</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
