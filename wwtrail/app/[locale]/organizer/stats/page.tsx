'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Calendar,
  Trophy,
  MapPin,
  Star,
  Building2,
  MessageSquare,
  Heart,
  TrendingUp,
  RefreshCw,
  Activity,
  UserCheck,
  UserX,
  Globe,
  Lock,
  Crown,
  Shield,
  Briefcase,
  Eye,
  CheckCircle,
  Clock,
  Award,
  Layers,
  Footprints,
} from 'lucide-react';
import { adminService, ComprehensiveStats, ZancadasStats } from '@/lib/api/admin.service';
import { COUNTRIES } from '@/lib/utils/countries';

// Role labels
const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administradores',
  ORGANIZER: 'Organizadores',
  ATHLETE: 'Atletas',
  VIEWER: 'Visitantes',
};

// Status labels
const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  CANCELLED: 'Cancelado',
  ARCHIVED: 'Archivado',
};

// Competition type labels
const TYPE_LABELS: Record<string, string> = {
  TRAIL: 'Trail',
  ULTRA: 'Ultra',
  MARATHON: 'Maratón',
  HALF_MARATHON: 'Media Maratón',
  VERTICAL: 'Vertical',
  SKYRUNNING: 'Skyrunning',
  CROSS_COUNTRY: 'Cross Country',
  ROAD: 'Carretera',
  OTHER: 'Otro',
};

