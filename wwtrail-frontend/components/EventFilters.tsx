// components/EventFilters.tsx - VERSIÓN FINAL INTEGRADA
// ✅ Compatible con EventList-FIXED.tsx
// ✅ Búsqueda controlada desde EventList (no pierde foco)
// ✅ Filtro de mes en lugar de status
// ✅ Country y Featured funcionando

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, Filter, X, Calendar, MapPin, Building2 } from 'lucide-react';
import CountrySelect from './CountrySelect';
import { eventsService, organizersService } from '@/lib/api/v2';

interface EventFiltersProps {
  searchValue?: string;  // ✅ CRÍTICO: Valor controlado desde EventList
  onSearch: (query: string) => void;
  onFilterMonth?: (month: string) => void;  // Para páginas públicas (calendario)
  onFilterStatus?: (status: string) => void;  // Para páginas de gestión (admin/organizer)
  onFilterCountry: (country: string) => void;
  onFilterCity?: (city: string) => void;  // Nuevo filtro de ciudad
  onFilterOrganizer?: (organizerId: string) => void;  // Para admin
  selectedCountry?: string;  // País seleccionado para filtrar ciudades
  selectedCity?: string;  // Ciudad seleccionada
  onFilterHighlighted?: (highlighted: boolean | null) => void;
  showCountryFilter?: boolean;
  showCityFilter?: boolean;  // Mostrar filtro de ciudad
  showOrganizerFilter?: boolean;
  showHighlightedFilter?: boolean;
  showStatusFilter?: boolean;  // Mostrar filtro de status (para gestión)
  showMonthFilter?: boolean;  // Mostrar filtro de mes (para público)
  isLoading?: boolean;
}

