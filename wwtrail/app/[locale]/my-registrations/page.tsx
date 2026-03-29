'use client';

import { useUserCompetitions } from '@/hooks/useUserCompetitions';
import Link from 'next/link';

export default function MyRegistrationsPage() {
  const { competitions, loading, error } = useUserCompetitions();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header verde */}
      <div className="bg-green-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">
            Competiciones de Trail Running
          </h1>
          <p className="text-green-100">
            Descubre las mejores carreras de montaña
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Buscador (opcional - puedes añadirlo después) */}
        <div className="mb-6">
          <input 
            type="text"
            placeholder="Buscar competiciones..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Contador */}
        <p className="text-gray-600 mb-4">
          {loading ? 'Cargando...' : `${competitions.length} competiciones encontradas`}
        </p>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando tus competiciones...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && competitions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg mb-4">
              No se encontraron competiciones con estos filtros. Prueba con otros criterios.
            </p>
            <Link 
              href="/competitions"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Explorar todas las competiciones
            </Link>
          </div>
        )}

        {/* Lista de competiciones */}
        {!loading && !error && competitions.length > 0 && (
          <div className="space-y-4">
            {competitions.map((uc) => (
              <div 
                key={uc.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start">
                  {/* Información de la competición */}
                  <div className="flex-1">
                    <Link
                      href={
                        uc.competition.event?.slug
                          ? `/events/${uc.competition.event.slug}/${uc.competition.slug}`
                          : `/competitions/${uc.competition.slug}`
                      }
                      className="text-xl font-bold text-gray-900 hover:text-green-600 transition"
                    >
                      {uc.competition.name}
                    </Link>
                    
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        📍 {uc.competition.city}, {uc.competition.country}
                      </span>
                      <span className="flex items-center gap-1">
                        📅 {new Date(uc.competition.startDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {uc.competition.distance && (
                        <span className="flex items-center gap-1">
                          📏 {uc.competition.distance} km
                        </span>
                      )}
                      {uc.competition.elevation && (
                        <span className="flex items-center gap-1">
                          ⛰️ {uc.competition.elevation}m D+
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badge de estado */}
                  <div className="ml-4">
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
                      ${uc.status === 'INTERESTED' ? 'bg-blue-100 text-blue-800' : ''}
                      ${uc.status === 'REGISTERED' ? 'bg-green-100 text-green-800' : ''}
                      ${uc.status === 'CONFIRMED' ? 'bg-green-200 text-green-900' : ''}
                      ${uc.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' : ''}
                      ${uc.status === 'DNF' ? 'bg-orange-100 text-orange-800' : ''}
                      ${uc.status === 'DNS' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {uc.status === 'INTERESTED' && '⭐ Me interesa'}
                      {uc.status === 'REGISTERED' && '✅ Inscrito'}
                      {uc.status === 'CONFIRMED' && '✅ Confirmado'}
                      {uc.status === 'COMPLETED' && '🏁 Completado'}
                      {uc.status === 'DNF' && '⚠️ No terminé'}
                      {uc.status === 'DNS' && '❌ No participé'}
                    </span>
                  </div>
                </div>

                {/* Si está completado, mostrar resultados */}
                {uc.status === 'COMPLETED' && (uc.finishTime || uc.position) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-6 text-sm">
                      {uc.finishTime && (
                        <div>
                          <span className="text-gray-600">⏱️ Tiempo:</span>
                          <span className="ml-2 font-semibold text-green-600">{uc.finishTime}</span>
                        </div>
                      )}
                      {uc.position && (
                        <div>
                          <span className="text-gray-600">🏆 Posición:</span>
                          <span className="ml-2 font-semibold">#{uc.position}</span>
                        </div>
                      )}
                      {uc.categoryPosition && (
                        <div>
                          <span className="text-gray-600">📊 En categoría:</span>
                          <span className="ml-2 font-semibold">#{uc.categoryPosition}</span>
                        </div>
                      )}
                      {uc.personalRating && (
                        <div>
                          <span className="text-gray-600">⭐ Valoración:</span>
                          <span className="ml-2">{'⭐'.repeat(uc.personalRating)}</span>
                        </div>
                      )}
                    </div>
                    
                    {uc.notes && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 italic">"{uc.notes}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
