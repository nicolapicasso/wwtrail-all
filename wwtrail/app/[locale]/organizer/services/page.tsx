// app/organizer/services/page.tsx - Organizer services management page

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { servicesService, serviceCategoriesService } from '@/lib/api/v2';
import { Service, ServiceCategory } from '@/types/v2';
import ServiceCard from '@/components/ServiceCard';
import { Plus, Loader2, Search, Star, Package, FileCheck, FileClock } from 'lucide-react';

export default function OrganizerServicesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Get unique countries from services
  const countries = useMemo(() => {
    const countrySet = new Set(services.map(s => s.country).filter(Boolean));
    return Array.from(countrySet).sort();
  }, [services]);

  // Filter services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Search filter
      if (searchQuery && !service.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Country filter
      if (selectedCountry && service.country !== selectedCountry) {
        return false;
      }
      // Category filter
      if (selectedCategory && service.categoryId !== selectedCategory) {
        return false;
      }
      // Featured filter
      if (featuredOnly && !service.featured) {
        return false;
      }
      return true;
    });
  }, [services, searchQuery, selectedCountry, selectedCategory, featuredOnly]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: filteredServices.length,
      published: filteredServices.filter(s => s.status === 'PUBLISHED').length,
      draft: filteredServices.filter(s => s.status === 'DRAFT').length,
    };
  }, [filteredServices]);

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
      // Fetch categories
      const cats = await serviceCategoriesService.getAll();
      setCategories(cats);

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

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Country Filter */}
            <div>
              <label htmlFor="country-filter" className="block text-sm font-medium text-gray-700 mb-2">
                País
              </label>
              <select
                id="country-filter"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Todos los países</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nombre del servicio..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Featured Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destacados
              </label>
              <button
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                  featuredOnly
                    ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Star className={`h-4 w-4 ${featuredOnly ? 'fill-yellow-500' : ''}`} />
                {featuredOnly ? 'Solo destacados' : 'Todos'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <FileClock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Publicados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
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
            <h3 className="text-xl font-semibold mb-2">
              {services.length === 0 ? 'No tienes servicios aún' : 'No se encontraron servicios'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {services.length === 0
                ? 'Crea tu primer servicio para empezar'
                : 'Prueba a cambiar los filtros de búsqueda'}
            </p>
            {services.length === 0 && (
              <button
                onClick={() => router.push('/organizer/services/new')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Crear Servicio
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
