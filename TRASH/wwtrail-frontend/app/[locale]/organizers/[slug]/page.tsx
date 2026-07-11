// app/organizers/[slug]/page.tsx - Organizer detail page

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando organizador...</p>
        </div>
      </div>
    );
  }

  if (error || !organizer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Organizador no encontrado</h2>
          <p className="text-gray-600 mb-4">{error || 'Este organizador no existe'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-green-600 py-16">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Logo */}
            {organizer.logoUrl && (
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 bg-white rounded-full p-4 shadow-lg">
                  <Image
                    src={normalizeImageUrl(organizer.logoUrl)}
                    alt={`${organizer.name} logo`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <Building2 className="h-6 w-6 text-white" />
                <span className="text-white/90 text-sm font-medium">Organizador</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {organizer.name}
              </h1>
              <div className="flex items-center gap-2 text-white/90 justify-center md:justify-start">
                <MapPin className="h-4 w-4" />
                <span>{organizer.country}</span>
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
            {organizer.description && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Sobre el Organizador</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {organizer.description}
                </p>
              </div>
            )}

            {/* Events */}
            {organizer.events && organizer.events.length > 0 && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  Eventos Organizados ({organizer.events.length})
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
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {event.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <MapPin className="h-4 w-4" />
                              {event.city}, {event.country}
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Competitions */}
                      {event.competitions && event.competitions.length > 0 && (
                        <div className="ml-20 mt-3 space-y-2">
                          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-green-600" />
                            Competiciones ({event.competitions.length})
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {event.competitions.map((competition) => (
                              <Link
                                key={competition.id}
                                href={`/events/${event.slug}/${competition.slug}`}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 p-2 rounded hover:bg-blue-50"
                              >
                                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium">
                                  {competition.type}
                                </span>
                                <span>{competition.name}</span>
                                {competition.baseDistance && (
                                  <span className="text-xs text-gray-500">
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
                <p className="text-gray-600">
                  Este organizador aún no tiene eventos publicados
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Social Media */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Contacto y Redes</h3>
              <div className="space-y-3">
                {/* Website */}
                {organizer.website && (
                  <a
                    href={organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Globe className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm truncate">Sitio Web</span>
                  </a>
                )}

                {/* Instagram */}
                {organizer.instagramUrl && (
                  <a
                    href={organizer.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-pink-600 transition-colors"
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
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
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
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-400 transition-colors"
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
                    className="flex items-center gap-3 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <Youtube className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm truncate">YouTube</span>
                  </a>
                )}

                {/* No contact info */}
                {!organizer.website && !organizer.instagramUrl && !organizer.facebookUrl &&
                 !organizer.twitterUrl && !organizer.youtubeUrl && (
                  <p className="text-sm text-gray-500 italic">
                    No hay información de contacto disponible
                  </p>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Eventos organizados:</span>
                  <span className="font-semibold text-gray-900">
                    {organizer._count?.events || 0}
                  </span>
                </div>
                {organizer.events && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Competiciones totales:</span>
                    <span className="font-semibold text-gray-900">
                      {organizer.events.reduce((total, event) =>
                        total + (event.competitions?.length || 0), 0
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
