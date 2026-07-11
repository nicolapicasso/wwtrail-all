// components/forms/OrganizerForm.tsx
// Formulario reutilizable para CREAR y EDITAR organizadores

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { organizersService } from '@/lib/api/v2';
import { ArrowLeft, Save, Loader2, Check, X, AlertCircle, Image as ImageIcon, Share2, Building2 } from 'lucide-react';
import CountrySelect from '@/components/CountrySelect';
import FileUpload from '@/components/FileUpload';

interface OrganizerFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  organizerId?: string;
}

export default function OrganizerForm({ mode, initialData, organizerId }: OrganizerFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    country: initialData?.country || '',
    website: initialData?.website || '',
    logoUrl: initialData?.logoUrl || '',
    // Redes sociales
    instagramUrl: initialData?.instagramUrl || '',
    facebookUrl: initialData?.facebookUrl || '',
    twitterUrl: initialData?.twitterUrl || '',
    youtubeUrl: initialData?.youtubeUrl || '',
  });

  // Slug validation state
  const [slugValidation, setSlugValidation] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    error: string | null;
  }>({
    isChecking: false,
    isAvailable: null,
    error: null,
  });

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

    // Validar slug solo si es creación o si cambió
    if (mode === 'create' || (mode === 'edit' && newSlug !== initialData?.slug)) {
      if (newSlug.length >= 3) {
        validateSlug(newSlug);
      } else {
        setSlugValidation({
          isChecking: false,
          isAvailable: null,
          error: null,
        });
      }
    }
  };

  const validateSlug = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugValidation({
        isChecking: false,
        isAvailable: null,
        error: null,
      });
      return;
    }

    // Si estamos editando y el slug no cambió, no validar
    if (mode === 'edit' && slug === initialData?.slug) {
      setSlugValidation({
        isChecking: false,
        isAvailable: true,
        error: null,
      });
      return;
    }

    setSlugValidation({
      isChecking: true,
      isAvailable: null,
      error: null,
    });

    try {
      const result = await organizersService.checkSlug(slug);

      setSlugValidation({
        isChecking: false,
        isAvailable: result.available,
        error: null,
      });
    } catch (err: any) {
      console.error('Error checking slug:', err);
      setSlugValidation({
        isChecking: false,
        isAvailable: null,
        error: 'Error al verificar disponibilidad',
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre del organizador es obligatorio');
      return false;
    }
    if (!formData.country.trim()) {
      setError('El país es obligatorio');
      return false;
    }

    if (formData.slug.length >= 3 && slugValidation.isAvailable === false) {
      setError('El slug ya está en uso. Por favor, modifica el nombre del organizador.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(`📤 ${mode === 'create' ? 'CREAR' : 'ACTUALIZAR'} ORGANIZADOR:`, formData);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const organizerData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        country: formData.country.trim(),
        website: formData.website.trim() || undefined,
        logoUrl: formData.logoUrl || undefined,
        // Redes Sociales
        instagramUrl: formData.instagramUrl.trim() || undefined,
        facebookUrl: formData.facebookUrl.trim() || undefined,
        twitterUrl: formData.twitterUrl.trim() || undefined,
        youtubeUrl: formData.youtubeUrl.trim() || undefined,
      };

      // ✅ FILTRAR campos undefined para no enviarlos al backend
      const cleanOrganizerData = Object.fromEntries(
        Object.entries(organizerData).filter(([_, value]) => value !== undefined)
      );

      console.log('📤 Enviando al backend:', cleanOrganizerData);

      let response;
      if (mode === 'create') {
        response = await organizersService.create(cleanOrganizerData);
        alert('✓ Organizador creado exitosamente');
      } else {
        response = await organizersService.update(organizerId!, cleanOrganizerData);
        alert('✓ Organizador actualizado exitosamente');
      }

      console.log('✅ Respuesta del backend:', response);

      router.push('/organizer/organizers');
    } catch (err: any) {
      console.error(`❌ Error al ${mode === 'create' ? 'crear' : 'actualizar'} organizador:`, err);
      setError(err.message || `Error al ${mode === 'create' ? 'crear' : 'actualizar'} el organizador`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Status Badge (edit mode only) */}
      {mode === 'edit' && initialData?.status && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Estado:</span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            initialData.status === 'PUBLISHED'
              ? 'bg-green-100 text-green-800'
              : initialData.status === 'DRAFT'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {initialData.status === 'PUBLISHED' ? 'Publicado' :
             initialData.status === 'DRAFT' ? 'Borrador (Pendiente aprobación)' :
             'Cancelado'}
          </span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card: Información Básica */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Información Básica</h2>
          </div>

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Organizador *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Club Deportivo Montaña"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Slug (auto-generado) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL amigable)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.slug}
                  readOnly
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 text-gray-600"
                />
                {formData.slug.length >= 3 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {slugValidation.isChecking ? (
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    ) : slugValidation.isAvailable === true ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : slugValidation.isAvailable === false ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {formData.slug.length >= 3 && slugValidation.isAvailable === false && (
                <p className="mt-1 text-sm text-red-600">
                  Este slug ya está en uso
                </p>
              )}
              {formData.slug.length >= 3 && slugValidation.isAvailable === true && (
                <p className="mt-1 text-sm text-green-600">
                  Slug disponible
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                placeholder="Describe el organizador, su historia, misión..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* País */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País *
              </label>
              <CountrySelect
                value={formData.country}
                onChange={(code) => handleChange('country', code)}
                error={!formData.country && error ? 'Selecciona un país' : undefined}
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitio Web Oficial
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://www.ejemplo.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card: Logotipo */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Logotipo</h2>
          </div>

          <div>
            <FileUpload
              fieldname="logo"
              onUpload={(url) => handleChange('logoUrl', url)}
              buttonText="Subir logotipo"
              maxSizeMB={2}
              accept="image/*"
              showPreview={true}
              initialPreview={formData.logoUrl}
            />
            {formData.logoUrl && (
              <p className="text-xs text-green-600 font-medium mt-2">
                ✓ Logo subido
              </p>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            💡 El logotipo se optimiza automáticamente. Máximo 2MB.
          </div>
        </div>

        {/* Card: Redes Sociales */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Redes Sociales</h2>
          </div>

          <div className="space-y-4">
            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </span>
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                placeholder="https://www.instagram.com/organizador"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </span>
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://www.facebook.com/organizador"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Twitter / X
                </span>
              </label>
              <input
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => handleChange('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/organizador"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </span>
              </label>
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                placeholder="https://www.youtube.com/@organizador"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            💡 Todos los campos de redes sociales son opcionales
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={
              loading ||
              (formData.slug.length >= 3 && (slugValidation.isChecking || slugValidation.isAvailable === false))
            }
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {mode === 'create' ? 'Creando...' : 'Guardando...'}
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {mode === 'create' ? 'Crear Organizador' : 'Guardar Cambios'}
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
