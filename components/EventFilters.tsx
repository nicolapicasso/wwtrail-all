// components/EventFilters.tsx - VERSIÓN FINAL INTEGRADA
// ✅ Compatible con EventList-FIXED.tsx
// ✅ Búsqueda controlada desde EventList (no pierde foco)
// ✅ Filtro de mes en lugar de status
// ✅ Country y Featured funcionando

'use client';

import { useState, useCallback } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import CountrySelect from './CountrySelect';

interface EventFiltersProps {
  searchValue?: string;  // ✅ CRÍTICO: Valor controlado desde EventList
  onSearch: (query: string) => void;
  onFilterMonth: (month: string) => void;  // ✅ CAMBIO: mes en lugar de status
  onFilterCountry: (country: string) => void;
  onFilterHighlighted?: (highlighted: boolean | null) => void;
  showCountryFilter?: boolean;
  showOrganizerFilter?: boolean;
  showHighlightedFilter?: boolean;
  isLoading?: boolean;
}

export default function EventFilters({
  searchValue = '',  // ✅ CRÍTICO: Recibir valor controlado
  onSearch,
  onFilterMonth,  // ✅ CAMBIO
  onFilterCountry,
  onFilterHighlighted,
  showCountryFilter = true,
  showOrganizerFilter = false,
  showHighlightedFilter = false,
  isLoading = false,
}: EventFiltersProps) {
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');  // ✅ CAMBIO
  const [selectedHighlighted, setSelectedHighlighted] = useState<string>('all');

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

  // ✅ CRÍTICO: NO hacer debounce aquí - ya se hace en EventList
  const handleSearchChange = useCallback((value: string) => {
    onSearch(value);  // Llamar directamente
  }, [onSearch]);

  // Handler para país
  const handleCountryChange = useCallback((countryCode: string) => {
    setSelectedCountry(countryCode);
    onFilterCountry(countryCode);
  }, [onFilterCountry]);

  // ✅ CAMBIO: Handler para mes
  const handleMonthChange = useCallback((month: string) => {
    setSelectedMonth(month);
    onFilterMonth(month);
  }, [onFilterMonth]);

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
    setSelectedCountry('');
    setSelectedMonth('');
    setSelectedHighlighted('all');
    onSearch('');
    onFilterCountry('');
    onFilterMonth('');
    if (onFilterHighlighted) {
      onFilterHighlighted(null);
    }
  }, [onSearch, onFilterCountry, onFilterMonth, onFilterHighlighted]);

  const hasActiveFilters = searchValue || selectedCountry || selectedMonth || selectedHighlighted !== 'all';

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
              {[searchValue, selectedCountry, selectedMonth, selectedHighlighted !== 'all'].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Controls */}
      <div className={`${showFiltersPanel ? 'block' : 'hidden'} md:block mt-4`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
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

          {/* ✅ CAMBIO: Month Filter en lugar de Status */}
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
