'use client';

import { EventCard } from '@/components/EventCard';
import { CompetitionCard } from '@/components/CompetitionCard';
import { EditionCard } from '@/components/EditionCard';
import { EditionStats } from '@/components/EditionStats';

export default function TestPage() {
  // Datos de prueba
  const mockEvent = {
    id: '1',
    slug: 'test-event',
    name: 'Test Trail Running Event',
    description: 'Este es un evento de prueba',
    city: 'Madrid',
    country: 'ES',
    coverImage: '',
    isHighlighted: true,
    status: 'PUBLISHED',
    viewCount: 100,
    firstEditionYear: 2020,
    _count: {
      competitions: 3,
    },
  };

  const mockCompetition = {
    id: '1',
    slug: 'test-competition',
    name: 'Test Trail 42K',
    description: 'Competición de prueba de 42 kilómetros',
    type: 'TRAIL',
    baseDistance: 42,
    baseElevation: 2000,
    baseMaxParticipants: 500,
    isActive: true,
    _count: {
      editions: 3,
    },
  };

  const mockEdition = {
    id: '1',
    slug: 'test-edition-2025',
    competitionId: '1',
    year: 2025,
    startDate: new Date('2025-08-29'),
    status: 'UPCOMING',
    registrationStatus: 'OPEN',
    distance: 42,
    elevation: 2000,
    maxParticipants: 500,
    currentParticipants: 150,
    city: 'Madrid',
    registrationUrl: 'https://example.com/register',
  };

  const mockStats = {
    id: '1',
    year: 2025,
    competitionName: 'Test Trail 42K',
    status: 'UPCOMING',
    registrationStatus: 'OPEN',
    totalParticipants: 150,
    totalFinishers: 0,
    totalReviews: 45,
    totalCategories: 2,
    totalResults: 0,
    averageRating: 4.5,
    viewCount: 1200,
    currentParticipants: 150,
    maxParticipants: 500,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🧪 Test de Componentes</h1>
          <p className="text-muted-foreground">
            Verifica que todos los componentes se vean correctamente
          </p>
        </div>

        {/* Test 1: EventCard */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold">1</span>
            <h2 className="text-2xl font-bold">EventCard</h2>
          </div>
          <div className="max-w-sm">
            <EventCard event={mockEvent} />
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <p className="text-sm text-green-800">
              ✅ Deberías ver: Card con imagen de fondo verde, badge "Featured", ciudad "Madrid, ES"
            </p>
          </div>
        </section>

        {/* Test 2: CompetitionCard */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold">2</span>
            <h2 className="text-2xl font-bold">CompetitionCard</h2>
          </div>
          <CompetitionCard competition={mockCompetition} />
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <p className="text-sm text-green-800">
              ✅ Deberías ver: Card con stats (Type: TRAIL, Distance: 42km, Elevation: 2000m, Max: 500), "3 editions available"
            </p>
          </div>
        </section>

        {/* Test 3: EditionCard */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold">3</span>
            <h2 className="text-2xl font-bold">EditionCard</h2>
          </div>
          <div className="max-w-md">
            <EditionCard edition={mockEdition} showInheritance={false} />
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <p className="text-sm text-green-800">
              ✅ Deberías ver: Card con año "2025", badges "UPCOMING" y "OPEN", stats de distancia y elevación, botón "Register Now"
            </p>
          </div>
        </section>

        {/* Test 4: EditionCard con herencia */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold">4</span>
            <h2 className="text-2xl font-bold">EditionCard (con herencia)</h2>
          </div>
          <div className="max-w-md">
            <EditionCard edition={mockEdition} showInheritance={true} />
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <p className="text-sm text-green-800">
              ✅ Deberías ver: Igual que antes PERO con una nota verde al final que dice "Inherited from base competition settings"
            </p>
          </div>
        </section>

        {/* Test 5: EditionStats */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold">5</span>
            <h2 className="text-2xl font-bold">EditionStats</h2>
          </div>
          <EditionStats stats={mockStats} />
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <p className="text-sm text-green-800">
              ✅ Deberías ver: Rating 4.5/5 con estrellas, progress bar de registro (150/500), grid con 6 cards de estadísticas
            </p>
          </div>
        </section>

        {/* Resultado final */}
        <section className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">🎉 ¡Todos los componentes funcionan!</h2>
          <p className="text-green-100">
            Si ves las 5 secciones arriba correctamente, tus componentes están listos para usar.
          </p>
        </section>

      </div>
    </div>
  );
}