'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { promotionsService } from '@/lib/api/v2';
import { Promotion, PromotionType, PromotionStatus } from '@/types/v2';
import PromotionCard from '@/components/promotions/PromotionCard';
import { Plus, Search, Filter, BarChart } from 'lucide-react';

export default function AdminPromotionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<PromotionType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<PromotionStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    if (user?.role === 'ADMIN') {
      loadPromotions();
    }
  }, [user, authLoading, router, page, search, typeFilter, statusFilter]);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {
        page,
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      if (search) filters.search = search;
      if (typeFilter !== 'ALL') filters.type = typeFilter;
      if (statusFilter !== 'ALL') filters.status = statusFilter;

      const response = await promotionsService.getAll(filters);
      setPromotions(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err: any) {
      console.error('Error loading promotions:', err);
      setError(err.message || 'Error al cargar promociones');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta promoción?')) return;

    try {
      await promotionsService.delete(id);
      loadPromotions();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar la promoción');
    }
  };

  if (authLoading || (user?.role === 'ADMIN' && loading && promotions.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando promociones...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Promociones</h1>
              <p className="text-gray-600 mt-1">Cupones y Contenido Exclusivo</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin/promotions/analytics')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <BarChart className="h-5 w-5" />
                Analítica
              </button>
              <button
                onClick={() => router.push('/admin/promotions/new')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-5 w-5" />
                Nueva Promoción
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por título o descripción..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="ALL">Todos los tipos</option>
                  <option value="COUPON">Cupones</option>
                  <option value="EXCLUSIVE_CONTENT">Contenido Exclusivo</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="ALL">Todos los estados</option>
                  <option value="DRAFT">Borrador</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="ARCHIVED">Archivado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Promociones</div>
            <div className="text-3xl font-bold text-gray-900">{promotions.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Cupones</div>
            <div className="text-3xl font-bold text-blue-600">
              {promotions.filter(p => p.type === 'COUPON').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Contenido Exclusivo</div>
            <div className="text-3xl font-bold text-purple-600">
              {promotions.filter(p => p.type === 'EXCLUSIVE_CONTENT').length}
            </div>
          </div>
        </div>

        {/* Promotions Grid */}
        {loading && promotions.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando promociones...</p>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">No se encontraron promociones</p>
            <button
              onClick={() => router.push('/admin/promotions/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="h-5 w-5" />
              Crear Primera Promoción
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  promotion={promotion}
                  showActions
                  onEdit={(id) => router.push(`/admin/promotions/${id}/edit`)}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      page === pageNum
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
