'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserStatsCards } from '@/components/UserStatsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, MapPin, Edit, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Cargando perfil...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  // Format date
  const memberSince = new Date(user.createdAt).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-lg opacity-90">
            Gestiona tu información personal
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-primary" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold">
                    {user.firstName || user.username}
                    {user.lastName && ` ${user.lastName}`}
                  </h2>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <div className="mt-4 w-full space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/profile/edit')}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push('/profile/change-password')}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Cambiar Contraseña
                    </Button>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rol</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-800'
                        : user.role === 'ORGANIZER'
                        ? 'bg-blue-100 text-blue-800'
                        : user.role === 'ATHLETE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'ADMIN' && '👑 Administrador'}
                      {user.role === 'ORGANIZER' && '📋 Organizador'}
                      {user.role === 'ATHLETE' && '🏃 Atleta'}
                      {user.role === 'VIEWER' && '👀 Visitante'}
                    </span>
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Miembro desde</span>
                  <span className="text-sm font-medium capitalize">{memberSince}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                {(user.city || user.country) && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ubicación</p>
                      <p className="font-medium">
                        {user.city && user.country 
                          ? `${user.city}, ${user.country}`
                          : user.city || user.country}
                      </p>
                    </div>
                  </div>
                )}

                {(!user.city && !user.country) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay información de contacto adicional.
                    <br />
                    <button
                      onClick={() => router.push('/profile/edit')}
                      className="text-primary hover:underline mt-2"
                    >
                      Agregar información
                    </button>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>Biografía</CardTitle>
              </CardHeader>
              <CardContent>
                {user.bio ? (
                  <p className="text-muted-foreground whitespace-pre-line">{user.bio}</p>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Cuéntanos sobre ti...
                    <br />
                    <button
                      onClick={() => router.push('/profile/edit')}
                      className="text-primary hover:underline mt-2"
                    >
                      Agregar biografía
                    </button>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <UserStatsCards />
          </div>
        </div>
      </div>
    </div>
  );
}
