// components/EventMap.tsx
// Mapa interactivo con Leaflet para página de evento
// ✅ Pin principal del evento
// ✅ Pines secundarios de eventos cercanos
// ✅ Popup con información
// ✅ Selector de modo de mapa (terreno, satélite, calles)

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Event } from '@/types/api';
import { Layers, Map as MapIcon, Satellite, MountainSnow } from 'lucide-react';

// Fix para iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Map tile providers
type MapMode = 'street' | 'satellite' | 'terrain';

const MAP_TILES = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    name: 'Calles',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri',
    name: 'Satélite',
    maxZoom: 19,
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors',
    name: 'Terreno',
    maxZoom: 17,
  },
};

/**
 * Ajusta coordenadas de marcadores que se solapan, distribuyéndolos en círculo
 * @param items Array de items con latitude y longitude
 * @param centerLat Latitud del centro (evento principal)
 * @param centerLon Longitud del centro (evento principal)
 * @param radius Radio del círculo en grados (~0.003 = 300m)
 * @returns Array de items con coordenadas ajustadas
 */
function spreadOverlappingMarkers<T extends { latitude: number; longitude: number }>(
  items: T[],
  centerLat: number,
  centerLon: number,
  radius: number = 0.003
): (T & { originalLat?: number; originalLon?: number })[] {
  if (items.length === 0) return [];

  // Clave del marcador principal (centro)
  const mainKey = `${centerLat.toFixed(5)},${centerLon.toFixed(5)}`;

  // Agrupar items por coordenadas
  const groups = new Map<string, T[]>();

  items.forEach(item => {
    const lat = Number(item.latitude);
    const lon = Number(item.longitude);
    const key = `${lat.toFixed(5)},${lon.toFixed(5)}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  });

  const result: (T & { originalLat?: number; originalLon?: number })[] = [];

  // Procesar cada grupo
  groups.forEach((groupItems, key) => {
    // Verificar si este grupo se solapa con el marcador principal
    const overlapsWithMain = key === mainKey;

    if (groupItems.length === 1 && !overlapsWithMain) {
      // Si solo hay un item y no se solapa con el principal, no necesita ajuste
      result.push(groupItems[0]);
    } else {
      // Si hay múltiples items en la misma posición o se solapa con el principal, distribuirlos en círculo
      // Calcular el total de items a distribuir (incluir espacio para el principal si se solapa)
      const totalInCircle = overlapsWithMain ? groupItems.length + 1 : groupItems.length;
      // Si se solapa con principal, empezar desde índice 1 para dejar espacio al marcador principal
      const startIndex = overlapsWithMain ? 1 : 0;

      groupItems.forEach((item, index) => {
        const angle = (360 / totalInCircle) * (index + startIndex);
        const angleRad = (angle * Math.PI) / 180;

        const newLat = Number(item.latitude) + radius * Math.cos(angleRad);
        const newLon = Number(item.longitude) + radius * Math.sin(angleRad);

        result.push({
          ...item,
          originalLat: Number(item.latitude),
          originalLon: Number(item.longitude),
          latitude: newLat,
          longitude: newLon,
        } as T & { originalLat?: number; originalLon?: number });
      });
    }
  });

  return result;
}

interface EventMapProps {
  event: Event & { categoryIcon?: string; type?: 'event' | 'service' }; // Agregamos soporte para icono de categoría y tipo
  nearbyEvents?: Event[];
  nearbyServices?: Event[]; // Services passed as Event-like objects with categoryIcon
  nearbyLinkPrefix?: string; // Prefijo para links de nearby (default: '/events/')
  mainLinkPrefix?: string; // Prefijo para link del marcador principal (default: '/events/')
}

export default function EventMap({
  event,
  nearbyEvents = [],
  nearbyServices = [],
  nearbyLinkPrefix = '/events/',
  mainLinkPrefix = '/events/'
}: EventMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapMode, setMapMode] = useState<MapMode>('satellite');
  const [showMapModeMenu, setShowMapModeMenu] = useState(false);

  // Change map mode
  const changeMapMode = useCallback((mode: MapMode) => {
    if (!mapRef.current) return;

    // Remove current tile layer
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    // Add new tile layer
    const tileConfig = MAP_TILES[mode];
    const newTileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
    }).addTo(mapRef.current);
    tileLayerRef.current = newTileLayer;

    setMapMode(mode);
    setShowMapModeMenu(false);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !event.latitude || !event.longitude) return;

    // Validar que las coordenadas sean números válidos
    const lat = Number(event.latitude);
    const lon = Number(event.longitude);
    if (isNaN(lat) || isNaN(lon)) {
      console.error('Invalid coordinates:', event.latitude, event.longitude);
      return;
    }

    // Filtrar el evento principal de ambas listas para evitar duplicación
    const filteredNearbyEvents = nearbyEvents.filter(e => e.id !== event.id);
    const filteredNearbyServices = nearbyServices.filter(s => s.id !== event.id);

    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      // Limpiar mapa existente si existe
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Inicializar mapa
      const map = L.map(mapContainerRef.current).setView(
        [lat, lon],
        11 // zoom level (reduced for terrain mode compatibility)
      );

      mapRef.current = map;

    // Agregar capa de tiles (Satellite por defecto)
    const tileConfig = MAP_TILES.satellite;
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

      // ============================================
      // ✅ ICONO PERSONALIZADO PARA EVENTO PRINCIPAL
      // ============================================
      const mainIconEmoji = event.categoryIcon || '📍';
      const mainIcon = L.divIcon({
        className: 'custom-marker-main',
        html: `
          <div style="
            background-color: #16a34a;
            width: 40px;
            height: 40px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 20px;
              font-weight: bold;
            ">${mainIconEmoji}</div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // Helper function to create nearby icon with emoji and color
      const createNearbyIcon = (emoji: string = '📌', color: string = '#3b82f6') => L.divIcon({
        className: 'custom-marker-nearby',
        html: `
          <div style="
            background-color: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 14px;
            ">${emoji}</div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      // ============================================
      // 📍 MARKER PRINCIPAL (Evento actual)
      // ============================================
      const mainMarker = L.marker([lat, lon], {
        icon: mainIcon,
        title: event.name,
      }).addTo(map);

      // Popup del marcador principal
      const mainType = mainLinkPrefix === '/services/' ? 'Servicio' : 'Evento';
      const mainLinkText = mainLinkPrefix === '/services/' ? 'Ver servicio →' : 'Ver evento →';
      mainMarker.bindPopup(`
        <div style="min-width: 200px; padding: 16px;">
          <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 10px; color: #000; line-height: 1.3;">
            ${event.name}
          </h3>
          <p style="font-size: 14px; color: #000; margin-bottom: 6px;">
            <strong>Tipo:</strong> ${mainType}
          </p>
          <p style="font-size: 14px; color: #000; margin-bottom: 6px;">
            <strong>Lugar:</strong> ${event.city}, ${event.country}
          </p>
          ${event.slug ? `
          <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #000;">
            <a
              href="${mainLinkPrefix}${event.slug}"
              style="color: #000; text-decoration: none; font-weight: 600; font-size: 14px; transition: color 0.2s;"
              onmouseover="this.style.color='#B66916'"
              onmouseout="this.style.color='#000'"
            >
              ${mainLinkText}
            </a>
          </div>
          ` : ''}
        </div>
      `);

      // ============================================
      // 📌 MARKERS DE EVENTOS CERCANOS (Azul)
      // ============================================
      // Ajustar coordenadas de eventos solapados antes de crear marcadores
      const adjustedNearbyEvents = spreadOverlappingMarkers(
        filteredNearbyEvents,
        lat,
        lon,
        0.003 // ~300 metros
      );

      adjustedNearbyEvents.forEach((nearbyEvent) => {
        if (!nearbyEvent.latitude || !nearbyEvent.longitude) return;

        // Validar coordenadas
        const nearbyLat = Number(nearbyEvent.latitude);
        const nearbyLon = Number(nearbyEvent.longitude);
        if (isNaN(nearbyLat) || isNaN(nearbyLon)) return;

        // Usar el emoji de categoría si está disponible
        const nearbyIconEmoji = (nearbyEvent as any).categoryIcon || '📌';
        const nearbyIcon = createNearbyIcon(nearbyIconEmoji, '#3b82f6'); // Azul para eventos

        const nearbyMarker = L.marker(
          [nearbyLat, nearbyLon],
          {
            icon: nearbyIcon,
            title: nearbyEvent.name,
          }
        ).addTo(map);

        // Popup de evento cercano
        nearbyMarker.bindPopup(`
          <div style="min-width: 180px; padding: 16px;">
            <h4 style="font-weight: bold; font-size: 17px; margin-bottom: 10px; color: #000; line-height: 1.3;">
              ${nearbyEvent.name}
            </h4>
            <p style="font-size: 14px; color: #000; margin-bottom: 6px;">
              <strong>Tipo:</strong> Evento
            </p>
            <p style="font-size: 14px; color: #000; margin-bottom: 6px;">
              <strong>Lugar:</strong> ${nearbyEvent.city}, ${nearbyEvent.country}
            </p>
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #000;">
              <a
                href="/events/${nearbyEvent.slug}"
                style="color: #000; text-decoration: none; font-weight: 600; font-size: 14px;"
                onmouseover="this.style.color='#B66916'"
                onmouseout="this.style.color='#000'"
              >
                Ver evento →
              </a>
            </div>
          </div>
        `);
      });

      // ============================================
      // 🏪 MARKERS DE SERVICIOS CERCANOS (Naranja)
      // ============================================
      // Ajustar coordenadas de servicios solapados antes de crear marcadores
      const adjustedNearbyServices = spreadOverlappingMarkers(
        filteredNearbyServices,
        lat,
        lon,
        0.003 // ~300 metros
      );

      adjustedNearbyServices.forEach((nearbyService) => {
        if (!nearbyService.latitude || !nearbyService.longitude) return;

        // Validar coordenadas
        const nearbyLat = Number(nearbyService.latitude);
        const nearbyLon = Number(nearbyService.longitude);
        if (isNaN(nearbyLat) || isNaN(nearbyLon)) return;

        // Usar el emoji de categoría si está disponible
        const nearbyIconEmoji = (nearbyService as any).categoryIcon || '🏪';
        const nearbyIcon = createNearbyIcon(nearbyIconEmoji, '#f97316'); // Naranja para servicios

        const nearbyMarker = L.marker(
          [nearbyLat, nearbyLon],
          {
            icon: nearbyIcon,
            title: nearbyService.name,
          }
        ).addTo(map);

        // Popup de servicio cercano
        const categoryName = (nearbyService as any).categoryName || (nearbyService as any).type || 'Servicio';
        nearbyMarker.bindPopup(`
          <div style="min-width: 180px; padding: 16px;">
            <h4 style="font-weight: bold; font-size: 17px; margin-bottom: 10px; color: #000; line-height: 1.3;">
              ${nearbyService.name}
            </h4>
            <p style="font-size: 14px; color: #000; margin-bottom: 6px;">
              <strong>Categoría:</strong> ${categoryName}
            </p>
            <p style="font-size: 14px; color: #000; margin-bottom: 6px;">
              ${nearbyService.city}, ${nearbyService.country}
            </p>
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #000;">
              <a
                href="/services/${nearbyService.slug}"
                style="color: #000; text-decoration: none; font-weight: 600; font-size: 14px;"
                onmouseover="this.style.color='#B66916'"
                onmouseout="this.style.color='#000'"
              >
                Ver →
              </a>
            </div>
          </div>
        `);
      });

      // ============================================
      // 🗺️ AJUSTAR VISTA PARA MOSTRAR TODOS LOS MARKERS
      // ============================================
      if (filteredNearbyEvents.length > 0 || filteredNearbyServices.length > 0) {
        // Combinar y validar coordenadas de eventos y servicios cercanos
        const validNearbyCoords = [
          ...filteredNearbyEvents,
          ...filteredNearbyServices
        ]
          .filter(e => e.latitude && e.longitude)
          .map(e => {
            const nLat = Number(e.latitude);
            const nLon = Number(e.longitude);
            return !isNaN(nLat) && !isNaN(nLon) ? [nLat, nLon] as [number, number] : null;
          })
          .filter((coords): coords is [number, number] => coords !== null);

        if (validNearbyCoords.length > 0) {
          const bounds = L.latLngBounds([
            [lat, lon],
            ...validNearbyCoords
          ]);

          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }, 100); // 100ms delay para asegurar que el DOM esté listo

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [event, nearbyEvents, nearbyServices, nearbyLinkPrefix]);

  if (!event.latitude || !event.longitude) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Ubicación no disponible</p>
      </div>
    );
  }

  return (
    <div className="relative h-64 rounded-lg overflow-hidden border border-gray-200">
      {/* Map Mode Selector */}
      <div className="absolute top-2 right-2 z-[1001]">
        <button
          onClick={() => setShowMapModeMenu(!showMapModeMenu)}
          className="bg-white px-2 py-1.5 rounded shadow-md border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-xs"
          title="Cambiar tipo de mapa"
        >
          <Layers className="w-3.5 h-3.5 text-gray-600" />
          <span className="font-medium text-gray-700">{MAP_TILES[mapMode].name}</span>
        </button>

        {/* Map Mode Dropdown */}
        {showMapModeMenu && (
          <div className="absolute top-full right-0 mt-1 bg-white rounded shadow-lg border border-gray-200 overflow-hidden min-w-[100px]">
            <button
              onClick={() => changeMapMode('terrain')}
              className={`w-full px-3 py-1.5 text-left text-xs flex items-center gap-1.5 hover:bg-gray-50 ${
                mapMode === 'terrain' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <MountainSnow className="w-3.5 h-3.5" />
              Terreno
            </button>
            <button
              onClick={() => changeMapMode('satellite')}
              className={`w-full px-3 py-1.5 text-left text-xs flex items-center gap-1.5 hover:bg-gray-50 ${
                mapMode === 'satellite' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              Satélite
            </button>
            <button
              onClick={() => changeMapMode('street')}
              className={`w-full px-3 py-1.5 text-left text-xs flex items-center gap-1.5 hover:bg-gray-50 ${
                mapMode === 'street' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Calles
            </button>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ zIndex: 0 }}
      />
    </div>
  );
}

/*
✅ CARACTERÍSTICAS:

1. PIN PRINCIPAL (Verde):
   - Evento actual
   - Más grande y destacado
   - Popup con información completa

2. PINES SECUNDARIOS (Azules):
   - Eventos cercanos (50km radius)
   - Más pequeños
   - Popup con link al evento

3. FUNCIONALIDADES:
   - Auto-zoom para mostrar todos los eventos
   - Click en markers para ver info
   - Links directos a eventos
   - Responsive

4. INTEGRACIÓN:
   - OpenStreetMap (gratuito, sin API key)
   - Leaflet (biblioteca ligera)
   - Iconos personalizados con emoji

INSTALACIÓN REQUERIDA:
npm install leaflet
npm install --save-dev @types/leaflet
*/
