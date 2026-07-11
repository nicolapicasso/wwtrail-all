// app/organizer/special-series/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import specialSeriesService from '@/lib/api/v2/specialSeries.service';
import SpecialSeriesForm from '@/components/forms/SpecialSeriesForm';
import { GenerateTranslationsButton } from '@/components/GenerateTranslationsButton';

export default function EditSpecialSeriesPage() {
  const params = useParams();
  const router = useRouter();
  const specialSeriesId = params?.id as string;

  const [specialSeries, setSpecialSeries] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialSeries = async () => {
      try {
        setIsLoading(true);
        const data = await specialSeriesService.getById(specialSeriesId);
        setSpecialSeries(data);
      } catch (err: any) {
        console.error('Error fetching special series:', err);
        setError(err.response?.data?.message || 'Error al cargar la serie especial');
      } finally {
        setIsLoading(false);
      }
    };

    if (specialSeriesId) {
      fetchSpecialSeries();
    }
  }, [specialSeriesId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando serie especial...</p>
        </div>
      </div>
    );
  }

  if (error || !specialSeries) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-900 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error || 'Serie especial no encontrada'}</p>
          <button
            onClick={() => router.push('/organizer/special-series')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/organizer/special-series"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Series Especiales
            </Link>
            <GenerateTranslationsButton
              entityType="special-series"
              entityId={specialSeriesId}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Serie Especial</h1>
          <p className="mt-2 text-gray-600">
            Modifica la información de la serie especial
          </p>
        </div>

        <SpecialSeriesForm
          mode="edit"
          initialData={specialSeries}
          specialSeriesId={specialSeriesId}
        />
      </div>
    </div>
  );
}
