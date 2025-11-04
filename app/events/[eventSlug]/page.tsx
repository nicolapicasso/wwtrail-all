// app/events/[eventSlug]/page.tsx - Event detail page
// ✅ VERSIÓN CORREGIDA - Usa eventSlug correctamente

'use client';

import { useParams } from 'next/navigation';
import { useEvent } from '@/hooks/useEvents';
import { CompetitionList } from '@/components/CompetitionList';
import { MapPin, Calendar, Globe, Facebook, Instagram, Mail, Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EventDetailPage() {
  const params = useParams();
  // ✅ CORRECCIÓN: Usar eventSlug en vez de slug
  const eventSlug = params?.eventSlug as string;

  // ✅ CORRECCIÓN: Pasar eventSlug al hook
  const { event, loading, error } = useEvent(eventSlug);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-64 rounded-lg bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-red-900">Event not found</h2>
          <p className="mt-2 text-red-700">{error || 'This event does not exist'}</p>
          {/* Debug info */}
          <p className="mt-2 text-xs text-red-500">Looking for: {eventSlug}</p>
          <Link
            href="/events"
            className="mt-4 inline-block rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-green-600 to-green-800">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.name}
            className="h-full w-full object-cover opacity-50"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="container relative mx-auto flex h-full items-end px-4 pb-8">
          <div className="text-white">
            {/* Back button */}
            <Link
              href="/events"
              className="mb-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
            
            <div className="mb-2 flex items-center gap-2">
              {event.isHighlighted && (
                <span className="inline-flex items-center rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold">
                  ⭐ Featured
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-green-500 px-3 py-1 text-sm font-semibold">
                {event.status}
              </span>
            </div>
            <h1 className="text-4xl font-bold md:text-5xl">{event.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" />
              <span>
                {event.city}, {event.country}
              </span>
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
            {event.description && (
              <section className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-2xl font-bold">About this event</h2>
                <p className="whitespace-pre-line text-muted-foreground">{event.description}</p>
              </section>
            )}

            {/* Competitions */}
            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-2xl font-bold">Races & Distances</h2>
              <CompetitionList eventId={event.id} eventSlug={eventSlug} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 font-semibold">Event Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">
                      {event.city}, {event.country}
                    </p>
                  </div>
                </div>
                {event.firstEditionYear && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-medium">First Edition</p>
                      <p className="text-muted-foreground">{event.firstEditionYear}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Links */}
            {(event.websiteUrl || event.facebookUrl || event.instagramUrl || event.email || event.phone) && (
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 font-semibold">Contact & Links</h3>
                <div className="space-y-2">
                  {event.websiteUrl && (
                    <a
                      href={event.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-green-600 hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      Official Website
                    </a>
                  )}
                  {event.facebookUrl && (
                    <a
                      href={event.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                  )}
                  {event.instagramUrl && (
                    <a
                      href={event.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-pink-600 hover:underline"
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </a>
                  )}
                  {event.email && (
                    <a
                      href={`mailto:${event.email}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {event.email}
                    </a>
                  )}
                  {event.phone && (
                    <a
                      href={`tel:${event.phone}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      {event.phone}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Organizer */}
            {event.organizer && (
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 font-semibold">Organizer</h3>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-semibold text-green-600">
                    {event.organizer.firstName?.[0]}
                    {event.organizer.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {event.organizer.firstName} {event.organizer.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">@{event.organizer.username}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            {event._count && (
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 font-semibold">Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Races:</span>
                    <span className="font-semibold">{event._count.competitions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Views:</span>
                    <span className="font-semibold">{event.viewCount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
