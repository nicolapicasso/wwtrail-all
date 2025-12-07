// components/home/MapBlock.tsx
// Map block for home page - displays events, competitions, and/or services on a map

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import eventsService from '@/lib/api/v2/events.service';
import competitionsService from '@/lib/api/v2/competitions.service';
import servicesService from '@/lib/api/v2/services.service';
import type { MapBlockConfig, MapMode } from '@/types/home';

// Fix para iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Map tile providers
const MAP_TILES: Record<MapMode, { url: string; attribution: string; maxZoom: number }> = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri',
    maxZoom: 19,
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors',
    maxZoom: 17,
  },
};

interface MapBlockProps {
  config: MapBlockConfig;
}

export function MapBlock({ config }: MapBlockProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // Custom icon functions
  const createEventIcon = () => {
    return L.divIcon({
      className: 'custom-marker-event',
      html: `
        <div style="
          background-color: #10b981;
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="transform: rotate(45deg); color: white; font-size: 18px;">📍</div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });
  };

  const createCompetitionIcon = () => {
    return L.divIcon({
      className: 'custom-marker-competition',
      html: `
        <div style="
          background-color: #3b82f6;
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="transform: rotate(45deg); color: white; font-size: 18px;">🏃</div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });
  };

  const createServiceIcon = (categoryIcon?: string) => {
    const icon = categoryIcon || '🏪';
    return L.divIcon({
      className: 'custom-marker-service',
      html: `
        <div style="
          background-color: #f97316;
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="transform: rotate(45deg); color: white; font-size: 18px;">${icon}</div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });
  };

  // Load data and create markers
  const loadData = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      setIsLoading(true);

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      const bounds = L.latLngBounds([]);

      // Load events if enabled
      if (config.showEvents) {
        try {
          const eventsData = await eventsService.getAll({
            status: 'PUBLISHED',
            limit: 500,
          });

          const eventsWithLocation = eventsData.data.filter(
            (e: any) => e.latitude && e.longitude
          );

          eventsWithLocation.forEach((event: any) => {
            const marker = L.marker([event.latitude, event.longitude], {
              icon: createEventIcon(),
            })
              .bindPopup(`
                <div style="min-width: 180px; padding: 16px;">
                  <h3 style="font-weight: bold; font-size: 17px; margin-bottom: 10px; color: #000; line-height: 1.3;">
                    ${event.name}
                  </h3>
                  <p style="font-size: 14px; color: #000; margin-bottom: 6px;">
                    <strong>Tipo:</strong> Evento
                  </p>
                  <p style="font-size: 14px; color: #000; margin-bottom: 6px;">
                    <strong>Lugar:</strong> ${event.city}, ${event.country}
                  </p>
                  <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #000;">
                    <a href="/events/${event.slug}" style="color: #000; text-decoration: none; font-weight: 600; font-size: 14px;" onmouseover="this.style.color='#B66916'" onmouseout="this.style.color='#000'">
                      Ver evento →
                    </a>
                  </div>
                </div>
              `)
              .addTo(mapRef.current!);

            markersRef.current.push(marker);
            bounds.extend([event.latitude, event.longitude]);
          });
        } catch (err) {
          console.error('Error loading events:', err);
        }
      }

      // Load competitions if enabled
      if (config.showCompetitions) {
        try {
          const competitionsData = await competitionsService.getAll({
            limit: 500,
          });

          const competitionsWithLocation = competitionsData.competitions.filter(
            (c: any) => c.event?.latitude && c.event?.longitude
          );

          competitionsWithLocation.forEach((comp: any) => {
            const marker = L.marker([comp.event.latitude, comp.event.longitude], {
              icon: createCompetitionIcon(),
            })
              .bindPopup(`
                <div style="min-width: 200px; padding: 16px;">
                  <h3 style="font-weight: bold; font-size: 17px; margin-bottom: 10px; color: #000; line-height: 1.3;">
                    ${comp.name}
                  </h3>
                  <p style="font-size: 14px; color: #000; margin-bottom: 6px;">
                    <strong>Tipo:</strong> Competición
                  </p>
                  <p style="font-size: 14px; color: #000; margin-bottom: 6px;">
                    <strong>Lugar:</strong> ${comp.event.city}, ${comp.event.country}
                  </p>
                  ${comp.baseDistance ? `<p style="font-size: 14px; color: #000; margin-bottom: 6px;"><strong>Distancia:</strong> ${comp.baseDistance} km</p>` : ''}
                  ${comp.baseElevation ? `<p style="font-size: 14px; color: #000; margin-bottom: 6px;"><strong>Desnivel +:</strong> ${comp.baseElevation}m+</p>` : ''}
                  <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #000;">
                    <a href="/events/${comp.event.slug}/${comp.slug}" style="color: #000; text-decoration: none; font-weight: 600; font-size: 14px;" onmouseover="this.style.color='#B66916'" onmouseout="this.style.color='#000'">
                      Ver competición →
                    </a>
                  </div>
                </div>
              `)
              .addTo(mapRef.current!);

            markersRef.current.push(marker);
            bounds.extend([comp.event.latitude, comp.event.longitude]);
          });
        } catch (err) {
          console.error('Error loading competitions:', err);
        }
      }

      // Load services if enabled
      if (config.showServices) {
        try {
          const servicesData = await servicesService.getAll({
            status: 'PUBLISHED',
            limit: 500,
          });

          const servicesWithLocation = servicesData.data.filter(
            (s: any) => s.latitude && s.longitude
          );

          servicesWithLocation.forEach((service: any) => {
            const categoryIcon = service.category?.icon;
            const categoryName = service.category?.name || service.type;

            const marker = L.marker([service.latitude, service.longitude], {
              icon: createServiceIcon(categoryIcon),
            })
              .bindPopup(`
                <div style="min-width: 180px; padding: 16px;">
                  <h3 style="font-weight: bold; font-size: 17px; margin-bottom: 10px; color: #000; line-height: 1.3;">
                    ${service.name}
                  </h3>
                  <p style="font-size: 14px; color: #000; margin-bottom: 6px;">
                    <strong>Categoría:</strong> ${categoryName}
                  </p>
                  <p style="font-size: 14px; color: #000; margin-bottom: 6px;">
                    ${service.city}, ${service.country}
                  </p>
                  <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #000;">
                    <a href="/services/${service.slug}" style="color: #000; text-decoration: none; font-weight: 600; font-size: 14px;" onmouseover="this.style.color='#B66916'" onmouseout="this.style.color='#000'">
                      Ver →
                    </a>
                  </div>
                </div>
              `)
              .addTo(mapRef.current!);

            markersRef.current.push(marker);
            bounds.extend([service.latitude, service.longitude]);
          });
        } catch (err) {
          console.error('Error loading services:', err);
        }
      }

      // Fit bounds if there are markers, otherwise use configured zoom
      if (markersRef.current.length > 0 && bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: config.zoom });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [config.showEvents, config.showCompetitions, config.showServices, config.zoom]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const tileConfig = MAP_TILES[config.mapMode] || MAP_TILES.terrain;

    const map = L.map(mapContainerRef.current).setView([40.4637, -3.7492], config.zoom);
    mapRef.current = map;

    L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
    }).addTo(map);

    // Load data after map is initialized
    loadData();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [config.mapMode, config.zoom, loadData]);

  return (
    <div className="w-full relative" style={{ height: `${config.height}px` }}>
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
