// app/events/[eventSlug]/[competitionSlug]/page.tsx - Competition detail page
// ⚠️ ESTE ES EL ARCHIVO CORRECTO PARA EL NIVEL [competitionSlug]

'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useCompetition } from '@/hooks/useCompetitions';
import { eventsService } from '@/lib/api/events.service';
import { seoService } from '@/lib/api/seo.service';
import servicesService from '@/lib/api/v2/services.service';
import { EditionSelector } from '@/components/EditionSelector';
import { Mountain, TrendingUp, Users, ArrowLeft, Calendar, MapPin, Info, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';
import EventMap from '@/components/EventMap';
import EventGallery from '@/components/EventGallery';
import OrganizerCard from '@/components/OrganizerCard';
import { RelatedArticles } from '@/components/RelatedArticles';
import { SEOFaqSchema } from '@/components/SEOFaqSchema';
import { normalizeImageUrl } from '@/lib/utils/imageUrl';
import Head from 'next/head';
import { AdminEditButtonFloating } from '@/components/AdminEditButton';
import { FavoriteButton } from '@/components/FavoriteButton';

export default function CompetitionDetailPage() {
  const params = useParams();
  const t = useTranslations('pgEvents');
  const tc = useTranslations('cmp');
  const competitionSlug = params?.competitionSlug as string;
  const eventSlug = params?.eventSlug as string;
  const locale = params?.locale as string; // ✅ Get current locale

  const { competition, loading, error } = useCompetition(competitionSlug, locale); // ✅ Pass locale
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
    const lat = competition?.event?.latitude;
    const lon = competition?.event?.longitude;
    if (lat != null && lon != null) {
      const fetchNearby = async () => {
        try {
          const events = await eventsService.getNearby(
            lat,
            lon,
            50 // 50km radius
          );
          setNearbyEvents(events);
        } catch (err) {
          console.error('Error loading nearby events:', err);
        }

        try {
          const services = await servicesService.getNearby(
            lat,
            lon,
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
          <h2 className="text-2xl font-bold text-red-900">{t('competitionNotFound')}</h2>
          <p className="mt-2 text-red-700">{error || t('competitionDoesNotExist')}</p>
          <Link
            href={`/events/${eventSlug}`}
            className="mt-4 inline-block rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            {t('backToEvent')}
          </Link>
        </div>
      </div>
    );
  }


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
                      {t('breadcrumbEvents')}
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
              <div className="flex items-center gap-3">
                {!competition.isActive && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                    {t('inactive')}
                  </span>
                )}
                <FavoriteButton
                  competitionId={competition.id}
                  size="lg"
                  showLabel={true}
                  className="bg-white/20 hover:bg-white/30"
                />
              </div>
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
                  <Info className="h-6 w-6 text-[#B66916]" />
                  {t('about')}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {competition.description}
                </p>
              </div>
            )}

            {/* Editions */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <Calendar className="h-6 w-6 text-[#B66916]" />
                {tc('editionsTitle')}
              </h2>
              <EditionSelector
                competitionId={competition.id}
                competitionName={competition.name}
              />
            </div>

            {/* Gallery */}
            {competition.gallery && competition.gallery.length > 0 && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <EventGallery
                  images={competition.gallery}
                  eventName={competition.name}
                />
              </div>
            )}
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
                  {t('location')}
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
                    type: 'event', // map marker kind (not the race type)
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
                    className="text-sm text-[#B66916] hover:underline flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    {t('viewOnGoogleMaps')}
                  </a>
                </div>
              </div>
            )}

            {/* Base Information */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold">{t('baseInformation')}</h3>
              <div className="space-y-4">
                {/* Type */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <Mountain className="h-5 w-5 text-[#B66916]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('type')}</p>
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
                      <p className="text-xs text-muted-foreground">{t('baseDistance')}</p>
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
                      <p className="text-xs text-muted-foreground">{t('baseElevation')}</p>
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
                      <p className="text-xs text-muted-foreground">{t('maxParticipants')}</p>
                      <p className="font-semibold">{competition.baseMaxParticipants}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Classification & Certifications */}
            {(competition.terrainType || (competition.specialSeries && competition.specialSeries.length > 0) || competition.itraPoints !== undefined || competition.utmbIndex) && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  {t('classification')}
                </h3>
                <div className="space-y-4">
                  {/* Terrain Type */}
                  {competition.terrainType && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                        <Mountain className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('terrainType')}</p>
                        <p className="font-semibold">{competition.terrainType.name}</p>
                      </div>
                    </div>
                  )}

                  {/* Special Series (many-to-many) */}
                  {competition.specialSeries && competition.specialSeries.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <p className="text-xs text-muted-foreground">
                          {competition.specialSeries.length === 1 ? t('specialSeries') : t('specialSeriesPlural')}
                        </p>
                      </div>
                      {competition.specialSeries.map((series: any) => (
                        <div key={series.id} className="flex items-center gap-3 pl-6">
                          <div className="flex-1">
                            <Link
                              href={`/special-series/${series.slug}`}
                              className="font-semibold hover:text-[#B66916] transition-colors"
                            >
                              {series.name}
                            </Link>
                          </div>
                          {series.logoUrl && (
                            <img
                              src={normalizeImageUrl(series.logoUrl)}
                              alt={series.name}
                              className="h-8 w-8 object-contain"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ITRA Points */}
                  {competition.itraPoints !== undefined && competition.itraPoints !== null && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                        <Award className="h-5 w-5 text-[#B66916]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('itraPoints')}</p>
                        <p className="font-semibold">{t('itraPointsValue', { count: competition.itraPoints })}</p>
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
                        <p className="text-xs text-muted-foreground">{t('utmbIndex')}</p>
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
                <h3 className="mb-4 font-semibold">{t('event')}</h3>
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
                <h3 className="mb-4 font-semibold">{t('statistics')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('totalEditions')}</span>
                    <span className="font-semibold">{competition._count.editions || 0}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Related Articles */}
        <RelatedArticles competitionId={competition.id} title={t('articlesAboutCompetition')} className="mt-8" />

        {/* SEO FAQ Schema.org + Visible FAQ */}
        {seo && seo.llmFaq && seo.llmFaq.length > 0 && (
          <SEOFaqSchema faq={seo.llmFaq} visible={true} />
        )}
      </div>

      {/* Admin Edit Button (floating) */}
      <AdminEditButtonFloating
        editUrl={`/organizer/competitions/edit/${competition.id}`}
        label={t('editCompetition')}
      />
    </div>
  );
}
