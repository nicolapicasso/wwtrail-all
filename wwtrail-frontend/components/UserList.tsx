// components/UserList.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Users, Filter } from 'lucide-react';
import UserCard from './UserCard';
import { userService, PublicUser, GetPublicUsersParams, PaginationInfo } from '@/lib/api/user.service';
import { COUNTRIES } from '@/lib/utils/countries';

interface UserListProps {
  initialPage?: number;
  initialLimit?: number;
  showFilters?: boolean;
  viewMode?: 'grid' | 'list';
  editionId?: string; // Para filtrar por participantes de una edición
}

export function UserList({
  initialPage = 1,
  initialLimit = 12,
  showFilters = true,
  viewMode: initialViewMode = 'grid',
  editionId,
}: UserListProps) {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState(initialViewMode);

  // Filters
  const [page, setPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [country, setCountry] = useState('');
  const [minAge, setMinAge] = useState<number | undefined>(undefined);
  const [maxAge, setMaxAge] = useState<number | undefined>(undefined);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: GetPublicUsersParams = {
        page,
        limit: initialLimit,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (country) params.country = country;
      if (minAge !== undefined) params.minAge = minAge;
      if (maxAge !== undefined) params.maxAge = maxAge;
      if (editionId) params.editionId = editionId;

      const result = await userService.getPublicUsers(params);
      setUsers(result.users);
      setPagination(result.pagination);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  }, [page, initialLimit, debouncedSearch, country, minAge, maxAge, editionId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, country, minAge, maxAge]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (pagination && pagination.hasNext) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    if (!pagination) return [];

    const { totalPages } = pagination;
    const pageNumbers: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (page >= totalPages - 3) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = page - 1; i <= page + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div>
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Country filter */}
            <div className="w-48">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los pa{'\u00ed'}ses</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Age range */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Edad min"
                value={minAge || ''}
                onChange={(e) => setMinAge(e.target.value ? Number(e.target.value) : undefined)}
                className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Edad max"
                value={maxAge || ''}
                onChange={(e) => setMaxAge(e.target.value ? Number(e.target.value) : undefined)}
                className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
              />
            </div>

            {/* View toggle */}
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Lista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && users.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de b{'\u00fa'}squeda</p>
        </div>
      )}

      {/* User grid/list */}
      {!loading && !error && users.length > 0 && (
        <>
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {users.map((user) => (
              <UserCard key={user.id} user={user} viewMode={viewMode} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={handlePreviousPage}
                disabled={!pagination.hasPrev}
                className={`p-2 rounded-lg ${
                  pagination.hasPrev
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {getPageNumbers().map((pageNum, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof pageNum === 'number' && setPage(pageNum)}
                  disabled={pageNum === '...'}
                  className={`px-3 py-1 rounded-lg ${
                    pageNum === page
                      ? 'bg-blue-600 text-white'
                      : pageNum === '...'
                      ? 'text-gray-400 cursor-default'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={!pagination.hasNext}
                className={`p-2 rounded-lg ${
                  pagination.hasNext
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Results info */}
          {pagination && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Mostrando {users.length} de {pagination.totalUsers} usuarios
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default UserList;
