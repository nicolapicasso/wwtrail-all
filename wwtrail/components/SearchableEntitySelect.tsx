'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export interface EntityOption {
  id: string;
  name: string;
  slug: string;
}

interface SearchableEntitySelectProps {
  value: string;
  onChange: (id: string) => void;
  options: EntityOption[];
  placeholder?: string;
  emptyOptionLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
}

/**
 * Selector de entidades con buscador integrado
 * - Muestra nombre y slug
 * - Permite búsqueda por nombre o slug
 * - Opción para "sin seleccionar"
 */
export default function SearchableEntitySelect({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  emptyOptionLabel = 'Sin seleccionar',
  disabled,
  loading,
  error,
}: SearchableEntitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Obtener entidad seleccionada
  const selectedEntity = options.find(e => e.id === value);

  // Filtrar opciones según búsqueda
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      e => e.name.toLowerCase().includes(query) || e.slug.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

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

  const handleSelect = (entity: EntityOption | null) => {
    onChange(entity?.id || '');
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
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={`
          w-full flex items-center justify-between gap-2
          px-4 py-2.5 rounded-lg border
          bg-white text-left
          transition-colors
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
          focus:outline-none focus:ring-2 focus:ring-opacity-50
        `}
      >
        {loading ? (
          <span className="text-gray-500">Cargando...</span>
        ) : selectedEntity ? (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{selectedEntity.name}</span>
            <span className="text-xs text-gray-500">{selectedEntity.slug}</span>
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}

        <div className="flex items-center gap-1">
          {selectedEntity && !disabled && !loading && (
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
                placeholder="Buscar por nombre o slug..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Lista de opciones */}
          <div className="overflow-y-auto max-h-64">
            {/* Opción vacía */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5
                hover:bg-gray-50 transition-colors text-left
                ${!value ? 'bg-blue-50 text-blue-700' : 'text-gray-500'}
              `}
            >
              <span className="italic">{emptyOptionLabel}</span>
              {!value && <span className="ml-auto text-blue-600">✓</span>}
            </button>

            {filteredOptions.length > 0 ? (
              filteredOptions.map((entity) => (
                <button
                  key={entity.id}
                  type="button"
                  onClick={() => handleSelect(entity)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5
                    hover:bg-gray-50 transition-colors text-left
                    ${entity.id === value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                  `}
                >
                  <div className="flex-1">
                    <div className="font-medium">{entity.name}</div>
                    <div className="text-xs text-gray-500">{entity.slug}</div>
                  </div>
                  {entity.id === value && (
                    <div className="text-blue-600">✓</div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No se encontraron resultados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