export default function EventFilters({
  searchValue = '',  // ✅ CRÍTICO: Recibir valor controlado
  onSearch,
  onFilterMonth,
  onFilterStatus,
  onFilterCountry,
  onFilterCity,
  onFilterOrganizer,
  selectedCountry = '',
  selectedCity = '',
  onFilterHighlighted,
  showCountryFilter = true,
  showCityFilter = false,
  showOrganizerFilter = false,
  showHighlightedFilter = false,
  showStatusFilter = false,  // Para páginas de gestión
  showMonthFilter = true,  // Por defecto mostrar mes (páginas públicas)
  isLoading = false,
}: EventFiltersProps) {
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedOrganizer, setSelectedOrganizer] = useState('');
  const [selectedHighlighted, setSelectedHighlighted] = useState<string>('all');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableOrganizers, setAvailableOrganizers] = useState<Array<{ id: string; name: string }>>([]);

  // ✅ MESES DEL AÑO
  const months = [
    { value: '', label: 'Todos los meses' },
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  // Cargar ciudades disponibles según el país seleccionado
  useEffect(() => {
    const loadCities = async () => {
      try {
        const params: any = { limit: 1000 };
        if (selectedCountry) {
          params.country = selectedCountry;
        }

        const response = await eventsService.getAll(params);
        const events = response.data || [];

        // Extraer ciudades únicas
        const cities = [...new Set(events.map(event => event.city).filter(Boolean))].sort();
        setAvailableCities(cities as string[]);
      } catch (error) {
        console.error('Error loading cities:', error);
        setAvailableCities([]);
      }
    };

    if (showCityFilter) {
      loadCities();
    }
  }, [selectedCountry, showCityFilter]);

  // Cargar organizadores disponibles para el filtro de admin
  useEffect(() => {
    const loadOrganizers = async () => {
      try {
        const response = await organizersService.getAll({ status: 'PUBLISHED', limit: 1000 });
        setAvailableOrganizers(response.data.map(org => ({ id: org.id, name: org.name })));
      } catch (error) {
        console.error('Error loading organizers:', error);
        setAvailableOrganizers([]);
      }
    };

    if (showOrganizerFilter) {
      loadOrganizers();
    }
  }, [showOrganizerFilter]);

  // ✅ CRÍTICO: NO hacer debounce aquí - ya se hace en EventList
  const handleSearchChange = useCallback((value: string) => {
    onSearch(value);  // Llamar directamente
  }, [onSearch]);

  // Handler para país
  const handleCountryChange = useCallback((countryCode: string) => {
    onFilterCountry(countryCode);  // EventList manejará el estado y limpiará la ciudad
  }, [onFilterCountry]);

  // Handler para ciudad
  const handleCityChange = useCallback((city: string) => {
    if (onFilterCity) {
      onFilterCity(city);
    }
  }, [onFilterCity]);

  // Handler para mes
  const handleMonthChange = useCallback((month: string) => {
    setSelectedMonth(month);
    if (onFilterMonth) {
      onFilterMonth(month);
    }
  }, [onFilterMonth]);

  // Handler para status (gestión)
  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    if (onFilterStatus) {
      onFilterStatus(status);
    }
  }, [onFilterStatus]);

  // Handler para organizador (admin)
  const handleOrganizerChange = useCallback((organizerId: string) => {
    setSelectedOrganizer(organizerId);
    if (onFilterOrganizer) {
      onFilterOrganizer(organizerId);
    }
  }, [onFilterOrganizer]);

  // Handler para highlighted
  const handleHighlightedChange = useCallback((value: string) => {
    setSelectedHighlighted(value);
    
    if (onFilterHighlighted) {
      if (value === 'all') {
        onFilterHighlighted(null);
      } else {
        onFilterHighlighted(value === 'true');
      }
    }
  }, [onFilterHighlighted]);

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    onSearch('');
  }, [onSearch]);

  // Limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setSelectedMonth('');
    setSelectedStatus('ALL');
    setSelectedOrganizer('');
    setSelectedHighlighted('all');
    onSearch('');
    onFilterCountry('');
    if (onFilterCity) {
      onFilterCity('');
    }
    if (onFilterMonth) {
      onFilterMonth('');
    }
    if (onFilterStatus) {
      onFilterStatus('ALL');
    }
    if (onFilterOrganizer) {
      onFilterOrganizer('');
    }
    if (onFilterHighlighted) {
      onFilterHighlighted(null);
    }
  }, [onSearch, onFilterCountry, onFilterCity, onFilterMonth, onFilterStatus, onFilterOrganizer, onFilterHighlighted]);

  const hasActiveFilters = searchValue || selectedCountry || selectedCity || selectedMonth || selectedStatus !== 'ALL' || selectedOrganizer || selectedHighlighted !== 'all';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* ✅ CRÍTICO: Input controlado desde fuera */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar eventos por nombre o ubicación..."
            value={searchValue}  // ✅ Valor controlado
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={isLoading}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Toggle Button (Mobile) */}
        <button
          onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          className="md:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-5 w-5" />
          Filtros
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {[searchValue, selectedCountry, selectedCity, selectedMonth, selectedHighlighted !== 'all'].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Controls */}
      <div className={`${showFiltersPanel ? 'block' : 'hidden'} md:block mt-4`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Country Filter con CountrySelect */}
          {showCountryFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <CountrySelect
                value={selectedCountry}
                onChange={handleCountryChange}
                showAllOption={true}
                disabled={isLoading}
              />
            </div>
          )}

          {/* City Filter */}
          {showCityFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Ciudad {availableCities.length > 0 && `(${availableCities.length})`}
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                disabled={availableCities.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {availableCities.length === 0 ? 'Cargando ciudades...' : 'Todas las ciudades'}
                </option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter (para gestión) */}
          {showStatusFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="ALL">Todos los estados</option>
                <option value="PUBLISHED">Publicados</option>
                <option value="DRAFT">Borradores</option>
                <option value="CANCELLED">Cancelados</option>
              </select>
            </div>
          )}

          {/* Month Filter (para páginas públicas) */}
          {showMonthFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Mes del evento
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Organizer Filter (para admin) */}
          {showOrganizerFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                Organizador
              </label>
              <select
                value={selectedOrganizer}
                onChange={(e) => handleOrganizerChange(e.target.value)}
                disabled={isLoading || availableOrganizers.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {availableOrganizers.length === 0 ? 'Cargando...' : 'Todos los organizadores'}
                </option>
                {availableOrganizers.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Highlighted Filter */}
          {showHighlightedFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destacados
              </label>
              <select
                value={selectedHighlighted}
                onChange={(e) => handleHighlightedChange(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="all">Todos los eventos</option>
                <option value="true">Solo destacados</option>
                <option value="false">No destacados</option>
              </select>
            </div>
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearAllFilters}
                disabled={isLoading}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          Cargando eventos...
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 📝 CAMBIOS CRÍTICOS vs VERSIÓN ANTERIOR
// ============================================================================
/*
✅ CAMBIOS APLICADOS:

1. BÚSQUEDA CONTROLADA (CRÍTICO):
   - searchValue como prop (valor controlado desde EventList)
   - NO hacer debounce aquí (ya se hace en EventList)
   - Llamar onSearch directamente sin setTimeout
   - Esto previene la pérdida de foco

2. FILTRO DE MES:
   - selectedMonth en lugar de selectedStatus
   - onFilterMonth en lugar de onFilterStatus
   - Array de meses (Enero-Diciembre)
   - Icono Calendar para mejor UX

3. CLEAR FILTERS:
   - Actualizado para limpiar selectedMonth
   - Actualizado para usar searchValue en hasActiveFilters

4. MOBILE BADGE:
   - Actualizado para contar selectedMonth en lugar de selectedStatus

COMPATIBILIDAD:
✅ Compatible con EventList-FIXED.tsx
✅ Búsqueda no pierde foco
✅ Filtros sincronizados correctamente
✅ Loading states manejados
*/
