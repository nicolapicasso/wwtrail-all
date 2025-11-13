'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { User, Calendar, Award, MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bienvenido, {user.firstName || user.username}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Aquí está tu resumen de trail running
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Inscripciones</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Próximas carreras</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-full">
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Completadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <MapPin className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0 km</p>
                  <p className="text-sm text-muted-foreground">Total recorrido</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Perfil</CardTitle>
            <CardDescription>Tus datos registrados en WWTRAIL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre de usuario</p>
                <p className="text-base">{user.username}</p>
              </div>
              {user.firstName && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="text-base">{user.firstName} {user.lastName}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rol</p>
                <p className="text-base uppercase">{user.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Miembro desde</p>
                <p className="text-base">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Comienza tu aventura en trail running</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => router.push('/competitions')}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <Calendar className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Explorar Competiciones</h3>
                  <p className="text-sm text-muted-foreground">
                    Encuentra tu próxima carrera
                  </p>
                </button>

                <button 
                  onClick={() => router.push('/profile')}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <User className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Editar Perfil</h3>
                  <p className="text-sm text-muted-foreground">
                    Actualiza tu información
                  </p>
                </button>

                <button 
                  onClick={() => router.push('/my-registrations')}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <Award className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Ver Historial</h3>
                  <p className="text-sm text-muted-foreground">
                    Revisa tus logros
                  </p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
