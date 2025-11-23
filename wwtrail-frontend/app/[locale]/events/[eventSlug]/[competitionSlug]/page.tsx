// app/events/[eventSlug]/[competitionSlug]/page.tsx - Competition detail page
// ⚠️ ESTE ES EL ARCHIVO CORRECTO PARA EL NIVEL [competitionSlug]

'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCompetition } from '@/hooks/useCompetitions';
import { useEditions } from '@/hooks/useEditions';
import { eventsService } from '@/lib/api/events.service';
import { seoService } from '@/lib/api/seo.service';
import servicesService from '@/lib/api/v2/services.service';
import { EditionSelector } from '@/components/EditionSelector';
import { EditionCard } from '@/components/EditionCard';
import { Edition } from '@/types/v2';
import { Mountain, TrendingUp, Users, ArrowLeft, Calendar, MapPin, Info, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';
import EventMap from '@/components/EventMap';
import EventGallery from '@/components/EventGallery';
import OrganizerCard from '@/components/OrganizerCard';
import { RelatedArticles } from '@/components/RelatedArticles';
import { SEOFaqSchema } from '@/components/SEOFaqSchema';
import { normalizeImageUrl } from '@/lib/utils/imageUrl';
import Head from 'next/head';

export default function CompetitionDetailPage() {
  const params = useParams();
  const competitionSlug = params?.competitionSlug as string;
  const eventSlug = params?.eventSlug as string;
  const locale = params?.locale as string; // ✅ Get current locale

  const { competition, loading, error } = useCompetition(competitionSlug, locale); // ✅ Pass locale
  const { editions, loading: editionsLoading } = useEditions(competition?.id || '');
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);
  const [nearbyEvents, setNearbyEvents] = useState<any[]>([]);
  const [nearbyServices, setNearbyServices] = useState<any[]>([]);
  const [seo, setSeo] = useState<any>(null);

  // Fetch SEO data (in current language)
  useEffect(() => {
    const fetchSEO = async () => {
      if (competition?.id) {
        try {
          const seoData = await seoService.getSEO('competition', competition.id, locale);
          setSeo(seoData);
        } catch (error) {
          // SEO not found, continue without it
        }
      }
    };
    fetchSEO();
  }, [competition?.id, locale]);

  // Fetch nearby events and services when competition data is available
  useEffect(() => {
    if (competition?.event?.latitude && competition?.event?.longitude) {
      const fetchNearby = async () => {
        try {
          const events = await eventsService.getNearby(
            competition.event.latitude,
            competition.event.longitude,
            50 // 50km radius
          );
          setNearbyEvents(events);
        } catch (err) {
          console.error('Error loading nearby events:', err);
        }

        try {
          const services = await servicesService.getNearby(
            competition.event.latitude,
            competition.event.longitude,
            50 // 50km radius
          );
          setNearbyServices(services);
        } catch (err) {
          console.error('Error loading nearby services:', err);
        }
      };

      fetchNearby();
    }
  }, [competition]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-64 rounded-lg bg-gray-200" />
          <div className="h-96 rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-red-900">Competition not found</h2>
          <p className="mt-2 text-red-700">{error || 'This competition does not exist'}</p>
          <Link
            href={`/events/${eventSlug}`}
            className="mt-4 inline-block rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Back to Event
          </Link>
        </div>
      </div>
    );
  }

  const handleYearChange = (year: number, edition: Edition | null) => {
    setSelectedEdition(edition);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cover Image */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-green-600">
        {competition.coverImage && (
          <img
            src={normalizeImageUrl(competition.coverImage)}
            alt={competition.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container mx-auto">
            <div className="flex items-end justify-between">
              <div>
                {/* Breadcrumbs */}
                <div className="mb-4">
                  <nav className="flex items-center gap-2 text-sm text-white/80">
                    <Link href="/events" className="hover:text-white transition-colors">
                      Eventos
                    </Link>
                    <span>/</span>
                    <Link
                      href={`/events/${eventSlug}`}
                      className="hover:text-white transition-colors"
                    >
                      {competition.event?.name}
                    </Link>
                    <span>/</span>
                    <span className="text-white font-semibold">{competition.name}</span>
                  </nav>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {competition.name}
                </h1>
                {competition.event && (
                  <div className="flex items-center gap-2 mt-4 text-white/90">
                    <MapPin className="h-5 w-5" />
                    <span>{competition.event.city}, {competition.event.country}</span>
                  </div>
                )}
              </div>
              {!competition.isActive && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                  Inactiva
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {competition.description && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
                  <Info className="h-6 w-6 text-blue-600" />
                  Acerca de
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {competition.description}
                </p>
              </div>
            )}

            {/* Edition Selector */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Select Edition</h2>
              <EditionSelector
                competitionId={competition.id}
                competitionName={competition.name}
                onYearChange={handleYearChange}
              />
            </div>

            {/* Selected Edition Details */}
            {selectedEdition && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Edition Details</h2>
                <EditionCard edition={selectedEdition} showInheritance />
              </div>
            )}

            {/* Gallery */}
            {competition.gallery && competition.gallery.length > 0 && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <EventGallery
                  images={competition.gallery}
                  eventName={competition.name}
                />
              </div>
            )}

            {/* All Editions List */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                All Editions ({editions.length})
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Browse all available editions of this competition
              </p>

              {editionsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : editions.length > 0 ? (
                <div className="space-y-3">
                  {editions.map((edition) => (
                    <Link
                      key={edition.id}
                      href={`/editions/${edition.slug}`}
                      className="block p-4 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-blue-600">
                              {edition.year}
                            </span>
                            {edition.specificDate && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                {new Date(edition.specificDate).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </div>
                            )}
                          </div>

                          {edition.city && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                              <MapPin className="h-3 w-3" />
                              {edition.city}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            {edition.distance && (
                              <span>{edition.distance} km</span>
                            )}
                            {edition.elevation && (
                              <span>{edition.elevation} m D+</span>
                            )}
                            {edition.currentParticipants !== undefined && (
                              <span>{edition.currentParticipants} participantes</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {edition.status && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              edition.status === 'FINISHED' ? 'bg-gray-100 text-gray-700' :
                              edition.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' :
                              edition.status === 'ONGOING' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {edition.status === 'FINISHED' ? 'Finalizada' :
                               edition.status === 'UPCOMING' ? 'Próxima' :
                               edition.status === 'ONGOING' ? 'En curso' :
                               edition.status}
                            </span>
                          )}
                          <span className="text-blue-600 font-semibold">→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    No hay ediciones disponibles aún
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Logo with Inheritance */}
            {(competition.logoUrl || competition.event?.logoUrl) && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex justify-center">
                  <img
                    src={normalizeImageUrl(competition.logoUrl || competition.event?.logoUrl)}
                    alt={`${competition.name} logo`}
                    className="max-h-32 w-auto object-contain"
                  />
                </div>
              </div>
            )}

            {/* Organizer */}
            {competition.event?.organizer && (
              <OrganizerCard organizer={competition.event.organizer} />
            )}

            {/* Map */}
            {competition.event?.latitude && competition.event?.longitude && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Ubicación
                </h3>
                <EventMap
                  event={{
                    id: competition.id,
                    name: competition.name,
                    city: competition.event.city,
                    country: competition.event.country,
                    latitude: competition.event.latitude,
                    longitude: competition.event.longitude,
                    categoryIcon: '🏃', // Icon for competition
                    type: competition.type,
                  }}
                  nearbyEvents={nearbyEvents}
                  nearbyServices={nearbyServices
                    .filter((s: any) => s.latitude && s.longitude)
                    .map((s: any) => ({
                      id: s.id,
                      name: s.name,
                      slug: s.slug,
                      city: s.city,
                      country: s.country,
                      latitude: s.latitude,
                      longitude: s.longitude,
                      categoryIcon: s.category?.icon || '🏪',
                    }))}
                />
                <div className="mt-4">
                  <a
                    href={`https://www.google.com/maps?q=${competition.event.latitude},${competition.event.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            )}

            {/* Base Information */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold">Base Information</h3>
              <div className="space-y-4">
                {/* Type */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Mountain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-semibold">{competition.type}</p>
                  </div>
                </div>

                {/* Distance */}
                {competition.baseDistance && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Base Distance</p>
                      <p className="font-semibold">{competition.baseDistance}km</p>
                    </div>
                  </div>
                )}

                {/* Elevation */}
                {competition.baseElevation && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                      <Mountain className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Base Elevation</p>
                      <p className="font-semibold">{competition.baseElevation}m D+</p>
                    </div>
                  </div>
                )}

                {/* Max Participants */}
                {competition.baseMaxParticipants && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Max Participants</p>
                      <p className="font-semibold">{competition.baseMaxParticipants}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Classification & Certifications */}
            {(competition.terrainType || competition.specialSeries || competition.itraPoints !== undefined || competition.utmbIndex) && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Clasificación
                </h3>
                <div className="space-y-4">
                  {/* Terrain Type */}
                  {competition.terrainType && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                        <Mountain className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tipo de Terreno</p>
                        <p className="font-semibold">{competition.terrainType.name}</p>
                      </div>
                    </div>
                  )}

                  {/* Special Series */}
                  {competition.specialSeries && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Serie Especial</p>
                        <Link
                          href={`/special-series/${competition.specialSeries.slug}`}
                          className="font-semibold hover:text-purple-600 transition-colors"
                        >
                          {competition.specialSeries.name}
                        </Link>
                      </div>
                      {competition.specialSeries.logoUrl && (
                        <img
                          src={normalizeImageUrl(competition.specialSeries.logoUrl)}
                          alt={competition.specialSeries.name}
                          className="h-8 w-8 object-contain"
                        />
                      )}
                    </div>
                  )}

                  {/* ITRA Points */}
                  {competition.itraPoints !== undefined && competition.itraPoints !== null && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Award className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Puntos ITRA</p>
                        <p className="font-semibold">{competition.itraPoints} {competition.itraPoints === 1 ? 'punto' : 'puntos'}</p>
                      </div>
                    </div>
                  )}

                  {/* UTMB Index */}
                  {competition.utmbIndex && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Índice UTMB</p>
                        <p className="font-semibold">
                          {competition.utmbIndex.replace('INDEX_', '')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Event Info */}
            {competition.event && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold">Event</h3>
                <Link
                  href={`/events/${competition.event.slug}`}
                  className="group block"
                >
                  <p className="font-medium group-hover:text-green-600 transition-colors">
                    {competition.event.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {competition.event.city}, {competition.event.country}
                  </p>
                </Link>
              </div>
            )}

            {/* Stats */}
            {competition._count && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold">Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Editions:</span>
                    <span className="font-semibold">{competition._count.editions || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Note about inheritance */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Individual editions may override these base values.
                Check the edition details for specific information.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <RelatedArticles competitionId={competition.id} title="Artículos sobre esta competición" className="mt-8" />

        {/* SEO FAQ Schema.org + Visible FAQ */}
        {seo && seo.llmFaq && seo.llmFaq.length > 0 && (
          <SEOFaqSchema faq={seo.llmFaq} visible={true} />
        )}
      </div>
    </div>
  );
}