function getCountryName(code: string): string {
  const country = COUNTRIES.find((c) => c.code === code);
  return country?.name || code;
}

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            {trend !== undefined && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
                {trend >= 0 ? '+' : ''}{trend} este mes
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Progress Bar Component
function ProgressBar({ value, max, label, color = 'blue' }: { value: number; max: number; label: string; color?: string }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-${color}-500 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState<ComprehensiveStats | null>(null);
  const [zancadasStats, setZancadasStats] = useState<ZancadasStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, zancadasData] = await Promise.all([
        adminService.getComprehensiveStats(),
        adminService.getZancadasStats(),
      ]);
      setStats(data);
      setZancadasStats(zancadasData);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError(err.response?.data?.message || 'Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Cargando estadísticas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchStats} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estadísticas del Portal</h1>
          <p className="text-gray-500">Vista general de todos los datos de WWTrail</p>
        </div>
        <Button onClick={fetchStats} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard title="Usuarios" value={stats.overview.totalUsers} icon={Users} color="blue" />
        <StatCard title="Eventos" value={stats.overview.totalEvents} icon={MapPin} color="green" />
        <StatCard title="Competiciones" value={stats.overview.totalCompetitions} icon={Trophy} color="yellow" />
        <StatCard title="Ediciones" value={stats.overview.totalEditions} icon={Calendar} color="purple" />
        <StatCard title="Series" value={stats.overview.totalSpecialSeries} icon={Award} color="orange" />
        <StatCard title="Servicios" value={stats.overview.totalServices} icon={Briefcase} color="blue" />
      </div>

      {/* Second row overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Reviews" value={stats.overview.totalReviews} icon={MessageSquare} color="green" />
        <StatCard title="Organizadores" value={stats.overview.totalOrganizers} icon={Building2} color="purple" />
        <StatCard title="Categorías" value={stats.overview.totalCategories} icon={Layers} color="yellow" />
        <StatCard title="Participantes" value={stats.overview.totalParticipants} icon={UserCheck} color="blue" />
        <StatCard title="Favoritos" value={stats.overview.totalFavorites} icon={Heart} color="red" />
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Usuarios
            </CardTitle>
            <CardDescription>Desglose de usuarios del portal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Activos</p>
                  <p className="font-bold text-green-700">{stats.users.active}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <UserX className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Inactivos</p>
                  <p className="font-bold text-red-700">{stats.users.inactive}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-500">Insiders</p>
                  <p className="font-bold text-yellow-700">{stats.users.insiders}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Públicos</p>
                  <p className="font-bold text-blue-700">{stats.users.publicProfiles}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">Por rol</p>
              <div className="space-y-2">
                {stats.users.byRole.map((item) => (
                  <div key={item.role} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.role === 'ADMIN' && <Crown className="w-4 h-4 text-red-500" />}
                      {item.role === 'ORGANIZER' && <Shield className="w-4 h-4 text-blue-500" />}
                      {item.role === 'ATHLETE' && <Trophy className="w-4 h-4 text-green-500" />}
                      {item.role === 'VIEWER' && <Eye className="w-4 h-4 text-gray-500" />}
                      <span className="text-sm text-gray-600">{ROLE_LABELS[item.role] || item.role}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Nuevos esta semana</span>
                <span className="font-medium text-green-600">+{stats.users.newThisWeek}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-500">Nuevos este mes</span>
                <span className="font-medium text-green-600">+{stats.users.newThisMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Eventos
            </CardTitle>
            <CardDescription>Distribución de eventos por estado y país</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {stats.events.byStatus.map((item) => (
                <div
                  key={item.status}
                  className={`p-3 rounded-lg text-center ${
                    item.status === 'PUBLISHED' ? 'bg-green-50' :
                    item.status === 'DRAFT' ? 'bg-yellow-50' : 'bg-gray-50'
                  }`}
                >
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-xs text-gray-500">{STATUS_LABELS[item.status] || item.status}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">Top países</p>
              <div className="space-y-2">
                {stats.events.byCountry.slice(0, 5).map((item, index) => (
                  <div key={item.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-4">{index + 1}.</span>
                      <span className="text-sm text-gray-600">{getCountryName(item.country)}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Nuevos este mes</span>
                <span className="font-medium text-green-600">+{stats.events.newThisMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Competiciones
            </CardTitle>
            <CardDescription>Distribución por tipo y estado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {stats.competitions.byStatus.map((item) => (
                <div
                  key={item.status}
                  className={`p-3 rounded-lg text-center ${
                    item.status === 'PUBLISHED' ? 'bg-green-50' :
                    item.status === 'DRAFT' ? 'bg-yellow-50' : 'bg-gray-50'
                  }`}
                >
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-xs text-gray-500">{STATUS_LABELS[item.status] || item.status}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">Por tipo</p>
              <div className="space-y-2">
                {stats.competitions.byType.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{TYPE_LABELS[item.type] || item.type}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Nuevas este mes</span>
                <span className="font-medium text-green-600">+{stats.competitions.newThisMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Ediciones
            </CardTitle>
            <CardDescription>Estado temporal de las ediciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Próximas</p>
                  <p className="font-bold text-blue-700">{stats.editions.upcoming}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Pasadas</p>
                  <p className="font-bold text-gray-700">{stats.editions.past}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">Por estado</p>
              <div className="space-y-2">
                {stats.editions.byStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{STATUS_LABELS[item.status] || item.status}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Nuevas este mes</span>
                <span className="font-medium text-green-600">+{stats.editions.newThisMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Servicios
            </CardTitle>
            <CardDescription>Servicios por categoría y estado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-blue-700">{stats.services.total}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-500">Destacados</p>
                  <p className="font-bold text-yellow-700">{stats.services.featured}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">Por categoría</p>
              <div className="space-y-2">
                {stats.services.byCategory.map((item) => (
                  <div key={item.categoryId} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.categoryName}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews & Organizers Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              Reviews y Organizadores
            </CardTitle>
            <CardDescription>Actividad de la comunidad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700">Reviews</span>
                </div>
                <p className="text-3xl font-bold text-green-800">{stats.reviews.total}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-600">
                    Promedio: {stats.reviews.averageRating}/5
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="text-green-600">+{stats.reviews.thisMonth}</span> este mes
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-700">Organizadores</span>
                </div>
                <p className="text-3xl font-bold text-purple-800">{stats.organizers.total}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Verificados</span>
                    <span className="text-green-600">{stats.organizers.verified}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Pendientes</span>
                    <span className="text-yellow-600">{stats.organizers.unverified}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">Special Series</p>
              <div className="space-y-2">
                {stats.specialSeries.byStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{STATUS_LABELS[item.status] || item.status}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between font-medium pt-2 border-t">
                  <span className="text-gray-700">Total</span>
                  <span>{stats.specialSeries.total}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Actividad Reciente
          </CardTitle>
          <CardDescription>Resumen de actividad en los últimos 7 días y mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-700">{stats.recentActivity.usersThisWeek}</p>
              <p className="text-xs text-gray-500">Usuarios (7 días)</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MapPin className="w-6 h-6 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-700">{stats.recentActivity.eventsThisMonth}</p>
              <p className="text-xs text-gray-500">Eventos (mes)</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Trophy className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
              <p className="text-2xl font-bold text-yellow-700">{stats.recentActivity.competitionsThisMonth}</p>
              <p className="text-xs text-gray-500">Competiciones (mes)</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 mx-auto text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-700">{stats.recentActivity.editionsThisMonth}</p>
              <p className="text-xs text-gray-500">Ediciones (mes)</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <MessageSquare className="w-6 h-6 mx-auto text-orange-600 mb-2" />
              <p className="text-2xl font-bold text-orange-700">{stats.recentActivity.reviewsThisWeek}</p>
              <p className="text-xs text-gray-500">Reviews (7 días)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zancadas Section */}
      {zancadasStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zancadas Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Footprints className="w-5 h-5 text-green-600" />
                Zancadas - Resumen
              </CardTitle>
              <CardDescription>Estadísticas del programa de puntos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-700">{zancadasStats.totalPointsAwarded.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Puntos totales</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-700">{zancadasStats.totalTransactions}</p>
                  <p className="text-xs text-gray-500">Transacciones</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-700">{zancadasStats.usersWithPoints}</p>
                  <p className="text-xs text-gray-500">Usuarios con puntos</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-3">Puntos por acción</p>
                <div className="space-y-3">
                  {zancadasStats.transactionsByAction.map((action) => (
                    <div key={action.actionCode} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{action.actionName}</span>
                        <span className="text-xs text-gray-400 ml-2">({action.count} veces)</span>
                      </div>
                      <span className="font-bold text-green-600">{action.points.toLocaleString()} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Zancadas Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Últimas Zancadas
              </CardTitle>
              <CardDescription>10 transacciones más recientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {zancadasStats.recentTransactions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No hay transacciones aún</p>
                ) : (
                  zancadasStats.recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{tx.userName}</p>
                        <p className="text-xs text-gray-500">
                          {tx.actionName} • {new Date(tx.createdAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <span className="ml-2 text-sm font-bold text-green-600">+{tx.points}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
