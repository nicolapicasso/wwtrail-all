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
        <div className="mb-7 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card">
          {/* Search */}
          <div className="min-w-[200px] flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-faint" />
              <input
                type="text"
                placeholder="Buscar corredores\u2026"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-alt py-2.5 pl-10 pr-4 text-[15px] outline-none placeholder:text-placeholder focus:border-green-brand focus:ring-2 focus:ring-green-brand/30"
              />
            </div>
          </div>

          {/* Country filter */}
          <div className="w-48">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-alt px-3 py-2.5 text-[14px] font-semibold text-ink-2 outline-none focus:border-green-brand focus:ring-2 focus:ring-green-brand/30"
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
              placeholder="Edad m\u00edn"
              value={minAge || ''}
              onChange={(e) => setMinAge(e.target.value ? Number(e.target.value) : undefined)}
              className="w-24 rounded-md border border-border px-3 py-2.5 text-[14px] outline-none placeholder:text-placeholder focus:border-green-brand focus:ring-2 focus:ring-green-brand/30"
              min="0"
              max="100"
            />
            <span className="text-text-faint">\u2013</span>
            <input
              type="number"
              placeholder="Edad m\u00e1x"
              value={maxAge || ''}
              onChange={(e) => setMaxAge(e.target.value ? Number(e.target.value) : undefined)}
              className="w-24 rounded-md border border-border px-3 py-2.5 text-[14px] outline-none placeholder:text-placeholder focus:border-green-brand focus:ring-2 focus:ring-green-brand/30"
              min="0"
              max="100"
            />
          </div>

          {/* View toggle */}
          <div className="flex gap-0.5 rounded-md bg-[#e7e5dd] p-[3px]">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-sm px-4 py-2 text-[13.5px] font-bold transition-colors ${
                viewMode === 'grid' ? 'bg-surface text-ink-2 shadow-card' : 'text-text-muted hover:text-ink-2'
              }`}
            >
              \u25a6 Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-sm px-4 py-2 text-[13.5px] font-bold transition-colors ${
                viewMode === 'list' ? 'bg-surface text-ink-2 shadow-card' : 'text-text-muted hover:text-ink-2'
              }`}
            >
              \u2630 Lista
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-brand border-t-transparent"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="py-12 text-center">
          <p className="text-destructive">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 rounded-md bg-green-brand px-4 py-2 font-semibold text-white hover:brightness-95"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && users.length === 0 && (
        <div className="py-16 text-center">
          <Users className="mx-auto mb-4 h-16 w-16 text-text-faint/40" />
          <h3 className="mb-2 text-[18px] font-extrabold text-ink-2">No se encontraron corredores</h3>
          <p className="text-[15px] text-text-muted">Intenta ajustar los filtros de b{'\u00fa'}squeda</p>
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
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={!pagination.hasPrev}
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-surface text-ink-2 transition-colors hover:border-green-brand disabled:pointer-events-none disabled:opacity-40"
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {getPageNumbers().map((pageNum, idx) =>
                pageNum === '...' ? (
                  <span key={`e-${idx}`} className="px-1 text-text-faint">…</span>
                ) : (
                  <button
                    key={idx}
                    onClick={() => setPage(pageNum as number)}
                    className={`flex h-10 w-10 items-center justify-center rounded-sm border font-stat text-[14px] font-bold transition-colors ${
                      pageNum === page
                        ? 'border-green-brand bg-green-brand text-white'
                        : 'border-border bg-surface text-ink-2 hover:border-green-brand'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                onClick={handleNextPage}
                disabled={!pagination.hasNext}
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-surface text-ink-2 transition-colors hover:border-green-brand disabled:pointer-events-none disabled:opacity-40"
                aria-label="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Results info */}
          {pagination && (
            <p className="mt-4 text-center text-[13px] text-text-muted">
              Mostrando {users.length} de {pagination.totalUsers} corredores
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default UserList;
