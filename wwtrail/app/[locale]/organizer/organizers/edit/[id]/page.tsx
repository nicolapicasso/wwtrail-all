// app/organizer/organizers/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { organizersService } from '@/lib/api/v2';
import { ArrowLeft, Loader2 } from 'lucide-react';
import OrganizerForm from '@/components/forms/OrganizerForm';

export default function EditOrganizerPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [organizer, setOrganizer] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const organizerId = params.id as string;

  // Cargar datos del organizador
  useEffect(() => {
    const loadOrganizer = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await organizersService.getById(organizerId);
        setOrganizer(data);
      } catch (err: any) {
        console.error('❌ Error loading organizer:', err);
        setError(err.message || 'Error al cargar el organizador');
      } finally {
        setLoading(false);
      }
    };

    if (organizerId) {
      loadOrganizer();
    }
  }, [organizerId]);

  // Verificar permisos (solo creador o ADMIN pueden editar)
  if (organizer && user && organizer.createdById !== user.id && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⛔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">
            No tienes permisos para editar este organizador.
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
          <p className="text-gray-600">Cargando organizador...</p>
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

  if (!organizer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-gray-400 text-5xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No encontrado</h2>
          <p className="text-gray-600 mb-6">
            El organizador no existe o no tienes permisos para verlo.
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Editar Organizador</h1>
          <p className="mt-2 text-gray-600">
            Actualiza la información del organizador
          </p>
        </div>

        {/* Form */}
        <OrganizerForm mode="edit" initialData={organizer} organizerId={organizerId} />
      </div>
    </div>
  );
}
