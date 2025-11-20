// app/editions/[slug]/page.tsx - Public edition detail page

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Mountain, TrendingUp, Users, Clock, Award, Sparkles } from 'lucide-react';
import editionsService from '@/lib/api/v2/editions.service';
import { eventsService } from '@/lib/api/events.service';
import servicesService from '@/lib/api/v2/services.service';
import EditionDetailTabs from '@/components/EditionDetailTabs';
import EventGallery from '@/components/EventGallery';
import EventMap from '@/components/EventMap';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Event } from '@/types/api';
import { Service } from '@/types/v2';

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const editionWithDetails = await editionsService.getBySlugWithInheritance(params.slug);

    return {
      title: `${editionWithDetails.competition.name} ${editionWithDetails.year} | WWTRAIL`,
      description: editionWithDetails.chronicle || `Edition ${editionWithDetails.year} of ${editionWithDetails.competition.name}`,
    };
  } catch (error) {
    return {
      title: 'Edition Not Found | WWTRAIL',
    };
  }
}

// ============================================================================
// PAGE
// ============================================================================

export default async function EditionDetailPage({
  params
}: {
  params: { slug: string }
}) {
  let editionWithDetails;
  let nearbyEvents: Event[] = [];
  let nearbyServices: Service[] = [];

  try {
    editionWithDetails = await editionsService.getBySlugWithInheritance(params.slug);

    // Fetch nearby events and services if coordinates are available
    if (editionWithDetails.event.latitude && editionWithDetails.event.longitude) {
      try {
        nearbyEvents = await eventsService.getNearby(
          editionWithDetails.event.latitude,
          editionWithDetails.event.longitude,
          50 // 50km radius
        );
      } catch (error) {
        console.error('Error loading nearby events:', error);
      }

      try {
        nearbyServices = await servicesService.getNearby(
          editionWithDetails.event.latitude,
          editionWithDetails.event.longitude,
          50 // 50km radius
        );
      } catch (error) {
        console.error('Error loading nearby services:', error);
      }
    }
  } catch (error) {
    console.error('Error loading edition:', error);
    notFound();
  }

  const { competition, event } = editionWithDetails;
  const edition = editionWithDetails; // For backwards compatibility with existing code

  // Helper to format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'PP', { locale: es });
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cover Image */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-green-600">
        {edition.coverImage && (
          <img
            src={edition.coverImage}
            alt={`${competition.name} ${edition.year}`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 container mx-auto px-4 py-12 flex flex-col justify-end text-white">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-white/80">
              <Link href="/events" className="hover:text-white transition-colors">
                Eventos
              </Link>
              <span>/</span>
              <Link
                href={`/events/${event.slug}`}
                className="hover:text-white transition-colors"
              >
                {event.name}
              </Link>
              <span>/</span>
              <Link
                href={`/events/${event.slug}/${competition.slug}`}
                className="hover:text-white transition-colors"
              >
                {competition.name}
              </Link>
              <span>/</span>
              <span className="text-white font-semibold">{edition.year}</span>
            </nav>
          </div>

          {/* Title */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {competition.name}
              </h1>
              <div className="text-xl md:text-2xl font-semibold text-white/90">
                Edición {edition.year}
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{editionWithDetails.resolvedCity}, {event.country}</span>
                </div>
                {edition.specificDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{formatDate(edition.specificDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="ml-4">
              <StatusBadge status={edition.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<TrendingUp className="h-5 w-5" />}
                label="Distancia"
                value={`${editionWithDetails.resolvedDistance} km`}
              />
              <StatCard
                icon={<Mountain className="h-5 w-5" />}
                label="Desnivel"
                value={`${editionWithDetails.resolvedElevation} m D+`}
              />
              <StatCard
                icon={<Users className="h-5 w-5" />}
                label="Participantes"
                value={`${edition.currentParticipants}/${editionWithDetails.resolvedMaxParticipants}`}
              />
              {edition.avgRating && (
                <StatCard
                  icon={<span className="text-xl">⭐</span>}
                  label="Valoración"
                  value={`${edition.avgRating.toFixed(1)}/4`}
                />
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow p-6">
              <EditionDetailTabs edition={edition} />
            </div>

            {/* Gallery */}
            {edition.gallery && edition.gallery.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <EventGallery
                  images={edition.gallery}
                  eventName={`${competition.name} ${edition.year}`}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Logo with Inheritance */}
            {(competition.logoUrl || event.logoUrl) && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-center">
                  <img
                    src={competition.logoUrl || event.logoUrl}
                    alt={`${competition.name} logo`}
                    className="max-h-32 w-auto object-contain"
                  />
                </div>
              </div>
            )}

            {/* Map */}
            {event.latitude && event.longitude && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Ubicación
                </h3>
                <EventMap
                  event={{
                    id: edition.id,
                    name: `${competition.name} ${edition.year}`,
                    city: event.city,
                    country: event.country,
                    latitude: event.latitude,
                    longitude: event.longitude,
                    categoryIcon: '🏃', // Icon for edition
                    type: competition.type,
                  }}
                  nearbyEvents={nearbyEvents}
                  nearbyServices={nearbyServices
                    .filter(s => s.latitude && s.longitude)
                    .map(s => ({
                      id: s.id,
                      name: s.name,
                      slug: s.slug,
                      city: s.city,
                      country: s.country,
                      latitude: s.latitude!,
                      longitude: s.longitude!,
                      categoryIcon: s.category?.icon || '🏪',
                    } as any))}
                />
                <div className="mt-4">
                  <a
                    href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
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

            {/* Classification & Certifications (from Competition) */}
            {(competition.terrainType || competition.specialSeries || competition.itraPoints !== undefined || competition.utmbIndex) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Clasificación
                </h3>
                <div className="space-y-4 text-sm">
                  {/* Terrain Type */}
                  {competition.terrainType && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                        <Mountain className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tipo de Terreno</p>
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
                        <p className="text-xs text-gray-500">Serie Especial</p>
                        <Link
                          href={`/special-series/${competition.specialSeries.slug}`}
                          className="font-semibold hover:text-purple-600 transition-colors"
                        >
                          {competition.specialSeries.name}
                        </Link>
                      </div>
                      {competition.specialSeries.logoUrl && (
                        <img
                          src={competition.specialSeries.logoUrl}
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
                        <p className="text-xs text-gray-500">Puntos ITRA</p>
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
                        <p className="text-xs text-gray-500">Índice UTMB</p>
                        <p className="font-semibold">
                          {competition.utmbIndex.replace('INDEX_', '')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Registration Info */}
            {edition.registrationUrl && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4">Inscripción</h3>
                <div className="space-y-3">
                  {edition.registrationOpenDate && (
                    <InfoRow
                      label="Apertura"
                      value={formatDate(edition.registrationOpenDate) || '-'}
                    />
                  )}
                  {edition.registrationCloseDate && (
                    <InfoRow
                      label="Cierre"
                      value={formatDate(edition.registrationCloseDate) || '-'}
                    />
                  )}

                  {/* Prices */}
                  {edition.prices && (edition.prices.early || edition.prices.normal || edition.prices.late) && (
                    <>
                      <div className="border-t pt-3 mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Precios:</p>
                        <div className="space-y-1">
                          {edition.prices.early && (
                            <InfoRow label="Early Bird" value={`${edition.prices.early}€`} />
                          )}
                          {edition.prices.normal && (
                            <InfoRow label="Normal" value={`${edition.prices.normal}€`} />
                          )}
                          {edition.prices.late && (
                            <InfoRow label="Tardío" value={`${edition.prices.late}€`} />
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-3">
                    <RegistrationStatusBadge status={edition.registrationStatus} />
                  </div>
                  <a
                    href={edition.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Inscribirme
                  </a>
                </div>
              </div>
            )}

            {/* Results */}
            {edition.resultsUrl && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4">Resultados</h3>
                <a
                  href={edition.resultsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Ver Resultados
                </a>
              </div>
            )}

            {/* Event Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-4">Evento</h3>
              <Link
                href={`/events/${event.slug}`}
                className="group block"
              >
                <p className="font-medium group-hover:text-blue-600 transition-colors">
                  {event.name}
                </p>
                <p className="text-sm text-gray-600">
                  {event.city}, {event.country}
                </p>
              </Link>
            </div>

            {/* Competition Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-4">Competición</h3>
              <Link
                href={`/events/${event.slug}/${competition.slug}`}
                className="group block"
              >
                <p className="font-medium group-hover:text-blue-600 transition-colors">
                  {competition.name}
                </p>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <p>Tipo: {competition.type}</p>
                  {competition.baseDistance && (
                    <p>Distancia base: {competition.baseDistance} km</p>
                  )}
                  {competition.baseElevation && (
                    <p>Desnivel base: {competition.baseElevation} m D+</p>
                  )}
                </div>
              </Link>
            </div>

            {/* Other Editions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-4">Otras Ediciones</h3>
              <Link
                href={`/events/${event.slug}/${competition.slug}`}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Ver todas las ediciones →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function StatCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2 text-gray-500 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    UPCOMING: 'bg-blue-100 text-blue-800',
    ONGOING: 'bg-green-100 text-green-800',
    FINISHED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  const labels = {
    UPCOMING: 'Próxima',
    ONGOING: 'En Curso',
    FINISHED: 'Finalizada',
    CANCELLED: 'Cancelada',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}

function RegistrationStatusBadge({ status }: { status: string }) {
  const styles = {
    NOT_OPEN: 'bg-gray-100 text-gray-800',
    COMING_SOON: 'bg-blue-100 text-blue-800',
    OPEN: 'bg-green-100 text-green-800',
    CLOSED: 'bg-red-100 text-red-800',
    FULL: 'bg-orange-100 text-orange-800',
  };

  const labels = {
    NOT_OPEN: 'No Abierta',
    COMING_SOON: 'Próximamente',
    OPEN: 'Abierta',
    CLOSED: 'Cerrada',
    FULL: 'Completa',
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels] || status}
    </div>
  );
}
