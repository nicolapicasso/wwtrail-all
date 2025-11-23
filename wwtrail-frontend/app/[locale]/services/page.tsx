// app/services/page.tsx - Public services listing page

'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { servicesService, serviceCategoriesService } from '@/lib/api/v2';
import { Service, ServiceCategory, ServiceFilters } from '@/types/v2';
import ServiceCard from '@/components/ServiceCard';
import { Search, Filter, MapPin, Tag, Loader2 } from 'lucide-react';

export default function ServicesPage() {
  const locale = useLocale();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  const [filters, setFilters] = useState<ServiceFilters>({
    page: 1,
    limit: 12,
    search: '',
    categoryId: '',
    country: '',
    featured: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    language: locale,
  });

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await servicesService.getAll(filters);
        setServices(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [filters]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await serviceCategoriesService.getAll();
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Servicios</h1>
          <p className="text-muted-foreground">
            Alojamientos, restaurantes, tiendas y más para tu próxima aventura
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Buscar servicios..."
                    className="w-full pl-10 pr-3 py-2 border border-input rounded-md"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Categoría
                </label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters({ ...filters, categoryId: e.target.value, page: 1 })}
                  className="w-full px-3 py-2 border border-input rounded-md"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ordenar por
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any, page: 1 })}
                  className="w-full px-3 py-2 border border-input rounded-md"
                >
                  <option value="createdAt">Más recientes</option>
                  <option value="name">Nombre</option>
                  <option value="viewCount">Más vistos</option>
                </select>
              </div>

              {/* Featured Only */}
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.featured || false}
                    onChange={(e) => setFilters({ ...filters, featured: e.target.checked || undefined, page: 1 })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">
                    Solo destacados
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : services.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {total} {total === 1 ? 'servicio encontrado' : 'servicios encontrados'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Pagination */}
            {total > filters.limit! && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                  disabled={filters.page === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                >
                  Anterior
                </button>
                <span className="px-4 py-2">
                  Página {filters.page} de {Math.ceil(total / filters.limit!)}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                  disabled={filters.page! >= Math.ceil(total / filters.limit!)}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No se encontraron servicios</h3>
            <p className="text-muted-foreground">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
