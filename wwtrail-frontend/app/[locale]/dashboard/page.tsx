'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
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
} from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Proteger la ruta - redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

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

  // Secciones administrativas
  const adminSections = [
    {
      title: 'Gestión de Organizadores',
      description: 'Administra eventos, competiciones y ediciones',
      icon: Award,
      href: '/organizer',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      available: true,
      subsections: [
        { name: 'Eventos', href: '/organizer/events' },
        { name: 'Competiciones', href: '/organizer/competitions' },
        { name: 'Ediciones', href: '/organizer/editions' },
        { name: 'Servicios', href: '/organizer/services' },
      ],
    },
    {
      title: 'Servicios',
      description: 'Gestiona servicios (alojamientos, restaurantes, tiendas, etc.)',
      icon: Building2,
      href: '/organizer/services',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      available: true,
    },
    {
      title: 'Blog y Artículos',
      description: 'Administra contenido editorial y noticias',
      icon: FileText,
      href: '/blog',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      available: false,
      badge: 'Próximamente',
    },
    {
      title: 'Ofertas y Cupones',
      description: 'Gestiona descuentos y promociones',
      icon: Tag,
      href: '/offers',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      available: false,
      badge: 'Próximamente',
    },
    {
      title: 'Usuarios',
      description: 'Administra usuarios y permisos',
      icon: Users,
      href: '/users',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      available: false,
      badge: 'Próximamente',
    },
    {
      title: 'Estadísticas',
      description: 'Ver métricas y analíticas del sistema',
      icon: BarChart3,
      href: '/stats',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      available: false,
      badge: 'Próximamente',
    },
  ];

  // Accesos rápidos comunes
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
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
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
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Bienvenido, {user.firstName || user.username}! Gestiona todo el sistema desde aquí
          </p>
        </div>

        {/* User Info Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-600">
                Rol: <span className="uppercase font-medium text-blue-600">{user.role}</span>
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

        {/* Admin Sections */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Módulos de Administración</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section) => (
              <div
                key={section.title}
                className={`bg-white rounded-lg shadow border-l-4 ${section.borderColor} overflow-hidden ${
                  !section.available ? 'opacity-60' : ''
                }`}
              >
                {section.available ? (
                  <Link href={section.href} className="block p-6 hover:bg-gray-50 transition-colors">
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
                ) : (
                  <div className="p-6 cursor-not-allowed">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                        <section.icon className={`w-6 h-6 ${section.color}`} />
                      </div>
                      {section.badge && (
                        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded font-medium">
                          {section.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Estructura del Sistema
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                El panel de administración está organizado por módulos funcionales:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Gestión de Organizadores</strong>: Eventos deportivos y sus competiciones/ediciones</li>
                <li>• <strong>Servicios</strong>: Alojamientos, restaurantes, tiendas y puntos de información</li>
                <li>• <strong>Blog</strong>: Contenido editorial, noticias y artículos</li>
                <li>• <strong>Ofertas</strong>: Sistema de descuentos y promociones</li>
                <li>• <strong>Usuarios</strong>: Gestión de cuentas y permisos</li>
                <li>• <strong>Estadísticas</strong>: Métricas y analíticas del sistema</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
