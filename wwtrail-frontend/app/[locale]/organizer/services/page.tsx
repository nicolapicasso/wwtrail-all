// app/organizer/services/page.tsx - Organizer services management page

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { servicesService } from '@/lib/api/v2';
import { Service } from '@/types/v2';
import ServiceCard from '@/components/ServiceCard';
import { Plus, Loader2 } from 'lucide-react';

export default function OrganizerServicesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user && (user.role === 'ORGANIZER' || user.role === 'ADMIN')) {
      fetchServices();
    }
  }, [user, loading, router]);

  const fetchServices = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Admin sees ALL services, organizer only sees their own
      if (user.role === 'ADMIN') {
        const response = await servicesService.getAll({ limit: 100 });
        setServices(response.data || []);
      } else {
        const response = await servicesService.getByOrganizer(user.id);
        setServices(response.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (serviceId: string) => {
    router.push(`/organizer/services/${serviceId}/edit`);
  };

  const handleDelete = async (serviceId: string) => {
    try {
      await servicesService.delete(serviceId);
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error al eliminar el servicio');
    }
  };

  const handleToggleFeatured = async (serviceId: string) => {
    try {
      await servicesService.toggleFeatured(serviceId);
      await fetchServices();
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Error al cambiar estado de destacado');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Acceso denegado</h2>
          <p className="text-muted-foreground">
            No tienes permiso para acceder a esta página
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {user.role === 'ADMIN' ? 'Todos los Servicios' : 'Mis Servicios'}
            </h1>
            <p className="text-muted-foreground">
              {user.role === 'ADMIN'
                ? 'Gestiona todos los servicios de la plataforma'
                : 'Gestiona tus alojamientos, restaurantes y otros servicios'}
            </p>
          </div>
          <button
            onClick={() => router.push('/organizer/services/new')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nuevo Servicio
          </button>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                managementMode
                userRole={user.role}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFeatured={user.role === 'ADMIN' ? handleToggleFeatured : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Plus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tienes servicios aún</h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primer servicio para empezar
            </p>
            <button
              onClick={() => router.push('/organizer/services/new')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear Servicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
