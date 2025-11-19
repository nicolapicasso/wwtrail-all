// components/forms/ServiceForm.tsx
// Formulario reutilizable para CREAR y EDITAR servicios

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import servicesService from '@/lib/api/v2/services.service';
import serviceCategoriesService from '@/lib/api/v2/serviceCategories.service';
import { ServiceCategory } from '@/types/v2';
import { ArrowLeft, MapPin, Save, Loader2, Tag } from 'lucide-react';
import CountrySelect from '@/components/CountrySelect';
import FileUpload from '@/components/FileUpload';
import { normalizeImageUrl } from '@/lib/utils/imageUrl';

interface ServiceFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  serviceId?: string;
}

export default function ServiceForm({ mode, initialData, serviceId }: ServiceFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    categoryId: initialData?.categoryId || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
    description: initialData?.description || '',
    latitude: initialData?.latitude?.toString() || '',
    longitude: initialData?.longitude?.toString() || '',
    logoUrl: initialData?.logoUrl || '',
    coverImage: initialData?.coverImage || '',
    gallery: initialData?.gallery || [],
    featured: initialData?.featured || false,
    status: initialData?.status || 'DRAFT',
  });

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await serviceCategoriesService.getAll();
        setCategories(cats);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (value: string) => {
    const newSlug = generateSlug(value);
    setFormData({
      ...formData,
      name: value,
      slug: newSlug,
    });
  };

  // Get coordinates from city and country
  const handleGetCoordinates = async () => {
    if (!formData.city || !formData.country) {
      setError('Por favor, introduce ciudad y país primero');
      return;
    }

    setGeocoding(true);
    setError(null);

    try {
      const query = `${formData.city}, ${formData.country}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData({
          ...formData,
          latitude: lat,
          longitude: lon,
        });
      } else {
        setError('No se encontraron coordenadas para esta ubicación');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Error al obtener coordenadas');
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        name: formData.name,
        categoryId: formData.categoryId || undefined,
        city: formData.city,
        country: formData.country,
        description: formData.description || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        logoUrl: formData.logoUrl || undefined,
        coverImage: formData.coverImage || undefined,
        gallery: formData.gallery.length > 0 ? formData.gallery : undefined,
        featured: formData.featured,
        status: formData.status,
      };

      if (mode === 'edit' && serviceId) {
        await servicesService.update(serviceId, data);
        router.push(`/organizer/services`);
      } else {
        const result = await servicesService.create(data);
        router.push(`/organizer/services`);
      }
    } catch (err: any) {
      console.error('Error saving service:', err);
      setError(err.response?.data?.message || 'Error al guardar el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Crear Servicio' : 'Editar Servicio'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === 'create'
              ? 'Añade un nuevo servicio (alojamiento, restaurante, tienda, etc.)'
              : 'Modifica los datos del servicio'
            }
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Información Básica</h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Ej: Hotel Mountain View"
              />
            </div>

            {/* Slug (read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                URL (generada automáticamente)
              </label>
              <input
                type="text"
                value={formData.slug}
                readOnly
                className="w-full rounded-md border border-input bg-muted px-3 py-2 text-muted-foreground"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Categoría
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Sin categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              {(user?.role === 'ADMIN' || user?.role === 'ORGANIZER') && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Puedes gestionar las categorías desde{' '}
                  <a href="/organizer/services/categories" className="text-blue-600 hover:underline">
                    Categorías
                  </a>
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="DRAFT">Borrador</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Los servicios en borrador no son visibles públicamente
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Describe el servicio..."
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación
          </h2>

          <div className="space-y-4">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium mb-2">
                País *
              </label>
              <CountrySelect
                value={formData.country}
                onChange={(value) => setFormData({ ...formData, country: value })}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Ciudad *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Ej: Chamonix"
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Latitud
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="45.8992"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Longitud
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="6.8701"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGetCoordinates}
                  disabled={geocoding || !formData.city || !formData.country}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {geocoding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Obteniendo...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4" />
                      Obtener coords
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Imágenes</h2>

          <div className="space-y-4">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Logo
              </label>
              <FileUpload
                onUpload={(url) => setFormData({ ...formData, logoUrl: url })}
                currentUrl={formData.logoUrl}
                accept="image/*"
                maxSizeMB={2}
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Imagen de Portada
              </label>
              <FileUpload
                onUpload={(url) => setFormData({ ...formData, coverImage: url })}
                currentUrl={formData.coverImage}
                accept="image/*"
                maxSizeMB={5}
              />
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Galería
              </label>
              <FileUpload
                fieldname="gallery"
                multiple={true}
                onUploadMultiple={(urls) => setFormData({ ...formData, gallery: urls })}
                currentUrls={formData.gallery}
                buttonText="Subir fotos"
                maxSizeMB={5}
                accept="image/*"
                showPreview={true}
              />
              {formData.gallery.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {formData.gallery.map((url: string, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={normalizeImageUrl(url)}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            gallery: formData.gallery.filter((_: string, i: number) => i !== index),
                          });
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Admin Only - Featured */}
        {user?.role === 'ADMIN' && (
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Opciones de Administrador</h2>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Marcar como destacado
              </label>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-input rounded-md hover:bg-accent transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {mode === 'create' ? 'Crear Servicio' : 'Guardar Cambios'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
