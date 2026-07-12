/**
 * 🔧 app/events/[eventSlug]/page.tsx - VERSIÓN CON REDES SOCIALES
 * ======================================================
 * ✅ Logo destacado en sidebar
 * ✅ Mapa interactivo con Leaflet
 * ✅ Eventos cercanos en el mapa
 * ✅ Redes sociales completas (Instagram, Facebook, Twitter, YouTube)
 */

import { getTranslations } from 'next-intl/server';
import { eventsService } from '@/lib/api/events.service';
import { seoService } from '@/lib/api/seo.service';
import servicesService from '@/lib/api/v2/services.service';
import { Event } from '@/types/event';
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
import { AdminEditButtonFloating } from '@/components/AdminEditButton';
import { SaveEventButton } from '@/components/events/SaveEventButton';

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
  const t = await getTranslations('pgEvents');

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

  const yearsOfHistory = event.firstEditionYear
    ? 2026 - event.firstEditionYear + 1
    : null;

  return (
    <div className="min-h-screen">
      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <div className="relative h-[420px] bg-ink">
        {(event.coverImage || event.coverImageUrl) ? (
          <img
            src={normalizeImageUrl(event.coverImage || event.coverImageUrl)}
            alt={event.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="ww-topo absolute inset-0 opacity-70" aria-hidden />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(15,19,21,.25) 30%, rgba(15,19,21,.9))' }}
        />

        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-content px-6 pb-9 sm:px-8 lg:px-10">
            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-[13px] text-white/70">
              <Link href="/events" className="hover:text-white">{t('breadcrumbEvents')}</Link>
              <span>/</span>
              <span className="font-semibold text-white">{event.name}</span>
            </nav>

            {event.featured && (
              <span
                className="mb-3 inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-[12px] font-extrabold uppercase tracking-wide text-white"
                style={{ backgroundColor: '#f0a05a' }}
              >
                <Trophy className="h-3.5 w-3.5" /> Featured
              </span>
            )}

            <h1 className="max-w-4xl text-[36px] font-black leading-[1.02] tracking-[-0.03em] text-white sm:text-[52px]">
              {event.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] font-semibold text-white/85">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {event.city}, {event.country}
              </span>
              {event.typicalMonth && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {getMonthName(event.typicalMonth)}
                </span>
              )}
              {event._count?.competitions ? (
                <span className="flex items-center gap-1.5">
                  <Trophy className="h-4 w-4" /> {t('competitionsCount', { count: event._count.competitions })}
                </span>
              ) : null}
              {yearsOfHistory && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {t('yearsOfHistory', { count: yearsOfHistory })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_380px]">
          {/* ============================================================ */}
          {/* 📄 COLUMNA PRINCIPAL - Información detallada */}
          {/* ============================================================ */}
          <div className="space-y-6">
            
            {/* Descripción */}
            {event.description && (
              <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
                <h2 className="mb-4 text-[22px] font-black tracking-[-0.01em] text-ink-2">{t('aboutEvent')}</h2>
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
              <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
                <h2 className="mb-4 flex items-center gap-2 text-[22px] font-black tracking-[-0.01em] text-ink-2">
                  <Trophy className="h-5 w-5 text-green-brand" />
                  {t('competitionsWithCount', { count: event.competitions.length })}
                </h2>
                <div className="space-y-3">
                  {event.competitions.map((competition) => (
                    <Link
                      key={competition.id}
                      href={`/events/${event.slug}/${competition.slug}`}
                      className="flex items-center gap-4 rounded-md border border-border p-3 transition-colors hover:border-green-brand hover:bg-[#fbfdfb]"
                    >
                      {/* km chip */}
                      <div className="flex h-14 w-16 shrink-0 flex-col items-center justify-center rounded-sm bg-surface-alt">
                        <span className="font-stat text-[22px] font-bold leading-none text-ink-2">
                          {competition.baseDistance ?? '—'}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-text-faint">
                          km
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[16px] font-extrabold text-ink-2">{competition.name}</h3>
                        <p className="text-[13px] text-text-muted">
                          {competition._count?.editions && competition._count.editions > 0
                            ? t('editionsCount', { count: competition._count.editions })
                            : t('noEditionsYet')}
                        </p>
                      </div>
                      <span className="text-green-brand">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Información Detallada */}
            <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
              <h2 className="mb-4 text-[22px] font-black tracking-[-0.01em] text-ink-2">{t('detailedInfo')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label={t('country')} value={event.country} />
                <InfoRow label={t('city')} value={event.city} />

                {event.firstEditionYear && (
                  <InfoRow label={t('firstEdition')} value={event.firstEditionYear.toString()} />
                )}

                {event.organizer && (
                  <InfoRow
                    label={t('organizer')}
                    value={event.organizer.name}
                  />
                )}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SIDEBAR (sticky) */}
          {/* ============================================================ */}
          <aside className="space-y-6 lg:sticky lg:top-[88px]">

            {/* CTA: guardar evento */}
            <SaveEventButton eventId={event.id} />

            {/* ✅ LOGO DEL EVENTO */}
            {(event.logo || event.logoUrl) && (
              <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
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
              <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
                <h3 className="mb-4 flex items-center gap-2 text-[16px] font-black text-ink-2">
                  <MapPin className="h-5 w-5 text-green-brand" />
                  {t('location')}
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
                    className="text-sm text-green-brand hover:underline flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    {t('viewOnGoogleMaps')}
                  </a>
                </div>
              </div>
            )}
            
            {/* Estadísticas */}
            <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
              <h3 className="mb-4 text-[16px] font-black text-ink-2">{t('statistics')}</h3>
              <div className="space-y-3">
                <StatItem
                  icon={<Eye className="h-5 w-5 text-gray-500" />}
                  label={t('views')}
                  value={event.viewCount.toLocaleString()}
                />
                {event._count?.competitions && (
                  <StatItem
                    icon={<Trophy className="h-5 w-5 text-gray-500" />}
                    label={t('competitions')}
                    value={event._count.competitions.toString()}
                  />
                )}
                {event.firstEditionYear && (
                  <StatItem
                    icon={<Clock className="h-5 w-5 text-gray-500" />}
                    label={t('yearsOfHistoryLabel')}
                    value={(new Date().getFullYear() - event.firstEditionYear + 1).toString()}
                  />
                )}
              </div>
            </div>

            {/* ✅ CONTACTO Y REDES SOCIALES - ACTUALIZADO */}
            <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
              <h3 className="mb-4 text-[16px] font-black text-ink-2">{t('contactAndSocial')}</h3>
              <div className="space-y-3">
                {/* Sitio Web */}
                {event.website && (
                  <ContactLink
                    href={event.website}
                    icon={<Globe className="h-5 w-5" />}
                    label={t('website')}
                    color="text-green-brand"
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
                      {t('socialNetworks')}
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

            {/* Eventos Similares */}
            {nearbyEvents && nearbyEvents.length > 0 && (
              <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
                <h3 className="mb-4 text-[16px] font-black text-ink-2">
                  {t('nearbyEvents', { count: nearbyEvents.length })}
                </h3>
                <div className="space-y-2">
                  {nearbyEvents.slice(0, 3).map((nearbyEvent) => (
                    <Link
                      key={nearbyEvent.id}
                      href={`/events/${nearbyEvent.slug}`}
                      className="block text-sm text-green-brand hover:text-green hover:underline"
                    >
                      → {nearbyEvent.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Related Articles */}
        <RelatedArticles eventId={event.id} title={t('articlesAboutEvent')} className="mt-8" />

        {/* SEO FAQ Schema.org + Visible FAQ */}
        {seo && seo.llmFaq && seo.llmFaq.length > 0 && (
          <SEOFaqSchema faq={seo.llmFaq} visible={true} />
        )}
      </div>

      {/* Admin Edit Button (floating) */}
      <AdminEditButtonFloating
        editUrl={`/organizer/events/edit/${event.id}`}
        label={t('editEvent')}
      />
    </div>
  );
}

// ============================================================================
// 🧩 COMPONENTES AUXILIARES
// ============================================================================

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface-alt p-3">
      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-text-faint">
        {label}
      </div>
      <div className="mt-0.5 text-[15px] font-semibold text-ink-2">{value}</div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-text-muted">
        {icon}
        <span className="text-[14px]">{label}</span>
      </div>
      <span className="font-stat text-[20px] font-bold text-ink-2">{value}</span>
    </div>
  );
}

function ContactLink({
  href,
  icon,
  label,
  color = "text-green-brand"
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
      className="group flex items-center gap-3 text-text-muted transition-colors hover:text-green-brand"
    >
      <div className={`${color} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <span className="text-[14px] group-hover:underline">{label}</span>
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
