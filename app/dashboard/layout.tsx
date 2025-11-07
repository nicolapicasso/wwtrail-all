'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { DashboardNav } from '@/components/layout/DashboardNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, isOrganizer, isAdmin } = useAuth();
  const router = useRouter();

  // Verificar autenticación
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard'); // ✅ CORREGIDO: Ahora usa /auth/login
    } else if (!isOrganizer && !isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isOrganizer, isAdmin, router]);

  if (!isAuthenticated || (!isOrganizer && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary-600"></div>
          <p className="mt-2 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
              {/* Logo / Título */}
              <div className="flex items-center flex-shrink-0 px-4 mb-5">
                <h1 className="text-xl font-bold text-primary-600">
                  Dashboard
                </h1>
              </div>

              {/* Info del usuario */}
              <div className="px-4 mb-5">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user?.email}
                  </p>
                  {isAdmin && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                      👑 Administrador
                    </span>
                  )}
                  {isOrganizer && !isAdmin && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      🎯 Organizador
                    </span>
                  )}
                </div>
              </div>

              {/* Navegación */}
              <div className="px-3 flex-1">
                <DashboardNav />
              </div>

              {/* Footer */}
              <div className="px-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => router.push('/')}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-left flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Volver a WWTRAIL
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header móvil */}
          <div className="md:hidden sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex items-center">
                <h1 className="text-xl font-bold text-primary-600">
                  Dashboard
                </h1>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
