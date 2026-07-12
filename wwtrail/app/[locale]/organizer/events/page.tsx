'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus, Loader2, LayoutGrid, LayoutList } from 'lucide-react';
import EventStats from '@/components/EventStats';
import EventFilters from '@/components/EventFilters';
import EventCard from '@/components/EventCard';
import BulkActionsBar from '@/components/BulkActionsBar';
import ConfirmDialog from '@/components/ConfirmDialog';
import eventsService from '@/lib/api/v2/events.service';
import { Event, EventStatus } from '@/types/event';
import type { EventStatsData } from '@/components/EventStats';
import { useAuth } from '@/hooks/useAuth';

type ViewMode = 'list' | 'grid';

export default function MyEventsPage() {
  const router = useRouter();
  const t = useTranslations('boEvents');
  const { user } = useAuth();

  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<EventStatsData>({
    total: 0,
    published: 0,
    draft: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Selection state
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set());

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Filters - separate input value from debounced API value
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'ALL'>('ALL');
  const [countryFilter, setCountryFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [organizerFilter, setOrganizerFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);

  // Debounce timer ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Pagination
  const [totalPages, setTotalPages] = useState(1);

  // Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'warning' | 'info' | 'success';
    action: (() => Promise<void>) | null;
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'danger',
    action: null,
  });

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN';

  /**
   * Toggle event selection
   */
  const toggleEventSelection = (eventId: string) => {
    setSelectedEventIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  /**
   * Select all events on current page
   */
  const selectAllEvents = () => {
    if (selectedEventIds.size === events.length) {
      // Deselect all
      setSelectedEventIds(new Set());
    } else {
      // Select all
      setSelectedEventIds(new Set(events.map((e) => e.id)));
    }
  };

  /**
   * Clear selection
   */
  const clearSelection = () => {
    setSelectedEventIds(new Set());
  };

  /**
   * Fetch events - uses debouncedSearch to prevent excessive API calls
   */
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);

      const filters: Record<string, any> = {
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        country: countryFilter || undefined,
        month: monthFilter || undefined,
        organizerId: isAdmin && organizerFilter ? organizerFilter : undefined,
        isFeatured: featuredFilter,
      };

      const response = isAdmin && organizerFilter
        ? await eventsService.getAll(filters)
        : await eventsService.getMyEvents(filters);

      setEvents(response.data);
      setTotalPages(response.pagination.pages);

      // Clear selection when data changes
      setSelectedEventIds(new Set());
    } catch (error: any) {
      console.error('Error fetching events:', error);
      alert(error.response?.data?.message || t('errorLoadingEvents'));
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, countryFilter, monthFilter, organizerFilter, featuredFilter, isAdmin]);

  /**
   * Fetch stats
   */
  const fetchStats = useCallback(async () => {
    try {
      const response = await eventsService.getStats();
      setStats(response.data as unknown as EventStatsData);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, [fetchEvents, fetchStats]);

  /**
   * Handle search with debounce - updates input immediately, debounces API call
   */
  const handleSearch = (query: string) => {
    // Update input value immediately for responsive UI
    setSearchQuery(query);

    // Clear any existing debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the API call (300ms delay)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(query);
      setPage(1);
    }, 300);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  /**
   * Handle status filter
   */
  const handleFilterStatus = (status: string) => {
    setStatusFilter(status as EventStatus | 'ALL');
    setPage(1);
  };

  /**
   * Handle country filter
   */
  const handleFilterCountry = (country: string) => {
    setCountryFilter(country);
    setPage(1);
  };

  /**
   * Handle month filter
   */
  const handleFilterMonth = (month: string) => {
    setMonthFilter(month);
    setPage(1);
  };

  /**
   * Handle organizer filter (admin only)
   */
  const handleFilterOrganizer = (organizerId: string) => {
    setOrganizerFilter(organizerId);
    setPage(1);
  };

  /**
   * Handle featured filter
   */
  const handleFilterFeatured = (featured: boolean | null) => {
    setFeaturedFilter(featured);
    setPage(1);
  };

  /**
   * Handle bulk status change
   */
  const handleBulkStatusChange = (newStatus: EventStatus) => {
    const count = selectedEventIds.size;
    const statusLabels: Record<string, string> = {
      PUBLISHED: t('bulkPublish'),
      DRAFT: t('bulkToDraft'),
      CANCELLED: t('bulkCancel'),
    };

    setConfirmDialog({
      isOpen: true,
      title: t('bulkStatusTitle', { action: statusLabels[newStatus].charAt(0).toUpperCase() + statusLabels[newStatus].slice(1) }),
      message: t('bulkStatusMessage', { action: statusLabels[newStatus], count }),
      variant: newStatus === 'CANCELLED' ? 'warning' : 'info',
      action: async () => {
        try {
          setIsLoadingAction(true);
          
          // Execute bulk update
          await Promise.all(
            Array.from(selectedEventIds).map((eventId) =>
              eventsService.updateStatus(eventId, newStatus)
            )
          );
          
          await fetchEvents();
          await fetchStats();
          clearSelection();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error: any) {
          console.error('Error updating status:', error);
          alert(error.response?.data?.message || t('errorUpdatingStatus'));
        } finally {
          setIsLoadingAction(false);
        }
      },
    });
  };

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = () => {
    const count = selectedEventIds.size;

    setConfirmDialog({
      isOpen: true,
      title: t('bulkDeleteTitle'),
      message: t('bulkDeleteMessage', { count }),
      variant: 'danger',
      action: async () => {
        try {
          setIsLoadingAction(true);
          
          // Execute bulk delete
          await Promise.all(
            Array.from(selectedEventIds).map((eventId) =>
              eventsService.delete(eventId)
            )
          );
          
          await fetchEvents();
          await fetchStats();
          clearSelection();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error: any) {
          console.error('Error deleting events:', error);
          alert(error.response?.data?.message || t('errorDeletingEvents'));
        } finally {
          setIsLoadingAction(false);
        }
      },
    });
  };

  /**
   * Handle edit
   */
  const handleEdit = (eventId: string) => {
    router.push(`/organizer/events/edit/${eventId}`);
  };

  /**
   * Handle delete single
   */
  const handleDelete = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    setConfirmDialog({
      isOpen: true,
      title: t('deleteEventTitle'),
      message: t('deleteEventMessage', { name: event.name }),
      variant: 'danger',
      action: async () => {
        try {
          setIsLoadingAction(true);
          await eventsService.delete(eventId);
          await fetchEvents();
          await fetchStats();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error: any) {
          console.error('Error deleting event:', error);
          alert(error.response?.data?.message || t('errorDeletingEvent'));
        } finally {
          setIsLoadingAction(false);
        }
      },
    });
  };

  /**
   * Handle add competition
   */
  const handleAddCompetition = (eventId: string) => {
    router.push(`/organizer/competitions/new?eventId=${eventId}`);
  };

  /**
   * Handle approve (admin only)
   */
  const handleApprove = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    setConfirmDialog({
      isOpen: true,
      title: t('approveEventTitle'),
      message: t('approveEventMessage', { name: event.name }),
      variant: 'success',
      action: async () => {
        try {
          setIsLoadingAction(true);
          await eventsService.approve(eventId);
          await fetchEvents();
          await fetchStats();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error: any) {
          console.error('Error approving event:', error);
          alert(error.response?.data?.message || t('errorApprovingEvent'));
        } finally {
          setIsLoadingAction(false);
        }
      },
    });
  };

  /**
   * Handle reject (admin only)
   */
  const handleReject = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    const reason = prompt(t('rejectReasonPrompt', { name: event.name }));
    if (reason === null) return;

    setConfirmDialog({
      isOpen: true,
      title: t('rejectEventTitle'),
      message: t('rejectEventMessage', { name: event.name }),
      variant: 'danger',
      action: async () => {
        try {
          setIsLoadingAction(true);
          await eventsService.reject(eventId, { reason: reason || undefined });
          await fetchEvents();
          await fetchStats();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error: any) {
          console.error('Error rejecting event:', error);
          alert(error.response?.data?.message || t('errorRejectingEvent'));
        } finally {
          setIsLoadingAction(false);
        }
      },
    });
  };

  /**
   * Handle toggle featured (admin only)
   */
  const handleToggleFeatured = async (eventId: string) => {
    try {
      await eventsService.toggleFeatured(eventId);
      await fetchEvents();
    } catch (error: any) {
      console.error('Error toggling featured:', error);
      alert(error.response?.data?.message || t('errorTogglingFeatured'));
    }
  };

  /**
   * Close confirm dialog
   */
  const closeConfirmDialog = () => {
    if (!isLoadingAction) {
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? t('eventsAdminTitle') : t('myEvents')}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isAdmin
                ? t('eventsAdminSubtitle')
                : t('myEventsSubtitle')}
            </p>
          </div>
          <button
            onClick={() => router.push('/organizer/events/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            {t('newEvent')}
          </button>
        </div>

        {/* Stats */}
        <EventStats stats={stats} isLoading={isLoading && events.length === 0} />

        {/* Filters */}
        <EventFilters
          searchValue={searchQuery}
          onSearch={handleSearch}
          onFilterStatus={handleFilterStatus}
          onFilterCountry={handleFilterCountry}
          onFilterMonth={handleFilterMonth}
          onFilterOrganizer={isAdmin ? handleFilterOrganizer : undefined}
          onFilterHighlighted={handleFilterFeatured}
          selectedCountry={countryFilter}
          showCountryFilter={true}
          showOrganizerFilter={isAdmin}
          showStatusFilter={true}
          showMonthFilter={true}
          showHighlightedFilter={true}
          isLoading={isLoading}
        />

        {/* Controls: Select All + View Toggle */}
        {events.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedEventIds.size === events.length && events.length > 0}
                onChange={selectAllEvents}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="select-all" className="text-sm text-gray-700 cursor-pointer">
                {t('selectAll', { count: events.length })}
              </label>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title={t('viewList')}
              >
                <LayoutList className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title={t('viewGrid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Events List */}
        {isLoading && events.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : !events || events.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">{t('noEventsFound')}</p>
            <button
              onClick={() => router.push('/organizer/events/new')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              {t('createFirstEvent')}
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }>
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                viewMode={viewMode}
                managementMode={true}
                userRole={(user?.role as any) || 'ATHLETE'}
                isSelected={selectedEventIds.has(event.id)}
                onSelect={() => toggleEventSelection(event.id)}
                onEdit={handleEdit}
                onDelete={isAdmin ? handleDelete : undefined}
                onAddCompetition={handleAddCompetition}
                onApprove={isAdmin ? handleApprove : undefined}
                onReject={isAdmin ? handleReject : undefined}
                onToggleFeatured={isAdmin ? handleToggleFeatured : undefined}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('previous')}
            </button>
            <span className="text-sm text-gray-600">
              {t('pageOf', { page, totalPages })}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('next')}
            </button>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedEventIds.size}
        onChangeStatus={handleBulkStatusChange}
        onDelete={handleBulkDelete}
        onClearSelection={clearSelection}
        isLoading={isLoadingAction}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.action || (() => Promise.resolve())}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        isLoading={isLoadingAction}
      />
    </div>
  );
}
