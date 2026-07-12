// app/organizer/organizers/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus, Loader2, Building2, Edit, Trash2, Check, X, Search } from 'lucide-react';
import { organizersService } from '@/lib/api/v2';
import { Organizer, OrganizerListItem } from '@/types/v2';
import { useAuth } from '@/hooks/useAuth';
import CountrySelect from '@/components/CountrySelect';

export default function OrganizersListPage() {
  const router = useRouter();
  const t = useTranslations('boCatalog');
  const { user } = useAuth();

  // State
  const [organizers, setOrganizers] = useState<OrganizerListItem[]>([]);
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
   * Fetch organizers
   */
  const fetchOrganizers = useCallback(async () => {
    try {
      setIsLoading(true);

      const filters = {
        page,
        limit: 10,
        search: searchQuery || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        country: countryFilter || undefined,
      };

      const response = await organizersService.getAll(filters);

      setOrganizers(response.data);
      setTotalPages(response.pagination.pages || 0);
    } catch (error: any) {
      console.error('Error fetching organizers:', error);
      alert(error.response?.data?.message || t('errorLoadingOrganizers'));
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, statusFilter, countryFilter]);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  /**
   * Handle approve
   */
  const handleApprove = async (id: string) => {
    if (!confirm(t('confirmApprove'))) return;

    try {
      setIsLoadingAction(true);
      await organizersService.approve(id);
      await fetchOrganizers();
      alert(t('organizerApproved'));
    } catch (error: any) {
      console.error('Error approving organizer:', error);
      alert(error.response?.data?.message || t('errorApproving'));
    } finally {
      setIsLoadingAction(false);
    }
  };

  /**
   * Handle reject
   */
  const handleReject = async (id: string) => {
    if (!confirm(t('confirmReject'))) return;

    try {
      setIsLoadingAction(true);
      await organizersService.reject(id);
      await fetchOrganizers();
      alert(t('organizerRejected'));
    } catch (error: any) {
      console.error('Error rejecting organizer:', error);
      alert(error.response?.data?.message || t('errorRejecting'));
    } finally {
      setIsLoadingAction(false);
    }
  };

  /**
   * Handle delete
   */
  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      setIsLoadingAction(true);
      await organizersService.delete(id);
      await fetchOrganizers();
      alert(t('organizerDeleted'));
    } catch (error: any) {
      console.error('Error deleting organizer:', error);
      alert(error.response?.data?.message || t('errorDeletingOrganizer'));
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
                <Building2 className="h-8 w-8 text-blue-600" />
                {t('organizersTitle')}
              </h1>
              <p className="mt-2 text-gray-600">
                {t('organizersSubtitle')}
              </p>
            </div>
            <button
              onClick={() => router.push('/organizer/organizers/new')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              {t('newOrganizer')}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('search')}
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
                  placeholder={t('namePlaceholder')}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('status')}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ALL">{t('all')}</option>
                <option value="PUBLISHED">{t('published')}</option>
                <option value="DRAFT">{t('draftsFilter')}</option>
                <option value="CANCELLED">{t('cancelledFilter')}</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('country')}
              </label>
              <CountrySelect
                value={countryFilter}
                onChange={(code) => {
                  setCountryFilter(code);
                  setPage(1);
                }}
                placeholder={t('allCountries')}
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Organizers List */}
        {!isLoading && (
          <>
            {organizers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('noOrganizersFound')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || statusFilter !== 'ALL' || countryFilter
                    ? t('adjustFilters')
                    : t('createFirstOrganizer')}
                </p>
                {!searchQuery && statusFilter === 'ALL' && !countryFilter && (
                  <button
                    onClick={() => router.push('/organizer/organizers/new')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    {t('createOrganizer')}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {organizers.map((org) => (
                  <div
                    key={org.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Info */}
                      <div className="flex-1 flex items-start gap-4">
                        {/* Logo */}
                        {org.logoUrl && (
                          <img
                            src={org.logoUrl}
                            alt={org.name}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                        )}

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {org.name}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              org.status === 'PUBLISHED'
                                ? 'bg-green-100 text-green-800'
                                : org.status === 'DRAFT'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {org.status === 'PUBLISHED' ? t('statusPublished') :
                               org.status === 'DRAFT' ? t('statusDraft') :
                               t('statusCancelled')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>/{org.slug}</span>
                            <span>{org.country}</span>
                            {org._count && (
                              <span>{t('eventsCount', { count: org._count.events })}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Admin Actions */}
                        {isAdmin && org.status === 'DRAFT' && (
                          <>
                            <button
                              onClick={() => handleApprove(org.id)}
                              disabled={isLoadingAction}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title={t('approve')}
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleReject(org.id)}
                              disabled={isLoadingAction}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title={t('reject')}
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => router.push(`/organizer/organizers/edit/${org.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={t('edit')}
                        >
                          <Edit className="h-5 w-5" />
                        </button>

                        {/* Delete (Admin only) */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(org.id)}
                            disabled={isLoadingAction}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={t('delete')}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('previous')}
                </button>
                <span className="px-4 py-2 text-gray-700">
                  {t('pageOf', { page, totalPages })}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
