// app/directory/DirectoryMapClient.tsx - Map-based directory page (Client-only)
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Mountain, Sparkles, Award, X, Building2, ChevronLeft, ChevronRight, Layers, Map as MapIcon, Satellite, MountainSnow } from 'lucide-react';
import eventsService from '@/lib/api/v2/events.service';
import competitionsService from '@/lib/api/v2/competitions.service';
import servicesService from '@/lib/api/v2/services.service';
import specialSeriesService from '@/lib/api/v2/specialSeries.service';
import { terrainTypesService } from '@/lib/api/catalogs.service';
import CountrySelect from '@/components/CountrySelect';

type ItemType = 'events' | 'competitions' | 'services' | 'all';
type MapMode = 'street' | 'satellite' | 'terrain';

// Map tile providers
const MAP_TILES = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    name: 'Calles',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri',
    name: 'Satélite',
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors',
    name: 'Terreno',
  },
};

/**
 * Ajusta coordenadas de marcadores que se solapan, distribuyéndolos en círculo
 */
function spreadOverlappingMarkers<T extends { latitude: number; longitude: number }>(
  items: T[],
  radius: number = 0.003
): (T & { originalLat?: number; originalLon?: number })[] {
  if (items.length === 0) return [];

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
    if (groupItems.length === 1) {
      // Si solo hay un item, no necesita ajuste
      result.push(groupItems[0]);
    } else {
      // Si hay múltiples items en la misma posición, distribuirlos en círculo
      groupItems.forEach((item, index) => {
        const angle = (360 / groupItems.length) * index;
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

interface DirectoryFilters {
  itemType: ItemType;
  country: string;
  search: string;
  competitionType: string;
  terrainTypeIds: string[]; // Multiple selection
  specialSeriesId: string;
  itraPoints: string;
  utmbIndex: string;
  minDistance: string;
  maxDistance: string;
  minElevation: string;
  maxElevation: string;
}

export default function DirectoryMapClient() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [mapMode, setMapMode] = useState<MapMode>('street');
  const [showMapModeMenu, setShowMapModeMenu] = useState(false);

  // Catalog data
  const [terrainTypes, setTerrainTypes] = useState<any[]>([]);
  const [specialSeriesList, setSpecialSeriesList] = useState<any[]>([]);

  // Map data
  const [events, setEvents] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  // Filters
  const [filters, setFilters] = useState<DirectoryFilters>({
    itemType: 'all',
    country: '',
    search: '',
    competitionType: '',
    terrainTypeIds: [],
    specialSeriesId: '',
    itraPoints: '',
    utmbIndex: '',
    minDistance: '',
    maxDistance: '',
    minElevation: '',
    maxElevation: '',
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Fix para iconos de Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    const map = L.map(mapContainerRef.current).setView([40.4637, -3.7492], 6); // Spain center
    mapRef.current = map;

    // Add initial tile layer
    const tileConfig = MAP_TILES.street;
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

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
      maxZoom: 19,
    }).addTo(mapRef.current);
    tileLayerRef.current = newTileLayer;

    setMapMode(mode);
    setShowMapModeMenu(false);
  }, []);

  // Load catalogs
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [terrainTypesData, specialSeriesData] = await Promise.all([
          terrainTypesService.getAll(true),
          specialSeriesService.getAll({ status: 'PUBLISHED', limit: 100 }),
        ]);
        setTerrainTypes(terrainTypesData);
        setSpecialSeriesList(specialSeriesData.data);
      } catch (err) {
        console.error('Error loading catalogs:', err);
      }
    };

    loadCatalogs();
  }, []);

  // Load data and update markers
  const loadData = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      setIsLoading(true);

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      const bounds = L.latLngBounds([]);

      // Load events if needed
      // When a special series is selected, only show competitions (not events or services)
      const showEvents = !filters.specialSeriesId && (filters.itemType === 'all' || filters.itemType === 'events');
      if (showEvents) {
        try {
          const eventsData = await eventsService.getAll({
            status: 'PUBLISHED',
            limit: 1000,
            country: filters.country || undefined,
            search: filters.search || undefined,
          });

          const eventsWithLocation = eventsData.data.filter(
            (e: any) => e.latitude && e.longitude
          );

          setEvents(eventsWithLocation);

          // Ajustar coordenadas de eventos solapados
          const adjustedEvents = spreadOverlappingMarkers(eventsWithLocation, 0.003);

          // Add event markers with green icon
          adjustedEvents.forEach((event: any) => {
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

      // Load competitions if needed
      if (filters.itemType === 'all' || filters.itemType === 'competitions') {
        try {
          const competitionsData = await competitionsService.getAll({
            limit: 1000,
          });

          const competitionsWithLocation = competitionsData.competitions.filter(
            (c: any) => c.event?.latitude && c.event?.longitude
          );

          // Apply filters
          let filteredCompetitions = competitionsWithLocation;

          if (filters.country) {
            filteredCompetitions = filteredCompetitions.filter(
              (c: any) => c.event?.country === filters.country
            );
          }

          if (filters.competitionType) {
            filteredCompetitions = filteredCompetitions.filter(
              (c: any) => c.type === filters.competitionType
            );
          }

          if (filters.terrainTypeIds.length > 0) {
            filteredCompetitions = filteredCompetitions.filter(
              (c: any) => filters.terrainTypeIds.includes(c.terrainTypeId)
            );
          }

          if (filters.specialSeriesId) {
            // Many-to-many: Check if competition belongs to the selected special series
            filteredCompetitions = filteredCompetitions.filter(
              (c: any) => c.specialSeries?.some((s: any) => s.id === filters.specialSeriesId)
            );
          }

          if (filters.itraPoints) {
            filteredCompetitions = filteredCompetitions.filter(
              (c: any) => c.itraPoints === parseInt(filters.itraPoints)
            );
          }

          if (filters.utmbIndex) {
            filteredCompetitions = filteredCompetitions.filter(
              (c: any) => c.utmbIndex === filters.utmbIndex
            );
          }

          // Distance range filter
          if (filters.minDistance) {
            filteredCompetitions = filteredCompetitions.filter(
              (c: any) => c.baseDistance >= parseFloat(filters.minDistance)
            );
          }
          if (filters.maxDistance) {
            filteredCompetitions = filteredCompetitions.filter(
              (c: any) => c.baseDistance <= parseFloat(filters.maxDistance)
            );
          }

          // Elevation range filter
          if (filters.minElevation) {
            filteredCompetitions = filteredCompetitions.filter(
              (c: any) => c.baseElevation >= parseInt(filters.minElevation)
            );
          }
          if (filters.maxElevation) {
            filteredCompetitions = filteredCompetitions.filter(
              (c: any) => c.baseElevation <= parseInt(filters.maxElevation)
            );
          }

          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredCompetitions = filteredCompetitions.filter(
              (c: any) =>
                c.name.toLowerCase().includes(searchLower) ||
                c.event?.name.toLowerCase().includes(searchLower)
            );
          }

          setCompetitions(filteredCompetitions);

          // Transform competitions to have their event coordinates
          const competitionsWithCoords = filteredCompetitions.map((comp: any) => ({
            ...comp,
            latitude: comp.event.latitude,
            longitude: comp.event.longitude,
          }));

          // Ajustar coordenadas de competiciones solapadas
          const adjustedCompetitions = spreadOverlappingMarkers(competitionsWithCoords, 0.003);

          // Add competition markers
          adjustedCompetitions.forEach((comp: any) => {
            const marker = L.marker([comp.latitude, comp.longitude], {
              icon: createCompetitionIcon(),
            })
              .bindPopup(
                `
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
                  ${comp.specialSeries ? `<p style="font-size: 14px; color: #000; margin-bottom: 6px;"><strong>Special series:</strong> <a href="/special-series/${comp.specialSeries.slug}" style="color: #000; text-decoration: underline;" onmouseover="this.style.color='#B66916'" onmouseout="this.style.color='#000'">${comp.specialSeries.name}</a></p>` : ''}
                  <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #000;">
                    <a href="/events/${comp.event.slug}/${comp.slug}" style="color: #000; text-decoration: none; font-weight: 600; font-size: 14px;" onmouseover="this.style.color='#B66916'" onmouseout="this.style.color='#000'">
                      Ver competición →
                    </a>
                  </div>
                </div>
              `
              )
              .addTo(mapRef.current!);

            markersRef.current.push(marker);
            bounds.extend([comp.latitude, comp.longitude]);
          });
        } catch (err) {
          console.error('Error loading competitions:', err);
        }
      }

      // Load services if needed
      // When a special series is selected, only show competitions (not events or services)
      const showServices = !filters.specialSeriesId && (filters.itemType === 'all' || filters.itemType === 'services');
      if (showServices) {
        try {
          const servicesData = await servicesService.getAll({
            status: 'PUBLISHED',
            limit: 1000,
            country: filters.country || undefined,
            search: filters.search || undefined,
          });

          const servicesWithLocation = servicesData.data.filter(
            (s: any) => s.latitude && s.longitude
          );

          setServices(servicesWithLocation);

          // Ajustar coordenadas de servicios solapados
          const adjustedServices = spreadOverlappingMarkers(servicesWithLocation, 0.003);

          // Add service markers with category-specific icons
          adjustedServices.forEach((service: any) => {
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

      // Fit bounds if there are markers
      if (markersRef.current.length > 0) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
    const icon = categoryIcon || '🏪'; // Fallback to generic icon
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
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: 18px;
          ">${icon}</div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });
  };

  const handleFilterChange = (key: keyof DirectoryFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleTerrainTypeToggle = (terrainTypeId: string) => {
    setFilters((prev) => ({
      ...prev,
      terrainTypeIds: prev.terrainTypeIds.includes(terrainTypeId)
        ? prev.terrainTypeIds.filter((id) => id !== terrainTypeId)
        : [...prev.terrainTypeIds, terrainTypeId],
    }));
  };

  const clearFilters = () => {
    setFilters({
      itemType: 'all',
      country: '',
      search: '',
      competitionType: '',
      terrainTypeIds: [],
      specialSeriesId: '',
      itraPoints: '',
      utmbIndex: '',
      minDistance: '',
      maxDistance: '',
      minElevation: '',
      maxElevation: '',
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Filters Sidebar - Collapsible */}
      <div
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          showFilters ? 'w-80' : 'w-0'
        }`}
      >
        {showFilters && (
          <div className="flex flex-col h-full min-w-[320px]">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Filtros
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Limpiar
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Ocultar filtros"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* Item Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de item
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'all', label: 'Todos', icon: MapPin },
                    { value: 'events', label: 'Eventos', icon: Mountain },
                    { value: 'competitions', label: 'Competiciones', icon: Award },
                    { value: 'services', label: 'Servicios', icon: Building2 },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleFilterChange('itemType', value)}
                      className={`p-2 rounded-lg border text-sm flex items-center gap-2 justify-center transition-colors ${
                        filters.itemType === value
                          ? 'bg-blue-50 border-blue-600 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Nombre..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <CountrySelect
                  value={filters.country}
                  onChange={(value) => handleFilterChange('country', value)}
                  placeholder="Todos los países"
                />
              </div>

              {/* Distance Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distancia (km)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minDistance}
                    onChange={(e) => handleFilterChange('minDistance', e.target.value)}
                    placeholder="Desde"
                    min="0"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="number"
                    value={filters.maxDistance}
                    onChange={(e) => handleFilterChange('maxDistance', e.target.value)}
                    placeholder="Hasta"
                    min="0"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Elevation Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desnivel positivo (m)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minElevation}
                    onChange={(e) => handleFilterChange('minElevation', e.target.value)}
                    placeholder="Desde"
                    min="0"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="number"
                    value={filters.maxElevation}
                    onChange={(e) => handleFilterChange('maxElevation', e.target.value)}
                    placeholder="Hasta"
                    min="0"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Terrain Types (Multiple) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipos de terreno
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {terrainTypes.length === 0 ? (
                    <p className="text-xs text-gray-500 p-2">No hay tipos de terreno disponibles</p>
                  ) : (
                    terrainTypes.map((type) => (
                      <label
                        key={type.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={filters.terrainTypeIds.includes(type.id)}
                          onChange={() => handleTerrainTypeToggle(type.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type.name}</span>
                      </label>
                    ))
                  )}
                </div>
                {filters.terrainTypeIds.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {filters.terrainTypeIds.length} seleccionado(s)
                  </p>
                )}
              </div>

              {/* Special Series */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Serie especial
                </label>
                <select
                  value={filters.specialSeriesId}
                  onChange={(e) => handleFilterChange('specialSeriesId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Todas las series</option>
                  {specialSeriesList.map((series) => (
                    <option key={series.id} value={series.id}>
                      {series.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results count */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Resultados:</span>
                  <span className="font-semibold text-gray-900">
                    {events.length + competitions.length + services.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {/* Expand filters button - only shown when sidebar is hidden */}
        {!showFilters && (
          <button
            onClick={() => setShowFilters(true)}
            className="absolute top-4 left-4 z-20 bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
            title="Mostrar filtros"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtros</span>
          </button>
        )}

        {/* Map Mode Selector */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowMapModeMenu(!showMapModeMenu)}
            className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
            title="Cambiar tipo de mapa"
          >
            <Layers className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{MAP_TILES[mapMode].name}</span>
          </button>

          {/* Map Mode Dropdown */}
          {showMapModeMenu && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[140px]">
              <button
                onClick={() => changeMapMode('street')}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 ${
                  mapMode === 'street' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Calles
              </button>
              <button
                onClick={() => changeMapMode('satellite')}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 ${
                  mapMode === 'satellite' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <Satellite className="w-4 h-4" />
                Satélite
              </button>
              <button
                onClick={() => changeMapMode('terrain')}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 ${
                  mapMode === 'terrain' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <MountainSnow className="w-4 h-4" />
                Terreno
              </button>
            </div>
          )}
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos...</p>
            </div>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
