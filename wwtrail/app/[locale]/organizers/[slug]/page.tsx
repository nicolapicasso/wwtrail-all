// app/organizers/[slug]/page.tsx - Organizer detail page

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { organizersService } from '@/lib/api/v2';
import { Organizer } from '@/types/v2';
import {
  Building2, Globe, MapPin, ArrowLeft, Loader2,
  Instagram, Facebook, Twitter, Youtube, Calendar, Trophy
} from 'lucide-react';
import { normalizeImageUrl } from '@/lib/utils/imageUrl';

export default function OrganizerDetailPage() {
  const params = useParams();
  const t = useTranslations('pgCatalog');
  const slug = params?.slug as string;

  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizer = async () => {
      try {
        setLoading(true);
        const data = await organizersService.getBySlug(slug);
        setOrganizer(data);
      } catch (err: any) {
        console.error('Error fetching organizer:', err);
        setError(err.message || 'Error loading organizer');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchOrganizer();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-brand mx-auto mb-4" />
          <p className="text-text-muted">{t('loadingOrganizer')}</p>
        </div>
      </div>
    );
  }

  if (error || !organizer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('organizerNotFound')}</h2>
          <p className="text-text-muted mb-4">{error || t('organizerDoesNotExist')}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-brand hover:text-green-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div
        className="relative overflow-hidden py-16"
        style={{ background: 'linear-gradient(105deg, #173f6e 0%, #1f7a4d 100%)' }}
      >
        <div className="ww-topo--light absolute inset-0 opacity-60" aria-hidden />
        <div className="relative z-10 mx-auto max-w-content px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            {/* Avatar (logo or initials) */}
            <div className="shrink-0">
              {organizer.logoUrl ? (
                <div className="relative h-[132px] w-[132px] overflow-hidden rounded-full border-4 border-white/80 bg-surface shadow-floating">
                  <Image
                    src={normalizeImageUrl(organizer.logoUrl)}
                    alt={`${organizer.name} logo`}
                    fill
                    className="object-contain p-3"
                  />
                </div>
              ) : (
                <span className="flex h-[132px] w-[132px] items-center justify-center rounded-full border-4 border-white/80 bg-white/15 font-stat text-[48px] font-bold text-white">
                  {(organizer.name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-pill bg-white/15 px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-white">
                <Building2 className="h-3.5 w-3.5" /> {t('organizerBadge')}
              </span>
              <h1 className="text-[36px] font-black leading-[1.02] tracking-[-0.03em] text-white sm:text-[48px]">
                {organizer.name}
              </h1>
              <div className="mt-2 flex items-center justify-center gap-2 text-[14px] font-semibold text-white/85 md:justify-start">
                <MapPin className="h-4 w-4" />
                <span>{organizer.country}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-content px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_360px]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Description */}
            {organizer.description && (
              <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
                <h2 className="mb-4 text-[22px] font-black tracking-[-0.01em] text-ink-2">{t('aboutOrganizer')}</h2>
                <p className="text-text-muted leading-relaxed whitespace-pre-wrap">
                  {organizer.description}
                </p>
              </div>
            )}

            {/* Events */}
            {organizer.events && organizer.events.length > 0 && (
              <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
                <h2 className="mb-4 flex items-center gap-2 text-[22px] font-black tracking-[-0.01em] text-ink-2">
                  <Calendar className="h-6 w-6 text-green-brand" />
                  {t('organizedEvents', { count: organizer.events.length })}
                </h2>

                <div className="space-y-6">
                  {organizer.events.map((event) => (
                    <div key={event.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                      <Link
                        href={`/events/${event.slug}`}
                        className="group block mb-3"
                      >
                        <div className="flex items-start gap-4">
                          {event.logoUrl && (
                            <div className="flex-shrink-0">
                              <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                <Image
                                  src={normalizeImageUrl(event.logoUrl)}
                                  alt={event.name}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-brand transition-colors">
                              {event.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                              <MapPin className="h-4 w-4" />
                              {event.city}, {event.country}
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Competitions */}
                      {event.competitions && event.competitions.length > 0 && (
                        <div className="ml-20 mt-3 space-y-2">
                          <p className="text-sm font-medium text-text-muted flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-green-600" />
                            {t('competitionsCount', { count: event.competitions.length })}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {event.competitions.map((competition) => (
                              <Link
                                key={competition.id}
                                href={`/events/${event.slug}/${competition.slug}`}
                                className="text-sm text-text-muted hover:text-green-brand transition-colors flex items-center gap-2 p-2 rounded hover:bg-[#fbfdfb]"
                              >
                                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-text-muted font-medium">
                                  {competition.type}
                                </span>
                                <span>{competition.name}</span>
                                {competition.baseDistance && (
                                  <span className="text-xs text-text-faint">
                                    ({competition.baseDistance}km)
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No events message */}
            {(!organizer.events || organizer.events.length === 0) && (
              <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-text-muted">
                  {t('noPublishedEvents')}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-[130px]">
            {/* Contact & Social Media */}
            <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
              <h3 className="mb-4 text-[16px] font-black text-ink-2">{t('contactAndSocial')}</h3>
              <div className="space-y-3">
                {/* Website */}
                {organizer.website && (
                  <a
                    href={organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-text-muted hover:text-green-brand transition-colors"
                  >
                    <Globe className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm truncate">{t('website')}</span>
                  </a>
                )}

                {/* Instagram */}
                {organizer.instagramUrl && (
                  <a
                    href={organizer.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-text-muted hover:text-pink-600 transition-colors"
                  >
                    <Instagram className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm truncate">Instagram</span>
                  </a>
                )}

                {/* Facebook */}
                {organizer.facebookUrl && (
                  <a
                    href={organizer.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-text-muted hover:text-green-brand transition-colors"
                  >
                    <Facebook className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm truncate">Facebook</span>
                  </a>
                )}

                {/* Twitter */}
                {organizer.twitterUrl && (
                  <a
                    href={organizer.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-text-muted hover:text-blue-400 transition-colors"
                  >
                    <Twitter className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm truncate">Twitter / X</span>
                  </a>
                )}

                {/* YouTube */}
                {organizer.youtubeUrl && (
                  <a
                    href={organizer.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-text-muted hover:text-red-600 transition-colors"
                  >
                    <Youtube className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm truncate">YouTube</span>
                  </a>
                )}

                {/* No contact info */}
                {!organizer.website && !organizer.instagramUrl && !organizer.facebookUrl &&
                 !organizer.twitterUrl && !organizer.youtubeUrl && (
                  <p className="text-sm text-text-faint italic">
                    {t('noContactInfo')}
                  </p>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
              <h3 className="mb-4 text-[16px] font-black text-ink-2">{t('statistics')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">{t('eventsOrganizedLabel')}</span>
                  <span className="font-semibold text-gray-900">
                    {organizer._count?.events || 0}
                  </span>
                </div>
                {organizer.events && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">{t('totalCompetitionsLabel')}</span>
                    <span className="font-semibold text-gray-900">
                      {organizer.events.reduce((total, event) =>
                        total + (event.competitions?.length || 0), 0
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
