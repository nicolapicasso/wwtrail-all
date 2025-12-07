'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserStatsCards } from '@/components/UserStatsCards';
import { ZancadasBalance, ZancadasHistory } from '@/components/zancadas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Edit,
  Lock,
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  Medal,
  ArrowRight,
  Globe,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { userService, UserParticipation } from '@/lib/api/user.service';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  const [participations, setParticipations] = useState<UserParticipation[]>([]);
  const [loadingParticipations, setLoadingParticipations] = useState(true);
  const [zancadasRefresh, setZancadasRefresh] = useState(0);

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        const data = await userService.getOwnParticipations();
        setParticipations(data);
      } catch (err) {
        console.error('Error fetching participations:', err);
      } finally {
        setLoadingParticipations(false);
      }
    };

    if (user) {
      fetchParticipations();
    }
  }, [user]);

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
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
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
                      onClick={() => router.push(`/${locale}/profile/edit`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/${locale}/profile/participations`)}
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Mis Participaciones
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/${locale}/profile/change-password`)}
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

                {/* Profile Visibility */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Visibilidad</span>
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      user.isPublic
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.isPublic ? (
                      <>
                        <Globe className="w-3 h-3" />
                        Público
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        Privado
                      </>
                    )}
                  </span>
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

            {/* Zancadas Balance */}
            <ZancadasBalance onSyncComplete={() => setZancadasRefresh((prev) => prev + 1)} />

            {/* Zancadas History */}
            <ZancadasHistory refreshTrigger={zancadasRefresh} />

            {/* Recent Participations */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Participaciones recientes
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/${locale}/profile/participations`)}
                >
                  Ver todas
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {loadingParticipations ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : participations.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-muted-foreground mb-3">
                      No tienes participaciones registradas
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/${locale}/profile/participations`)}
                    >
                      Añadir participación
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {participations.slice(0, 5).map((participation) => (
                      <div
                        key={participation.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              participation.status === 'COMPLETED'
                                ? 'bg-green-100'
                                : 'bg-orange-100'
                            }`}
                          >
                            {participation.status === 'COMPLETED' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-orange-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {participation.edition.competition.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {participation.edition.year} •{' '}
                              {participation.edition.competition.event.country}
                            </p>
                          </div>
                        </div>
                        {participation.status === 'COMPLETED' && (
                          <div className="flex items-center gap-3 text-sm">
                            {participation.finishTime && (
                              <span className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-3 h-3" />
                                {participation.finishTime}
                              </span>
                            )}
                            {participation.position && (
                              <span className="flex items-center gap-1 text-yellow-600 font-medium">
                                <Medal className="w-3 h-3" />
                                #{participation.position}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {participations.length > 5 && (
                      <p className="text-center text-sm text-muted-foreground pt-2">
                        Y {participations.length - 5} más...
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
