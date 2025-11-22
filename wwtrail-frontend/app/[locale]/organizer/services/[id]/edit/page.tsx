// app/organizer/services/[id]/edit/page.tsx - Edit service page

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { servicesService } from '@/lib/api/v2';
import { Service } from '@/types/v2';
import ServiceForm from '@/components/forms/ServiceForm';
import { Loader2 } from 'lucide-react';

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serviceId = params?.id as string;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user && serviceId) {
      fetchService();
    }
  }, [user, loading, serviceId, router]);

  const fetchService = async () => {
    try {
      const response = await servicesService.getById(serviceId);
      const fetchedService = response.data;

      // Verify ownership
      if (user && fetchedService.organizerId !== user.id && user.role !== 'ADMIN') {
        setError('No tienes permiso para editar este servicio');
        return;
      }

      setService(fetchedService);
    } catch (err: any) {
      console.error('Error fetching service:', err);
      setError(err.response?.data?.message || 'Error al cargar el servicio');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error || 'Servicio no encontrado'}</p>
          <button
            onClick={() => router.push('/organizer/services')}
            className="text-blue-600 hover:underline"
          >
            Volver a Mis Servicios
          </button>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ServiceForm mode="edit" initialData={service} serviceId={serviceId} />
      </div>
    </div>
  );
}
