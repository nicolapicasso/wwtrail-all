/**
 * 🔧 app/events/[eventSlug]/page.tsx - VERSIÓN CON REDES SOCIALES
 * ======================================================
 * ✅ Logo destacado en sidebar
 * ✅ Mapa interactivo con Leaflet
 * ✅ Eventos cercanos en el mapa
 * ✅ Redes sociales completas (Instagram, Facebook, Twitter, YouTube)
 */

import { eventsService } from '@/lib/api/events.service';
import { seoService } from '@/lib/api/seo.service';
import servicesService from '@/lib/api/v2/services.service';
import { Event } from '@/types/api';
import { Service } from '@/types/v2';
import { 
  MapPin, Calendar, Globe, Mail, Phone, Facebook, Instagram, Twitter, Youtube,
  Trophy, Eye, Clock, Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import EventMap from '@/components/EventMap';
import EventGallery from '@/components/EventGallery';
import OrganizerCard from '@/components/OrganizerCard';
import { RelatedArticles } from '@/components/RelatedArticles';
import { SEOFaqSchema } from '@/components/SEOFaqSchema';
import { normalizeImageUrl } from '@/lib/utils/imageUrl';

// ============================================================================
// 📋 METADATA
// ============================================================================

export async function generateMetadata({ params }: { params: { locale: string; eventSlug: string } }) {
  try {
    const event = await eventsService.getBySlug(params.eventSlug);

    // Get SEO data if available (in current language)
    let seo = null;
    try {
      seo = await seoService.getSEO('event', event.id, params.locale);
    } catch (error) {
      // SEO not found, use fallback
    }

    // Get translated content if available
    const translation = event.translations?.find((t: any) => t.language === params.locale.toUpperCase());
    const name = translation?.name || event.name;
    const description = translation?.description || event.description;

    // Use SEO metadata if available, otherwise fallback to event data
    const title = seo?.metaTitle || `${name} | WWTRAIL`;
    const metaDescription = seo?.metaDescription || description || `Trail running event in ${event.city}, ${event.country}`;

    return {
      title,
      description: metaDescription,
      openGraph: {
        title,
        description: metaDescription,
        images: event.coverImage ? [event.coverImage] : [],
      }
    };
  } catch (error) {
    return {
      title: 'Event Not Found | WWTRAIL',
    };
  }
}

// ============================================================================
// 🎨 PÁGINA PRINCIPAL
// ============================================================================

export default async function EventDetailPage({
  params
}: {
  params: { locale: string; eventSlug: string }
}) {
  let event: Event;
  let nearbyEvents: Event[] = [];
  let nearbyServices: Service[] = [];
  let seo: any = null;

  try {
    event = await eventsService.getBySlug(params.eventSlug);

    // Get SEO data if available (in current language)
    try {
      seo = await seoService.getSEO('event', event.id, params.locale);
    } catch (error) {
      // SEO not found, continue without it
    }

    // Get translated content if available
    const translation = (event as any).translations?.find((t: any) => t.language === params.locale.toUpperCase());
    if (translation) {
      event.name = translation.name || event.name;
      event.description = translation.description || event.description;
    }

    // ✅ Obtener eventos y servicios cercanos para el mapa
    if (event.latitude && event.longitude) {
      try {
        nearbyEvents = await eventsService.getNearby(
          event.latitude,
          event.longitude,
          50 // 50km radius
        );
        // Filtrar el evento actual
        nearbyEvents = nearbyEvents.filter(e => e.id !== event.id);
      } catch (error) {
        console.error('Error loading nearby events:', error);
      }

      try {
        nearbyServices = await servicesService.getNearby(
          event.latitude,
          event.longitude,
          50 // 50km radius
        );
      } catch (error) {
        console.error('Error loading nearby services:', error);
      }
    }
  } catch (error) {
    console.error('Error loading event:', error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============================================================ */}
      {/* 🖼️ HERO SECTION CON COVER IMAGE */}
      {/* ============================================================ */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-green-600">
        {(event.coverImage || event.coverImageUrl) ? (
          <img
            src={normalizeImageUrl(event.coverImage || event.coverImageUrl)}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : null}
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
                    <span className="text-white font-semibold">{event.name}</span>
                  </nav>
                </div>

                {event.featured && (
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                      <Trophy className="h-4 w-4 fill-white" />
                      Featured
                    </span>
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {event.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{event.city}, {event.country}</span>
                  </div>
                  {event.typicalMonth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span>{getMonthName(event.typicalMonth)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ============================================================ */}
          {/* 📄 COLUMNA PRINCIPAL - Información detallada */}
          {/* ============================================================ */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Descripción */}
            {event.description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Sobre el Evento</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

           {/* Galería */}
<EventGallery 
  images={event.gallery || []} 
  eventName={event.name}
/>
            {/* Competiciones del Evento */}
            {event.competitions && event.competitions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-green-600" />
                  Competiciones ({event.competitions.length})
                </h2>
                <div className="space-y-3">
                  {event.competitions.map((competition) => (
                    <Link
                      key={competition.id}
                      href={`/events/${event.slug}/${competition.slug}`}
                      className="block p-4 border rounded-lg hover:border-green-600 hover:bg-green-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{competition.name}</h3>
                          <p className="text-sm text-gray-600">
                            {competition._count?.editions && competition._count.editions > 0
                              ? `${competition._count.editions} ediciones`
                              : 'Aún sin ediciones creadas'}
                          </p>
                        </div>
                        <span className="text-green-600 font-semibold">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Información Detallada */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Información Detallada</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="País" value={event.country} />
                <InfoRow label="Ciudad" value={event.city} />
                {event.region && <InfoRow label="Región" value={event.region} />}
                
                {event.type && (
                  <div className="flex items-start gap-3">
                    <div className="font-semibold text-gray-700 w-32">Tipo:</div>
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {event.type}
                      </span>
                    </div>
                  </div>
                )}
                
                {event.firstEditionYear && (
                  <InfoRow label="Primera Edición" value={event.firstEditionYear.toString()} />
                )}
                
                {event.organizer && (
                  <InfoRow 
                    label="Organizador" 
                    value={`${event.organizer.firstName || ''} ${event.organizer.lastName || ''}`.trim() || event.organizer.username}
                  />
                )}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 📊 SIDEBAR DERECHO - Logo, Mapa, Contacto */}
          {/* ============================================================ */}
          <div className="space-y-6">
            
            {/* ✅ LOGO DEL EVENTO */}
            {(event.logo || event.logoUrl) && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-center">
                  <img
                    src={normalizeImageUrl(event.logo || event.logoUrl)}
                    alt={`${event.name} logo`}
                    className="max-h-32 w-auto object-contain"
                  />
                </div>
              </div>
            )}

            {/* ✅ ORGANIZADOR */}
            {event.organizer && (
              <OrganizerCard organizer={event.organizer} />
            )}

            {/* ✅ MAPA INTERACTIVO */}
            {event.latitude && event.longitude && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Ubicación
                </h3>
                <EventMap
                  event={event}
                  nearbyEvents={[
                    // Incluir competiciones del evento como pines (mismas coordenadas, se distribuirán en círculo)
                    ...(event.competitions || []).map(comp => ({
                      id: comp.id,
                      name: comp.name,
                      slug: `${event.slug}/${comp.slug}`,
                      city: event.city,
                      country: event.country,
                      latitude: event.latitude!,
                      longitude: event.longitude!,
                      categoryIcon: '🏆',
                      type: 'competition',
                    } as any)),
                    // Eventos cercanos (de otros eventos)
                    ...nearbyEvents,
                  ]}
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
            
            {/* Estadísticas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <StatItem
                  icon={<Eye className="h-5 w-5 text-gray-500" />}
                  label="Visualizaciones"
                  value={event.viewCount.toLocaleString()}
                />
                {event._count?.competitions && (
                  <StatItem
                    icon={<Trophy className="h-5 w-5 text-gray-500" />}
                    label="Competiciones"
                    value={event._count.competitions.toString()}
                  />
                )}
                {event.firstEditionYear && (
                  <StatItem
                    icon={<Clock className="h-5 w-5 text-gray-500" />}
                    label="Años de historia"
                    value={(new Date().getFullYear() - event.firstEditionYear + 1).toString()}
                  />
                )}
              </div>
            </div>

            {/* ✅ CONTACTO Y REDES SOCIALES - ACTUALIZADO */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-4">Contacto y Redes</h3>
              <div className="space-y-3">
                {/* Sitio Web */}
                {event.website && (
                  <ContactLink
                    href={event.website}
                    icon={<Globe className="h-5 w-5" />}
                    label="Sitio Web"
                    color="text-blue-600"
                  />
                )}
                
                {/* Email */}
                {event.email && (
                  <ContactLink
                    href={`mailto:${event.email}`}
                    icon={<Mail className="h-5 w-5" />}
                    label={event.email}
                    color="text-gray-600"
                  />
                )}
                
                {/* Teléfono */}
                {event.phone && (
                  <ContactLink
                    href={`tel:${event.phone}`}
                    icon={<Phone className="h-5 w-5" />}
                    label={event.phone}
                    color="text-gray-600"
                  />
                )}

                {/* Separador visual si hay redes sociales */}
                {(event.instagramUrl || event.facebookUrl || event.twitterUrl || event.youtubeUrl) && (
                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                      Redes Sociales
                    </p>
                  </div>
                )}
                
                {/* Instagram */}
                {event.instagramUrl && (
                  <ContactLink
                    href={event.instagramUrl}
                    icon={<Instagram className="h-5 w-5" />}
                    label="Instagram"
                    color="text-pink-600"
                  />
                )}
                
                {/* Facebook */}
                {event.facebookUrl && (
                  <ContactLink
                    href={event.facebookUrl}
                    icon={<Facebook className="h-5 w-5" />}
                    label="Facebook"
                    color="text-blue-700"
                  />
                )}

                {/* Twitter */}
                {event.twitterUrl && (
                  <ContactLink
                    href={event.twitterUrl}
                    icon={<Twitter className="h-5 w-5" />}
                    label="Twitter"
                    color="text-sky-500"
                  />
                )}

                {/* YouTube */}
                {event.youtubeUrl && (
                  <ContactLink
                    href={event.youtubeUrl}
                    icon={<Youtube className="h-5 w-5" />}
                    label="YouTube"
                    color="text-red-600"
                  />
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-2">¿Interesado?</h3>
              <p className="text-sm mb-4 text-white/90">
                Guarda este evento en tus favoritos
              </p>
              <button className="w-full bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Guardar Evento
              </button>
            </div>

            {/* Eventos Similares */}
            {nearbyEvents && nearbyEvents.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4">
                  Eventos Cercanos ({nearbyEvents.length})
                </h3>
                <div className="space-y-2">
                  {nearbyEvents.slice(0, 3).map((nearbyEvent) => (
                    <Link
                      key={nearbyEvent.id}
                      href={`/events/${nearbyEvent.slug}`}
                      className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      → {nearbyEvent.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Articles */}
        <RelatedArticles eventId={event.id} title="Artículos sobre este evento" className="mt-8" />

        {/* SEO FAQ Schema.org + Visible FAQ */}
        {seo && seo.llmFaq && seo.llmFaq.length > 0 && (
          <SEOFaqSchema faq={seo.llmFaq} visible={true} />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 🧩 COMPONENTES AUXILIARES
// ============================================================================

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="font-semibold text-gray-700 w-32">{label}:</div>
      <div className="flex-1 text-gray-900">{value}</div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-600">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}

function ContactLink({ 
  href, 
  icon, 
  label, 
  color = "text-green-600" 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string;
  color?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors group"
    >
      <div className={`${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-sm group-hover:underline">{label}</span>
    </a>
  );
}

// ============================================================================
// 🛠️ UTILIDADES
// ============================================================================

function getMonthName(month: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month - 1] || 'Desconocido';
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    ES: 'Español',
    EN: 'English',
    IT: 'Italiano',
    CA: 'Català',
    FR: 'Français',
    DE: 'Deutsch'
  };
  return languages[code] || code;
}
