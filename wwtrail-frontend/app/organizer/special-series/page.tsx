// app/organizer/special-series/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, Sparkles, Edit, Trash2, Check, X, Search } from 'lucide-react';
import specialSeriesService from '@/lib/api/v2/specialSeries.service';
import { SpecialSeries, SpecialSeriesListItem } from '@/types/v2';
import { useAuth } from '@/hooks/useAuth';
import CountrySelect from '@/components/CountrySelect';

export default function SpecialSeriesListPage() {
  const router = useRouter();
  const { user } = useAuth();

  // State
  const [specialSeriesList, setSpecialSeriesList] = useState<SpecialSeriesListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'CANCELLED'>('ALL');
  const [countryFilter, setCountryFilter] = useState('');
  const [page, setPage] = useState(1);

  // Pagination
  const [totalPages, setTotalPages] = useState(1);

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN';

  /**
   * Fetch special series
   */
  const fetchSpecialSeries = useCallback(async () => {
    try {
      setIsLoading(true);

      const filters = {
        page,
        limit: 10,
        search: searchQuery || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        country: countryFilter || undefined,
      };

      const response = await specialSeriesService.getAll(filters);

      setSpecialSeriesList(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error: any) {
      console.error('Error fetching special series:', error);
      alert(error.response?.data?.message || 'Error al cargar series especiales');
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, statusFilter, countryFilter]);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchSpecialSeries();
  }, [fetchSpecialSeries]);

  /**
   * Handle approve
   */
  const handleApprove = async (id: string) => {
    if (!confirm('¿Aprobar esta serie especial?')) return;

    try {
      setIsLoadingAction(true);
      await specialSeriesService.approve(id);
      await fetchSpecialSeries();
      alert('✓ Serie especial aprobada');
    } catch (error: any) {
      console.error('Error approving special series:', error);
      alert(error.response?.data?.message || 'Error al aprobar serie especial');
    } finally {
      setIsLoadingAction(false);
    }
  };

  /**
   * Handle reject
   */
  const handleReject = async (id: string) => {
    if (!confirm('¿Rechazar esta serie especial? El estado cambiará a CANCELLED.')) return;

    try {
      setIsLoadingAction(true);
      await specialSeriesService.reject(id);
      await fetchSpecialSeries();
      alert('✓ Serie especial rechazada');
    } catch (error: any) {
      console.error('Error rejecting special series:', error);
      alert(error.response?.data?.message || 'Error al rechazar serie especial');
    } finally {
      setIsLoadingAction(false);
    }
  };

  /**
   * Handle delete
   */
  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta serie especial? Esta acción no se puede deshacer.')) return;

    try {
      setIsLoadingAction(true);
      await specialSeriesService.delete(id);
      await fetchSpecialSeries();
      alert('✓ Serie especial eliminada');
    } catch (error: any) {
      console.error('Error deleting special series:', error);
      alert(error.response?.data?.message || 'Error al eliminar serie especial');
    } finally {
      setIsLoadingAction(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-purple-600" />
                Series Especiales
              </h1>
              <p className="mt-2 text-gray-600">
                Gestiona circuitos y series especiales que agrupan competiciones
              </p>
            </div>
            <button
              onClick={() => router.push('/organizer/special-series/new')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Nueva Serie Especial
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Buscar por nombre..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                <option value="ALL">Todos</option>
                <option value="PUBLISHED">Publicados</option>
                <option value="DRAFT">Borradores</option>
                <option value="CANCELLED">Cancelados</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <CountrySelect
                value={countryFilter}
                onChange={(value) => {
                  setCountryFilter(value);
                  setPage(1);
                }}
                placeholder="Todos los países"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
              <span className="ml-3 text-gray-600">Cargando series especiales...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && specialSeriesList.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay series especiales
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'ALL' || countryFilter
                ? 'No se encontraron series especiales con los filtros aplicados'
                : 'Comienza creando tu primera serie especial'}
            </p>
            {!searchQuery && statusFilter === 'ALL' && !countryFilter && (
              <button
                onClick={() => router.push('/organizer/special-series/new')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Nueva Serie Especial
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {!isLoading && specialSeriesList.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serie Especial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    País
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Competiciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {specialSeriesList.map((series) => (
                  <tr key={series.id} className="hover:bg-gray-50">
                    {/* Name + Logo */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {series.logoUrl && (
                          <img
                            src={series.logoUrl}
                            alt={series.name}
                            className="h-10 w-10 object-contain rounded"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {series.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {series.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Country */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{series.country}</div>
                    </td>

                    {/* Competitions Count */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {series._count?.competitions || 0}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          series.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-800'
                            : series.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {series.status === 'PUBLISHED' ? 'Publicada' :
                         series.status === 'DRAFT' ? 'Borrador' : 'Cancelada'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* Approve (ADMIN only, DRAFT only) */}
                        {isAdmin && series.status === 'DRAFT' && (
                          <button
                            onClick={() => handleApprove(series.id)}
                            disabled={isLoadingAction}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded border border-green-200 transition-colors disabled:opacity-50"
                            title="Aprobar"
                          >
                            <Check className="h-4 w-4" />
                            Aprobar
                          </button>
                        )}

                        {/* Reject (ADMIN only, DRAFT only) */}
                        {isAdmin && series.status === 'DRAFT' && (
                          <button
                            onClick={() => handleReject(series.id)}
                            disabled={isLoadingAction}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors disabled:opacity-50"
                            title="Rechazar"
                          >
                            <X className="h-4 w-4" />
                            Rechazar
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => router.push(`/organizer/special-series/edit/${series.id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </button>

                        {/* Delete (ADMIN only) */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(series.id)}
                            disabled={isLoadingAction}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors disabled:opacity-50"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && specialSeriesList.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Página {page} de {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
