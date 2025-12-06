// app/services/[slug]/page.tsx - Service detail page

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { servicesService } from '@/lib/api/v2';
import { eventsService } from '@/lib/api/events.service';
import { Service } from '@/types/v2';
import { Event } from '@/types/api';
import { MapPin, ArrowLeft, Eye, Tag, Star, Loader2, ExternalLink } from 'lucide-react';
import EventGallery from '@/components/EventGallery';
import { normalizeImageUrl } from '@/lib/utils/imageUrl';

// Import EventMap dynamically to avoid SSR issues with Leaflet
const EventMap = dynamic(() => import('@/components/EventMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const locale = params?.locale as string; // ✅ Get current locale

  const [service, setService] = useState<Service | null>(null);
  const [nearbyServices, setNearbyServices] = useState<Service[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const response = await servicesService.getBySlug(slug);
        const serviceData = response.data;

        // ✅ Apply translations if available
        const translation = (serviceData as any).translations?.find((t: any) => t.language === locale?.toUpperCase());
        if (translation) {
          serviceData.name = translation.name || serviceData.name;
          serviceData.description = translation.description || serviceData.description;
        }

        console.log('Service loaded:', {
          name: serviceData.name,
          locale,
          hasTranslation: !!translation
        });

        setService(serviceData);

        // Cargar servicios y eventos cercanos si hay coordenadas
        if (response.data.latitude && response.data.longitude) {
          try {
            // Fetch nearby services
            const nearby = await servicesService.getNearby(
              response.data.latitude,
              response.data.longitude,
              50 // 50km radius
            );
            // Mapear category_icon a categoryIcon para los servicios cercanos
            const mappedNearby = nearby.map((s: any) => ({
              ...s,
              categoryIcon: s.category_icon,
            }));
            setNearbyServices(mappedNearby);
          } catch (err) {
            console.error('Error loading nearby services:', err);
            // No bloqueamos si falla la carga de servicios cercanos
          }

          try {
            // Fetch nearby events
            const events = await eventsService.getNearby(
              response.data.latitude,
              response.data.longitude,
              50 // 50km radius
            );
            setNearbyEvents(events);
          } catch (err) {
            console.error('Error loading nearby events:', err);
            // No bloqueamos si falla la carga de eventos cercanos
          }
        }
      } catch (err: any) {
        console.error('Error fetching service:', err);
        setError(err.response?.data?.message || 'Error al cargar el servicio');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug, locale]); // ✅ Reload when locale changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Servicio no encontrado</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Servicios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-green-600">
        {service.coverImage && (
          <img
            src={normalizeImageUrl(service.coverImage)}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/services"
            className="text-white hover:text-gray-200 flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Servicios
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {service.name}
                </h1>
                <div className="flex items-center gap-4 mt-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{service.city}, {service.country}</span>
                  </div>
                  {service.category && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      <span>{service.category.icon} {service.category.name}</span>
                    </div>
                  )}
                </div>
              </div>
              {service.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
                  <Star className="h-4 w-4 fill-current" />
                  Destacado
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
            {service.description && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Acerca de</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>
            )}

            {/* Gallery */}
            {service.gallery && service.gallery.length > 0 && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <EventGallery
                  images={service.gallery}
                  eventName={service.name}
                />
              </div>
            )}

            {/* Stats */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Estadísticas</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-5 w-5" />
                <span>{service.viewCount || 0} visitas</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Logo */}
            {service.logoUrl && !logoError && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex justify-center">
                  <Image
                    src={normalizeImageUrl(service.logoUrl)}
                    alt={`${service.name} logo`}
                    width={128}
                    height={128}
                    className="object-contain"
                    onError={() => setLogoError(true)}
                  />
                </div>
              </div>
            )}

            {/* Map */}
            {service.latitude && service.longitude && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Ubicación
                </h3>
                <EventMap
                  event={{
                    id: service.id,
                    name: service.name,
                    slug: service.slug,
                    city: service.city,
                    country: service.country,
                    latitude: service.latitude,
                    longitude: service.longitude,
                    categoryIcon: service.category?.icon,
                  }}
                  nearbyEvents={nearbyEvents
                    .filter(e => e.latitude && e.longitude)
                    .map(e => ({
                      id: e.id,
                      name: e.name,
                      slug: e.slug,
                      city: e.city,
                      country: e.country,
                      latitude: e.latitude!,
                      longitude: e.longitude!,
                      categoryIcon: '🏃', // Icon for events
                    }))}
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
                      categoryIcon: (s as any).categoryIcon,
                    }))}
                  mainLinkPrefix="/services/"
                  nearbyLinkPrefix="/services/"
                />
                <div className="mt-4">
                  <a
                    href={`https://www.google.com/maps?q=${service.latitude},${service.longitude}`}
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

            {/* Category Info */}
            {service.category && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold">Categoría</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{service.category.icon}</span>
                  <span className="font-medium">{service.category.name}</span>
                </div>
              </div>
            )}

            {/* Website */}
            {(service as any).website && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold">Sitio Web Oficial</h3>
                <a
                  href={(service as any).website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visitar sitio web
                </a>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
