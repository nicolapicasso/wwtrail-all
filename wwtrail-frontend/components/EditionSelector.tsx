// components/EditionSelector.tsx - Year selector for editions

'use client';

import { useState, useEffect } from 'react';
import { useAvailableYears, useEditionByYear } from '@/hooks/useEditions';
import { Edition } from '@/types/v2';
import { Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';

interface EditionSelectorProps {
  competitionId: string;
  competitionName: string;
  initialYear?: number;
  onYearChange?: (year: number, edition: Edition | null) => void;
  className?: string;
}

export function EditionSelector({
  competitionId,
  competitionName,
  initialYear,
  onYearChange,
  className = '',
}: EditionSelectorProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(initialYear || currentYear);
  const [isOpen, setIsOpen] = useState(false);

  const { years, loading: loadingYears } = useAvailableYears(competitionId);
  const { edition, loading: loadingEdition } = useEditionByYear(competitionId, selectedYear);

  // Set initial year to latest available if not provided
  useEffect(() => {
    if (!initialYear && years.length > 0) {
      setSelectedYear(years[0]);
    }
  }, [years, initialYear]);

  // Notify parent of year change
  useEffect(() => {
    if (onYearChange && !loadingEdition) {
      onYearChange(selectedYear, edition);
    }
  }, [selectedYear, edition, loadingEdition, onYearChange]);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsOpen(false);
  };

  if (loadingYears) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-12 rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (years.length === 0) {
    return (
      <div className={`rounded-lg border border-dashed p-4 text-center ${className}`}>
        <p className="text-sm text-muted-foreground">No editions available yet</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selector Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Select edition year"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Edition</p>
              <p className="text-lg font-semibold">{selectedYear}</p>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-auto rounded-lg border bg-card shadow-lg">
              <div className="p-2">
                <p className="mb-2 px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                  Available Years ({years.length})
                </p>
                {years.map((year) => {
                  const isSelected = year === selectedYear;
                  const isCurrent = year === currentYear;
                  const isPast = year < currentYear;
                  const isFuture = year > currentYear;

                  return (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? 'bg-green-100 text-green-900'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-semibold">{year}</span>
                        {isCurrent && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            Current
                          </span>
                        )}
                        {isFuture && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                            Upcoming
                          </span>
                        )}
                        {isPast && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                            Past
                          </span>
                        )}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edition Info */}
      {loadingEdition ? (
        <div className="animate-pulse space-y-3 rounded-lg border p-4">
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
      ) : edition ? (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-2xl">{selectedYear}</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(edition.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  edition.status === 'UPCOMING'
                    ? 'bg-blue-100 text-blue-800'
                    : edition.status === 'ONGOING'
                    ? 'bg-green-100 text-green-800'
                    : edition.status === 'FINISHED'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {edition.status}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  edition.registrationStatus === 'OPEN'
                    ? 'bg-green-100 text-green-800'
                    : edition.registrationStatus === 'FULL'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {edition.registrationStatus.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-3 flex gap-4 border-t pt-3 text-sm">
            {edition.distance && (
              <div>
                <span className="text-muted-foreground">Distance:</span>
                <span className="ml-1 font-semibold">{edition.distance}km</span>
              </div>
            )}
            {edition.elevation && (
              <div>
                <span className="text-muted-foreground">Elevation:</span>
                <span className="ml-1 font-semibold">{edition.elevation}m D+</span>
              </div>
            )}
            {edition.maxParticipants && (
              <div>
                <span className="text-muted-foreground">Max:</span>
                <span className="ml-1 font-semibold">{edition.maxParticipants}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-4 text-center">
          <p className="text-sm text-muted-foreground">
            No edition data available for {selectedYear}
          </p>
        </div>
      )}
    </div>
  );
}

// Compact version for inline use
export function EditionSelectorCompact({
  competitionId,
  initialYear,
  onYearChange,
  className = '',
}: Omit<EditionSelectorProps, 'competitionName'>) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(initialYear || currentYear);

  const { years, loading } = useAvailableYears(competitionId);
  const { edition } = useEditionByYear(competitionId, selectedYear);

  useEffect(() => {
    if (!initialYear && years.length > 0) {
      setSelectedYear(years[0]);
    }
  }, [years, initialYear]);

  useEffect(() => {
    if (onYearChange) {
      onYearChange(selectedYear, edition);
    }
  }, [selectedYear, edition, onYearChange]);

  if (loading || years.length === 0) {
    return null;
  }

  return (
    <select
      value={selectedYear}
      onChange={(e) => setSelectedYear(Number(e.target.value))}
      className={`rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    >
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
}
