// components/CategorySelect.tsx
// Select con buscador para categorías con opción de crear nueva

'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  placeholder?: string;
  className?: string;
}

export default function CategorySelect({
  value,
  onChange,
  categories,
  placeholder = 'Selecciona o crea una categoría',
  className = '',
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If input is empty or just whitespace, reset to current value
        if (!inputValue.trim()) {
          setInputValue(value);
        } else if (inputValue !== value) {
          // If user typed something different, update the value
          onChange(inputValue.trim());
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputValue, value, onChange]);

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if current input is a new category
  const isNewCategory = inputValue.trim() &&
    !categories.some(cat => cat.toLowerCase() === inputValue.trim().toLowerCase());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);
    setIsOpen(true);
  };

  const handleSelectCategory = (category: string) => {
    setInputValue(category);
    onChange(category);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleCreateNew = () => {
    const newCategory = inputValue.trim();
    if (newCategory) {
      onChange(newCategory);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm(inputValue);
  };

  const handleInputBlur = () => {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      if (!inputValue.trim()) {
        setInputValue(value);
      } else if (inputValue !== value) {
        onChange(inputValue.trim());
      }
    }, 200);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {/* Filtered categories */}
          {filteredCategories.length > 0 ? (
            <div className="py-1">
              {filteredCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleSelectCategory(category)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between ${
                    value === category ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="text-sm">{category}</span>
                  {value === category && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-2 px-3 text-sm text-muted-foreground">
              No se encontraron categorías
            </div>
          )}

          {/* Create new option */}
          {isNewCategory && inputValue.trim() && (
            <>
              <div className="border-t border-gray-200"></div>
              <button
                type="button"
                onClick={handleCreateNew}
                className="w-full text-left px-3 py-2 hover:bg-green-50 flex items-center gap-2 text-green-700 font-medium"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Crear "{inputValue.trim()}"</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Helper text */}
      {isNewCategory && !isOpen && (
        <p className="mt-1 text-xs text-green-600 font-medium">
          ✓ Nueva categoría: "{inputValue.trim()}"
        </p>
      )}
    </div>
  );
}
