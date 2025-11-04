// app/test-v2/page.tsx - Test page for v2 API integration

'use client';

import { useState } from 'react';
import { eventsService, editionsService, competitionsService } from '@/lib/api/v2';
import { Event, Competition, Edition, EditionFull } from '@/types/v2';

export default function TestV2Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [selectedEdition, setSelectedEdition] = useState<EditionFull | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Test 1: Get Events
  const testGetEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsService.getAll({ limit: 10 });
      setEvents(response.data);
      console.log('✅ Events loaded:', response);
    } catch (err: any) {
      setError(`Error loading events: ${err.message}`);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Get Competitions for an Event
  const testGetCompetitions = async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await competitionsService.getByEvent(eventId);
      setCompetitions(data);
      console.log('✅ Competitions loaded:', data);
    } catch (err: any) {
      setError(`Error loading competitions: ${err.message}`);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test 3: Get Editions for a Competition
  const testGetEditions = async (competitionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editionsService.getByCompetition(competitionId);
      setEditions(response.data);
      console.log('✅ Editions loaded:', response);

      // Also get available years
      const years = await editionsService.getAvailableYears(competitionId);
      setAvailableYears(years);
      console.log('✅ Available years:', years);
    } catch (err: any) {
      setError(`Error loading editions: ${err.message}`);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test 4: Get Edition with Inheritance
  const testGetEditionWithInheritance = async (editionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await editionsService.getWithInheritance(editionId);
      setSelectedEdition(data);
      console.log('✅ Edition with inheritance loaded:', data);
    } catch (err: any) {
      setError(`Error loading edition: ${err.message}`);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test 5: Search Events
  const testSearchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await eventsService.search({ q: 'ultra', limit: 5 });
      console.log('✅ Search results:', results);
      alert(`Found ${results.length} events matching "ultra"`);
    } catch (err: any) {
      setError(`Error searching: ${err.message}`);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test 6: Get Featured Events
  const testGetFeatured = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsService.getFeatured(5);
      console.log('✅ Featured events:', data);
      alert(`Found ${data.length} featured events`);
    } catch (err: any) {
      setError(`Error getting featured: ${err.message}`);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">🧪 API v2 Integration Test</h1>

      {/* Loading & Error States */}
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Loading...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Test Buttons */}
      <div className="space-y-4 mb-8">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Basic Tests</h2>
          <div className="space-x-4">
            <button
              onClick={testGetEvents}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              1. Get Events
            </button>
            <button
              onClick={testSearchEvents}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              5. Search Events
            </button>
            <button
              onClick={testGetFeatured}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              6. Get Featured
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      {events.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📍 Events ({events.length})</h2>
          <div className="grid gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border p-4 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedEvent(event);
                  testGetCompetitions(event.id);
                }}
              >
                <h3 className="font-bold text-lg">{event.name}</h3>
                <p className="text-gray-600">
                  {event.city}, {event.country}
                </p>
                <p className="text-sm text-gray-500">
                  Slug: {event.slug} | Status: {event.status}
                </p>
                {selectedEvent?.id === event.id && (
                  <span className="text-green-600 font-bold">← Selected</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitions List */}
      {competitions.length > 0 && selectedEvent && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            🏃 Competitions for {selectedEvent.name} ({competitions.length})
          </h2>
          <div className="grid gap-4">
            {competitions.map((comp) => (
              <div
                key={comp.id}
                className="border p-4 rounded hover:bg-gray-50 cursor-pointer ml-8"
                onClick={() => {
                  setSelectedCompetition(comp);
                  testGetEditions(comp.id);
                }}
              >
                <h3 className="font-bold">{comp.name}</h3>
                <p className="text-gray-600">
                  Type: {comp.type} | Distance: {comp.baseDistance}km | Elevation: {comp.baseElevation}m D+
                </p>
                <p className="text-sm text-gray-500">Slug: {comp.slug}</p>
                {selectedCompetition?.id === comp.id && (
                  <span className="text-green-600 font-bold">← Selected</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editions List */}
      {editions.length > 0 && selectedCompetition && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            📅 Editions for {selectedCompetition.name} ({editions.length})
          </h2>
          {availableYears.length > 0 && (
            <p className="mb-4 text-gray-600">
              Available years: {availableYears.join(', ')}
            </p>
          )}
          <div className="grid gap-4">
            {editions.map((edition) => (
              <div
                key={edition.id}
                className="border p-4 rounded hover:bg-gray-50 cursor-pointer ml-16"
                onClick={() => testGetEditionWithInheritance(edition.id)}
              >
                <h3 className="font-bold">Edition {edition.year}</h3>
                <p className="text-gray-600">
                  {new Date(edition.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  Status: {edition.status} | Registration: {edition.registrationStatus}
                </p>
                <p className="text-sm text-gray-500">
                  Distance: {edition.distance || 'inherited'}km | 
                  Elevation: {edition.elevation || 'inherited'}m | 
                  Max: {edition.maxParticipants || 'inherited'} participants
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edition with Inheritance Details */}
      {selectedEdition && (
        <div className="mb-8 bg-green-50 border-2 border-green-500 p-6 rounded">
          <h2 className="text-2xl font-bold mb-4">
            ⭐ Edition {selectedEdition.year} WITH INHERITANCE
          </h2>
          <div className="space-y-2">
            <p>
              <strong>Event:</strong> {selectedEdition.event.name}
            </p>
            <p>
              <strong>Competition:</strong> {selectedEdition.competition.name}
            </p>
            <p>
              <strong>Year:</strong> {selectedEdition.year}
            </p>
            <p>
              <strong>Start Date:</strong>{' '}
              {new Date(selectedEdition.startDate).toLocaleDateString()}
            </p>
            <hr className="my-4" />
            <h3 className="font-bold text-lg">📊 Inherited Data:</h3>
            <p>
              <strong>Resolved Distance:</strong> {selectedEdition.resolvedDistance}km
              {!selectedEdition.distance && (
                <span className="text-green-600 ml-2">
                  (inherited from competition: {selectedEdition.competition.baseDistance}km)
                </span>
              )}
            </p>
            <p>
              <strong>Resolved Elevation:</strong> {selectedEdition.resolvedElevation}m D+
              {!selectedEdition.elevation && (
                <span className="text-green-600 ml-2">
                  (inherited from competition: {selectedEdition.competition.baseElevation}m)
                </span>
              )}
            </p>
            <p>
              <strong>Resolved Max Participants:</strong>{' '}
              {selectedEdition.resolvedMaxParticipants}
              {!selectedEdition.maxParticipants && (
                <span className="text-green-600 ml-2">
                  (inherited from competition: {selectedEdition.competition.baseMaxParticipants})
                </span>
              )}
            </p>
            <p>
              <strong>Resolved City:</strong> {selectedEdition.resolvedCity}
              {!selectedEdition.city && (
                <span className="text-green-600 ml-2">
                  (inherited from event: {selectedEdition.event.city})
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 border border-yellow-300 p-4 rounded">
        <h3 className="font-bold mb-2">📝 Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click "1. Get Events" to load events from backend</li>
          <li>Click on an event to load its competitions</li>
          <li>Click on a competition to load its editions</li>
          <li>Click on an edition to see inheritance in action ⭐</li>
          <li>Check browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  );
}
