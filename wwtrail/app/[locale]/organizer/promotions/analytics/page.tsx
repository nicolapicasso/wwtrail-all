'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { promotionsService } from '@/lib/api/v2';
import { CouponAnalytics } from '@/types/v2';
import { ArrowLeft, TrendingUp, Gift, Users, Eye } from 'lucide-react';

export default function PromotionsAnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<CouponAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && user && user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  // Load analytics when user is admin
  useEffect(() => {
    if (!authLoading && user?.role === 'ADMIN') {
      loadAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await promotionsService.getCouponAnalytics();
      setAnalytics(response.data);
    } catch (err: any) {
      console.error('Error loading analytics:', err);
      setError(err.message || 'Error al cargar analítica');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando analítica...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return null;
  }

  // Calculate totals (only after loading is complete)
  const totals = Array.isArray(analytics) ? analytics.reduce(
    (acc, item) => ({
      total: acc.total + item.totalCodes,
      used: acc.used + item.usedCodes,
      available: acc.available + item.availableCodes,
      redemptions: acc.redemptions + item.redemptions,
      views: acc.views + item.viewCount,
    }),
    { total: 0, used: 0, available: 0, redemptions: 0, views: 0 }
  ) : { total: 0, used: 0, available: 0, redemptions: 0, views: 0 };

  const usageRate = totals.total > 0 ? (totals.used / totals.total) * 100 : 0;
  const conversionRate = totals.views > 0 ? (totals.redemptions / totals.views) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Analítica de Cupones</h1>
          <p className="text-gray-600 mt-1">
            Estadísticas y métricas de todos los cupones
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            {error}
          </div>
        )}

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Códigos</div>
              <Gift className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{totals.total}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Usados</div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{totals.used}</div>
            <div className="text-xs text-gray-500 mt-1">
              {usageRate.toFixed(1)}% de uso
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Disponibles</div>
              <Gift className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{totals.available}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Canjes</div>
              <Users className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{totals.redemptions}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Conversión</div>
              <Eye className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {conversionRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {totals.views} vistas
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promoción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usados
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disponibles
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Uso
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vistas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversión
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!Array.isArray(analytics) || analytics.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No hay cupones creados todavía
                    </td>
                  </tr>
                ) : (
                  analytics.map((item) => {
                    const useRate = item.totalCodes > 0 ? (item.usedCodes / item.totalCodes) * 100 : 0;
                    const convRate = item.viewCount > 0 ? (item.redemptions / item.viewCount) * 100 : 0;

                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">
                              {item.title}
                            </div>
                            <div className="text-xs text-gray-500">{item.slug}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'DRAFT'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status === 'PUBLISHED' ? 'Publicado' : item.status === 'DRAFT' ? 'Borrador' : 'Archivado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {item.totalCodes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-medium">
                          {item.usedCodes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-purple-600 font-medium">
                          {item.availableCodes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {useRate.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {item.viewCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-indigo-600 font-medium">
                          {convRate.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => router.push(`/organizer/promotions/${item.id}`)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
