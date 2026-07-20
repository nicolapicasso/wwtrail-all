'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus, Loader2, Calendar, Mountain, TrendingUp, Users, Edit, Trash2, Eye, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import ConfirmDialog from '@/components/ConfirmDialog';
import EventSelect from '@/components/EventSelect';
import editionsService from '@/lib/api/v2/editions.service';
import competitionsService from '@/lib/api/v2/competitions.service';
import eventsService from '@/lib/api/v2/events.service';
import type { Edition } from '@/types/edition';
import type { Competition } from '@/types/competition';
import type { Event } from '@/types/event';
import { useAuth } from '@/hooks/useAuth';

export default function OrganizerEditionsPage() {
  const router = useRouter();
  const t = useTranslations('boEvents');
  const { user } = useAuth();

  // State
  const [editions, setEditions] = useState<Edition[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Filters
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');

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

  /**
   * Fetch events for filter
   */
  const fetchEvents = useCallback(async () => {
    try {
      const response = await eventsService.getMyEvents({ limit: 100 });
      setEvents(response.data);
    } catch (error: any) {
      console.error('Error fetching events:', error);
    }
  }, []);

  /**
   * Fetch competitions when event changes
   */
  const fetchCompetitions = useCallback(async (eventId: string) => {
    if (!eventId) {
      setCompetitions([]);
      return;
    }

    try {
      setIsLoadingCompetitions(true);
      const comps = await competitionsService.getByEvent(eventId);
      setCompetitions(comps);
    } catch (error: any) {
      console.error('Error fetching competitions:', error);
      setCompetitions([]);
    } finally {
      setIsLoadingCompetitions(false);
    }
  }, []);

  /**
   * Fetch editions.
   * Cargamos ediciones SOLO cuando hay un evento (o competición) seleccionado,
   * para evitar la cascada lenta de "todos los eventos → todas las competiciones
   * → todas las ediciones" al abrir la página. El buscador filtra por literal
   * sobre las ediciones ya cargadas, igual que en el resto de listados.
   */
  const fetchEditions = useCallback(async () => {
    // Sin evento ni competición seleccionados no cargamos nada.
    if (!selectedEventId && !selectedCompetitionId) {
      setEditions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      if (selectedCompetitionId) {
        // Cargar solo de la competición seleccionada
        const eds = await editionsService.getByCompetition(selectedCompetitionId);
        const selectedComp = competitions.find(c => c.id === selectedCompetitionId);
        const event = events.find(e => e.id === selectedComp?.eventId);
        setEditions(
          eds.map(ed => ({
            ...ed,
            competition: selectedComp ? { id: selectedComp.id, name: selectedComp.name, slug: selectedComp.slug } : undefined,
            eventName: event?.name || '',
          }))
        );
      } else {
        // Evento seleccionado: cargar las ediciones de sus competiciones (ya cargadas)
        const event = events.find(e => e.id === selectedEventId);
        const allEditions: Edition[] = [];
        for (const comp of competitions) {
          const eds = await editionsService.getByCompetition(comp.id);
          allEditions.push(
            ...eds.map(ed => ({
              ...ed,
              competition: { id: comp.id, name: comp.name, slug: comp.slug },
              eventName: event?.name || '',
            }))
          );
        }
        setEditions(allEditions);
      }
    } catch (error: any) {
      console.error('Error fetching editions:', error);
      setEditions([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompetitionId, selectedEventId, competitions, events]);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /**
   * Load competitions when event changes
   */
  useEffect(() => {
    if (selectedEventId) {
      fetchCompetitions(selectedEventId);
      setSelectedCompetitionId(''); // Reset competition filter
    } else {
      setCompetitions([]);
      setSelectedCompetitionId('');
    }
  }, [selectedEventId, fetchCompetitions]);

  /**
   * Load editions (only runs the fetch when an event/competition is selected;
   * otherwise fetchEditions clears the list without hitting the API).
   */
  useEffect(() => {
    fetchEditions();
  }, [fetchEditions]);

  /**
   * Handle delete
   */
  const handleDelete = (editionId: string) => {
    const edition = editions.find((e) => e.id === editionId);
    if (!edition) return;

    setConfirmDialog({
      isOpen: true,
      title: t('deleteEditionTitle'),
      message: t('deleteEditionMessage', { year: edition.year }),
      variant: 'danger',
      action: async () => {
        try {
          setIsLoadingAction(true);
          await editionsService.delete(editionId);
          await fetchEditions();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error: any) {
          console.error('Error deleting edition:', error);
          alert(error.response?.data?.message || t('errorDeletingEdition'));
        } finally {
          setIsLoadingAction(false);
        }
      },
    });
  };

  /**
   * Close confirm dialog
   */
  const closeConfirmDialog = () => {
    if (!isLoadingAction) {
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  };

  /**
   * Filter editions
   */
  const filteredEditions = editions.filter((edition) => {
    // Literal search across year, competition, event and city
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const haystack = [
        edition.year?.toString(),
        (edition as any).competition?.name,
        (edition as any).eventName,
        edition.city,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    // Featured filter
    if (featuredFilter !== 'all') {
      const isFeatured = (edition as any).featured === true;
      if (featuredFilter === 'true' && !isFeatured) return false;
      if (featuredFilter === 'false' && isFeatured) return false;
    }
    return true;
  });

  // Sort by year descending
  const sortedEditions = [...filteredEditions].sort((a, b) => b.year - a.year);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('myEditions')}</h1>
            <p className="mt-1 text-sm text-gray-600">
              {t('myEditionsSubtitle')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Event Filter */}
            <div>
              <label htmlFor="event-filter" className="block text-sm font-medium text-gray-700 mb-2">
                {t('filterByEvent')}
              </label>
              <EventSelect
                value={selectedEventId}
                onChange={setSelectedEventId}
                events={events.map((e) => ({
                  id: e.id,
                  name: e.name,
                  city: e.city,
                  country: e.country,
                }))}
                placeholder={t('selectEvent')}
                showAllOption={true}
                allOptionLabel={t('allEvents')}
                isLoading={isLoading}
              />
            </div>

            {/* Competition Filter */}
            <div>
              <label htmlFor="competition-filter" className="block text-sm font-medium text-gray-700 mb-2">
                {t('filterByCompetition')}
              </label>
              <select
                id="competition-filter"
                value={selectedCompetitionId}
                onChange={(e) => setSelectedCompetitionId(e.target.value)}
                disabled={!selectedEventId || isLoadingCompetitions}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedEventId
                    ? t('allCompetitions')
                    : t('selectEventFirst')}
                </option>
                {competitions.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Filter */}
            <div>
              <label htmlFor="featured-filter" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Star className="h-4 w-4" />
                {t('featured')}
              </label>
              <select
                id="featured-filter"
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">{t('allEditions')}</option>
                <option value="true">{t('onlyFeatured')}</option>
                <option value="false">{t('notFeatured')}</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                {t('searchEditions')}
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchEditionsPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('totalEditions')}</p>
                <p className="text-2xl font-bold text-gray-900">{sortedEditions.length}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('upcoming')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedEditions.filter((e) => e.status === 'UPCOMING').length}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('finished')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedEditions.filter((e) => e.status === 'FINISHED').length}
                </p>
              </div>
              <Mountain className="h-12 w-12 text-gray-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('inProgress')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedEditions.filter((e) => e.status === 'ONGOING').length}
                </p>
              </div>
              <Users className="h-12 w-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Editions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : sortedEditions.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {selectedCompetitionId
                ? t('noEditionsInCompetition')
                : selectedEventId
                ? t('noEditionsInEvent')
                : t('selectEventPrompt')}
            </p>
            {selectedCompetitionId && (
              <button
                onClick={() =>
                  router.push(`/organizer/editions/new?competitionId=${selectedCompetitionId}`)
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                {t('createEdition')}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEditions.map((edition) => (
              <div
                key={edition.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* L1: Competition Name + Year */}
                      <div className="flex items-center gap-3 mb-1">
                        {(edition as any).competition?.name && (
                          <span className="text-xl font-bold text-gray-900">
                            {(edition as any).competition.name} {edition.year}
                          </span>
                        )}

                        {edition.status && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              edition.status === 'FINISHED'
                                ? 'bg-gray-100 text-gray-700'
                                : edition.status === 'UPCOMING'
                                ? 'bg-blue-100 text-blue-700'
                                : edition.status === 'ONGOING'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {edition.status === 'FINISHED'
                              ? t('statusFinished')
                              : edition.status === 'UPCOMING'
                              ? t('statusUpcoming')
                              : edition.status === 'ONGOING'
                              ? t('statusOngoing')
                              : t('statusCancelled')}
                          </span>
                        )}

                        {edition.registrationStatus && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {t('registrationColon')}{' '}
                            {edition.registrationStatus === 'OPEN'
                              ? t('regOpen')
                              : edition.registrationStatus === 'CLOSED'
                              ? t('regClosed')
                              : edition.registrationStatus === 'FULL'
                              ? t('regFull')
                              : t('regNotOpen')}
                          </span>
                        )}
                      </div>

                      {/* L2: Event Name */}
                      {(edition as any).eventName && (
                        <p className="text-sm text-gray-600 mb-2">
                          {(edition as any).eventName}
                        </p>
                      )}

                      {/* Dates */}
                      {edition.specificDate && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(edition.specificDate).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                          {edition.endDate &&
                            ` - ${new Date(edition.endDate).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                            })}`}
                        </div>
                      )}

                      {/* City */}
                      {edition.city && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                          <MapPin className="h-4 w-4" />
                          {edition.city}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        {edition.distance && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{edition.distance} km</span>
                          </div>
                        )}
                        {edition.elevation && (
                          <div className="flex items-center gap-1">
                            <Mountain className="h-4 w-4" />
                            <span>{edition.elevation} m D+</span>
                          </div>
                        )}
                        {edition.currentParticipants !== undefined && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {edition.currentParticipants}
                              {edition.maxParticipants && `/${edition.maxParticipants}`} {t('participants')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-3 bg-gray-50 border-t flex flex-wrap gap-2">
                  <Link
                    href={`/editions/${edition.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    {t('view')}
                  </Link>

                  <button
                    onClick={() => router.push(`/organizer/editions/edit/${edition.id}`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    {t('edit')}
                  </button>

                  <button
                    onClick={() => handleDelete(edition.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
