// app/organizers/page.tsx
// Listado público de organizadores

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Building2, Search, MapPin } from 'lucide-react';
import { organizersService } from '@/lib/api/v2';
import { OrganizerListItem } from '@/types/v2';
import CountrySelect from '@/components/CountrySelect';
import Link from 'next/link';

export default function OrganizersPublicPage() {
  const router = useRouter();

  // State
  const [organizers, setOrganizers] = useState<OrganizerListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [page, setPage] = useState(1);

  // Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  /**
   * Fetch organizers
   */
  const fetchOrganizers = useCallback(async () => {
    try {
      setIsLoading(true);

      const filters = {
        page,
        limit: 12,
        search: searchQuery || undefined,
        status: 'PUBLISHED' as const, // Solo mostrar publicados
        country: countryFilter || undefined,
      };

      const response = await organizersService.getAll(filters);

      setOrganizers(response.data);
      setTotalPages(response.pagination.pages);
      setTotal(response.pagination.total);
    } catch (error: any) {
      console.error('Error fetching organizers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, countryFilter]);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Organizadores</h1>
          </div>
          <p className="text-gray-600">
            Descubre las entidades y clubes que organizan eventos de trail running
          </p>
          {total > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {total} organizador{total !== 1 ? 'es' : ''} encontrado{total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Nombre del organizador..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <CountrySelect
                value={countryFilter}
                onChange={(code) => {
                  setCountryFilter(code);
                  setPage(1);
                }}
                placeholder="Todos los países"
              />
            </div>
          </div>

          {/* Clear filters */}
          {(searchQuery || countryFilter) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCountryFilter('');
                  setPage(1);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Organizers Grid */}
        {!isLoading && (
          <>
            {organizers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No se encontraron organizadores
                </h3>
                <p className="text-gray-600">
                  {searchQuery || countryFilter
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'No hay organizadores disponibles en este momento'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizers.map((org) => (
                  <Link
                    key={org.id}
                    href={`/organizers/${org.slug}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
                  >
                    {/* Logo */}
                    {org.logoUrl && (
                      <div className="mb-4 flex justify-center">
                        <img
                          src={org.logoUrl}
                          alt={org.name}
                          className="w-24 h-24 rounded-lg object-cover border border-gray-200 group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}

                    {/* Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center group-hover:text-blue-600 transition-colors">
                      {org.name}
                    </h3>

                    {/* Country */}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{org.country}</span>
                    </div>

                    {/* Stats */}
                    {org._count && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                          {org._count.events} evento{org._count.events !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
