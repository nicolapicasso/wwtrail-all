'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Calendar, MapPin } from 'lucide-react';

interface EventOption {
  id: string;
  name: string;
  city?: string;
  country?: string;
}

interface EventSelectProps {
  value: string; // ID del evento seleccionado
  onChange: (id: string) => void;
  events: EventOption[];
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  showAllOption?: boolean; // Mostrar opción "Todos los eventos"
  allOptionLabel?: string;
  isLoading?: boolean;
}

/**
 * Selector de eventos con buscador integrado
 * - Muestra nombre del evento y ubicación
 * - Buscador para encontrar rápido
 * - Mismo estilo que CountrySelect
 */
export default function EventSelect({
  value,
  onChange,
  events,
  error,
  disabled,
  placeholder = 'Selecciona un evento',
  showAllOption = true,
  allOptionLabel = 'Todos los eventos',
  isLoading = false,
}: EventSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Obtener evento seleccionado
  const selectedEvent = events.find(e => e.id === value);

  // Filtrar eventos según búsqueda
  const filteredEvents = searchQuery.trim()
    ? events.filter(event => {
        const query = searchQuery.toLowerCase();
        return (
          event.name.toLowerCase().includes(query) ||
          event.city?.toLowerCase().includes(query) ||
          event.country?.toLowerCase().includes(query)
        );
      })
    : events;

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus en el input de búsqueda al abrir
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (eventId: string) => {
    onChange(eventId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onChange('');
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón principal */}
      <button
        type="button"
        onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        className={`
          w-full flex items-center justify-between gap-2
          px-4 py-2.5 rounded-lg border
          bg-white text-left
          transition-colors
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          ${disabled || isLoading ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
          focus:outline-none focus:ring-2 focus:ring-opacity-50
        `}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-gray-500">Cargando eventos...</span>
          </div>
        ) : selectedEvent ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="font-medium text-gray-900 truncate block">{selectedEvent.name}</span>
              {(selectedEvent.city || selectedEvent.country) && (
                <span className="text-xs text-gray-500 truncate block">
                  {[selectedEvent.city, selectedEvent.country].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}

        <div className="flex items-center gap-1 flex-shrink-0">
          {selectedEvent && !disabled && !isLoading && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Buscador */}
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar evento..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Lista de eventos */}
          <div className="overflow-y-auto max-h-64">
            {/* Opción "Todos" */}
            {showAllOption && !searchQuery && (
              <button
                type="button"
                onClick={() => handleSelect('')}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5
                  hover:bg-gray-50 transition-colors text-left border-b border-gray-100
                  ${!value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                `}
              >
                <Calendar className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <div className="font-medium">{allOptionLabel}</div>
                  <div className="text-xs text-gray-500">{events.length} eventos disponibles</div>
                </div>
                {!value && (
                  <div className="text-blue-600">✓</div>
                )}
              </button>
            )}

            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => handleSelect(event.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5
                    hover:bg-gray-50 transition-colors text-left
                    ${event.id === value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                  `}
                >
                  <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{event.name}</div>
                    {(event.city || event.country) && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {[event.city, event.country].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                  {event.id === value && (
                    <div className="text-blue-600 flex-shrink-0">✓</div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                {searchQuery ? 'No se encontraron eventos' : 'No hay eventos disponibles'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
