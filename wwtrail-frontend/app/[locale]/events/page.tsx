// app/events/page.tsx - Enhanced Events listing page with rich visuals
// FIXED VERSION - Todos los problemas corregidos

'use client';

import { useState } from 'react';
import { MapPin, Calendar, Users, Mountain, Search, Filter, Globe, Star } from 'lucide-react';
import { EventList } from '@/components/EventList';

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Featured Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
          </div>
          {/*
            FIX #4: Agregar EventList con featuredOnly
            - Mostrar solo 6 eventos destacados en modo grid
            - Sin filtros visibles (showFilters={false})
            - Modo simplificado: solo imagen + logo
          */}
          <EventList
            viewMode="grid"
            featuredOnly={true}
            showFilters={false}
            limit={6}
            simplified={true}
          />
        </div>

        {/* All Events Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">All Events</h2>
              <p className="text-gray-600">Browse through all trail running events</p>
            </div>
            
            {/* View Toggle - FIX #3: Asegurar que funciona */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-pressed={viewMode === 'grid'}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-pressed={viewMode === 'list'}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* 
          Events list with filters 
          FIX #1: Los filtros están dentro de EventList
          FIX #3: Pasar viewMode correctamente
        */}
        <EventList 
          viewMode={viewMode} 
          showFilters={true}
        />
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Organize Your Own Event?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of organizers sharing their trail running events on WWTRAIL
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Become an Organizer
          </button>
        </div>
      </div>
    </div>
  );
}
