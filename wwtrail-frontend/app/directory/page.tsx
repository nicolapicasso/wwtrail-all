// app/directory/page.tsx - Map-based directory page
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Mountain, Sparkles, Award, Filter, X, Building2, Flag } from 'lucide-react';
import eventsService from '@/lib/api/v2/events.service';
import competitionsService from '@/lib/api/v2/competitions.service';
import servicesService from '@/lib/api/v2/services.service';
import specialSeriesService from '@/lib/api/v2/specialSeries.service';
import { terrainTypesService } from '@/lib/api/catalogs.service';
import CountrySelect from '@/components/CountrySelect';

type ItemType = 'events' | 'competitions' | 'services' | 'all';

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

export default function DirectoryPage() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
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
      if (filters.itemType === 'all' || filters.itemType === 'events') {
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

          // Add event markers
          eventsWithLocation.forEach((event: any) => {
            const marker = L.marker([event.latitude, event.longitude], {
              icon: createEventIcon(),
            })
              .bindPopup(
                `
                <div class="p-2">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-green-600 font-semibold text-xs">EVENTO</span>
                  </div>
                  <h3 class="font-bold text-sm mb-1">${event.name}</h3>
                  <p class="text-xs text-gray-600">${event.city}, ${event.country}</p>
                  <a href="/events/${event.slug}" class="text-xs text-blue-600 hover:underline mt-2 inline-block">Ver evento →</a>
                </div>
              `
              )
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

          const competitionsWithLocation = competitionsData.data.filter(
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
            filteredCompetitions = filteredCompetitions.filter(
              (c: any) => c.specialSeriesId === filters.specialSeriesId
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

          // Add competition markers
          filteredCompetitions.forEach((comp: any) => {
            const marker = L.marker([comp.event.latitude, comp.event.longitude], {
              icon: createCompetitionIcon(),
            })
              .bindPopup(
                `
                <div class="p-2">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-blue-600 font-semibold text-xs">COMPETICIÓN</span>
                  </div>
                  <h3 class="font-bold text-sm mb-1">${comp.name}</h3>
                  <p class="text-xs text-gray-600">${comp.event.city}, ${comp.event.country}</p>
                  ${comp.baseDistance ? `<p class="text-xs text-gray-500">${comp.baseDistance} km</p>` : ''}
                  ${comp.specialSeries ? `<p class="text-xs text-purple-600">${comp.specialSeries.name}</p>` : ''}
                  <a href="/events/${comp.event.slug}/${comp.slug}" class="text-xs text-blue-600 hover:underline mt-2 inline-block">Ver competición →</a>
                </div>
              `
              )
              .addTo(mapRef.current!);

            markersRef.current.push(marker);
            bounds.extend([comp.event.latitude, comp.event.longitude]);
          });
        } catch (err) {
          console.error('Error loading competitions:', err);
        }
      }

      // Load services if needed
      if (filters.itemType === 'all' || filters.itemType === 'services') {
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

          // Add service markers
          servicesWithLocation.forEach((service: any) => {
            const marker = L.marker([service.latitude, service.longitude], {
              icon: createServiceIcon(),
            })
              .bindPopup(
                `
                <div class="p-2">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-orange-600 font-semibold text-xs">SERVICIO</span>
                  </div>
                  <h3 class="font-bold text-sm mb-1">${service.name}</h3>
                  <p class="text-xs text-gray-600">${service.city}, ${service.country}</p>
                  <p class="text-xs text-gray-500">${service.type}</p>
                  <a href="/services/${service.slug}" class="text-xs text-blue-600 hover:underline mt-2 inline-block">Ver servicio →</a>
                </div>
              `
              )
              .addTo(mapRef.current!);

            markersRef.current.push(marker);
            bounds.extend([service.latitude, service.longitude]);
          });
        } catch (err) {
          console.error('Error loading services:', err);
        }
      }

      // Fit map to bounds if there are markers
      if (markersRef.current.length > 0) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error) {
      console.error('Error loading directory data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Load data when filters change
  useEffect(() => {
    loadData();
  }, [loadData]);

  const createEventIcon = () => {
    return L.divIcon({
      className: 'custom-marker-event',
      html: `
        <div style="
          background-color: #16a34a;
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
            font-weight: bold;
          ">📍</div>
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
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: 18px;
          ">🏃</div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });
  };

  const createServiceIcon = () => {
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
          ">🏪</div>
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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-green-600" />
              Directorio de Trail Running
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {markersRef.current.length} ubicaciones en el mapa
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Filtros</h2>
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Limpiar
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Nombre..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Item Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de elemento
              </label>
              <select
                value={filters.itemType}
                onChange={(e) => handleFilterChange('itemType', e.target.value as ItemType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              >
                <option value="all">Todos</option>
                <option value="events">Eventos</option>
                <option value="competitions">Competiciones</option>
                <option value="services">Servicios</option>
              </select>
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

            {/* Competition Type */}
            {(filters.itemType === 'all' || filters.itemType === 'competitions') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Competición
                </label>
                <select
                  value={filters.competitionType}
                  onChange={(e) => handleFilterChange('competitionType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="">Todos</option>
                  <option value="TRAIL">Trail</option>
                  <option value="ULTRA">Ultra</option>
                  <option value="VERTICAL">Vertical</option>
                  <option value="SKYRUNNING">Skyrunning</option>
                  <option value="CANICROSS">Canicross</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>
            )}

            {/* Distance Range */}
            {(filters.itemType === 'all' || filters.itemType === 'competitions') && (
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                  <input
                    type="number"
                    value={filters.maxDistance}
                    onChange={(e) => handleFilterChange('maxDistance', e.target.value)}
                    placeholder="Hasta"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
            )}

            {/* Elevation Range */}
            {(filters.itemType === 'all' || filters.itemType === 'competitions') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desnivel (m D+)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minElevation}
                    onChange={(e) => handleFilterChange('minElevation', e.target.value)}
                    placeholder="Desde"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                  <input
                    type="number"
                    value={filters.maxElevation}
                    onChange={(e) => handleFilterChange('maxElevation', e.target.value)}
                    placeholder="Hasta"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
            )}

            {/* Terrain Type - Multiple Selection */}
            {(filters.itemType === 'all' || filters.itemType === 'competitions') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Mountain className="h-4 w-4" />
                  Tipo de Terreno
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {terrainTypes.length === 0 ? (
                    <p className="text-xs text-gray-500 p-2">No hay tipos de terreno disponibles</p>
                  ) : (
                    terrainTypes.map((type) => (
                      <label key={type.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
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
            )}

            {/* Special Series */}
            {(filters.itemType === 'all' || filters.itemType === 'competitions') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  Serie Especial
                </label>
                <select
                  value={filters.specialSeriesId}
                  onChange={(e) => handleFilterChange('specialSeriesId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="">Todas</option>
                  {specialSeriesList.map((series) => (
                    <option key={series.id} value={series.id}>
                      {series.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ITRA Points */}
            {(filters.itemType === 'all' || filters.itemType === 'competitions') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  Puntos ITRA
                </label>
                <select
                  value={filters.itraPoints}
                  onChange={(e) => handleFilterChange('itraPoints', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="">Todos</option>
                  <option value="0">0 puntos</option>
                  <option value="1">1 punto</option>
                  <option value="2">2 puntos</option>
                  <option value="3">3 puntos</option>
                  <option value="4">4 puntos</option>
                  <option value="5">5 puntos</option>
                  <option value="6">6 puntos</option>
                </select>
              </div>
            )}

            {/* UTMB Index */}
            {(filters.itemType === 'all' || filters.itemType === 'competitions') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Índice UTMB
                </label>
                <select
                  value={filters.utmbIndex}
                  onChange={(e) => handleFilterChange('utmbIndex', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="">Todos</option>
                  <option value="INDEX_20K">20K</option>
                  <option value="INDEX_50K">50K</option>
                  <option value="INDEX_100K">100K</option>
                  <option value="INDEX_100M">100M</option>
                </select>
              </div>
            )}

            {/* Legend */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Leyenda</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-600"></div>
                  <span className="text-gray-600">Eventos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  <span className="text-gray-600">Competiciones</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-600"></div>
                  <span className="text-gray-600">Servicios</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="absolute inset-0" />
          {isLoading && (
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 text-sm text-gray-600">
              Cargando datos del mapa...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
