// app/organizer/events/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import eventsService from '@/lib/api/v2/events.service';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import EventForm from '@/components/forms/EventForm';
import { Button } from '@/components/ui/button';
import { GenerateTranslationsButton } from '@/components/GenerateTranslationsButton';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const eventId = params.id as string;

  // Cargar datos del evento
  useEffect(() => {
    console.log('🔄 useEffect disparado, eventId:', eventId);
    
    const loadEvent = async () => {
      try {
        console.log('📡 Iniciando carga del evento...');
        setLoading(true);
        setError(null);
        
        console.log('📞 Llamando a eventsService.getById:', eventId);
        const response = await eventsService.getById(eventId);
        
        console.log('✅ Respuesta del backend:', response);
        console.log('📦 Datos del evento:', response.data);
        
        setEvent(response.data);
        console.log('✅ Estado actualizado con el evento');
      } catch (err: any) {
        console.error('❌ Error loading event:', err);
        console.error('❌ Error message:', err.message);
        console.error('❌ Error response:', err.response);
        setError(err.message || 'Error al cargar el evento');
      } finally {
        setLoading(false);
        console.log('✅ Loading completado');
      }
    };

    if (eventId) {
      console.log('✅ EventId existe, ejecutando loadEvent');
      loadEvent();
    } else {
      console.warn('⚠️ No hay eventId');
    }
  }, [eventId]);

  // Verificar permisos
  if (event && user && event.organizerId !== user.id && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⛔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">
            No tienes permisos para editar este evento.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-gray-400 text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Evento no encontrado</h2>
          <p className="text-gray-600 mb-6">
            El evento que buscas no existe o ha sido eliminado.
          </p>
          <button
            onClick={() => router.push('/organizer/events')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver mis eventos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver
            </button>
            <div className="flex items-center gap-2">
              <GenerateTranslationsButton
                entityType="event"
                entityId={eventId}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/organizer/seo')}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Gestionar SEO
              </Button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Evento</h1>
          <p className="mt-2 text-gray-600">
            Modifica la información de tu evento
          </p>
        </div>

        {/* Formulario */}
        <EventForm
          mode="edit"
          initialData={event}
          eventId={eventId}
        />
      </div>
    </div>
  );
}
