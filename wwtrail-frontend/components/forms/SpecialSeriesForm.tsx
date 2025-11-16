// components/forms/SpecialSeriesForm.tsx
// Formulario reutilizable para CREAR y EDITAR special series

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import specialSeriesService from '@/lib/api/v2/specialSeries.service';
import { ArrowLeft, Save, Loader2, Check, X, AlertCircle, Image as ImageIcon, Share2, Sparkles } from 'lucide-react';
import CountrySelect from '@/components/CountrySelect';
import FileUpload from '@/components/FileUpload';

interface SpecialSeriesFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  specialSeriesId?: string;
}

export default function SpecialSeriesForm({ mode, initialData, specialSeriesId }: SpecialSeriesFormProps) {
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
      const result = await specialSeriesService.checkSlug(slug);

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
      setError('El nombre de la serie especial es obligatorio');
      return false;
    }
    if (!formData.country.trim()) {
      setError('El país es obligatorio');
      return false;
    }

    if (formData.slug.length >= 3 && slugValidation.isAvailable === false) {
      setError('El slug ya está en uso. Por favor, modifica el nombre de la serie.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(`📤 ${mode === 'create' ? 'CREAR' : 'ACTUALIZAR'} SPECIAL SERIES:`, formData);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const specialSeriesData = {
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
      const cleanSpecialSeriesData = Object.fromEntries(
        Object.entries(specialSeriesData).filter(([_, value]) => value !== undefined)
      );

      console.log('📤 Enviando al backend:', cleanSpecialSeriesData);

      let response;
      if (mode === 'create') {
        response = await specialSeriesService.create(cleanSpecialSeriesData);
        alert('✓ Serie especial creada exitosamente. Pendiente de aprobación por el administrador.');
      } else {
        response = await specialSeriesService.update(specialSeriesId!, cleanSpecialSeriesData);
        alert('✓ Serie especial actualizada exitosamente');
      }

      console.log('✅ Respuesta del backend:', response);

      router.push('/organizer/special-series');
    } catch (err: any) {
      console.error(`❌ Error al ${mode === 'create' ? 'crear' : 'actualizar'} special series:`, err);
      setError(err.message || `Error al ${mode === 'create' ? 'crear' : 'actualizar'} la serie especial`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {mode === 'create' ? 'Nueva Serie Especial' : 'Editar Serie Especial'}
              </h1>
              <p className="text-gray-600 mt-1">
                {mode === 'create'
                  ? 'Crea una nueva serie especial (circuito) para agrupar competiciones'
                  : 'Modifica los datos de la serie especial'}
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Serie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="UTMB World Series"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              {/* Slug - Auto generado */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL amigable)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="slug"
                    value={formData.slug}
                    readOnly
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 outline-none"
                  />
                  {slugValidation.isChecking && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                    </div>
                  )}
                  {!slugValidation.isChecking && slugValidation.isAvailable === true && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                  {!slugValidation.isChecking && slugValidation.isAvailable === false && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {slugValidation.isAvailable === true && '✓ Slug disponible'}
                  {slugValidation.isAvailable === false && '✗ Slug ya está en uso'}
                  {!slugValidation.isChecking && slugValidation.isAvailable === null && 'Se genera automáticamente del nombre'}
                </p>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  País de Origen <span className="text-red-500">*</span>
                </label>
                <CountrySelect
                  value={formData.country}
                  onChange={(value) => handleChange('country', value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  País donde se originó la serie especial
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  placeholder="Descripción de la serie especial, su historia, objetivos, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                />
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Sitio Web
                </label>
                <input
                  type="url"
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://www.ejemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Logo</h2>
            </div>

            <div>
              <FileUpload
                fieldname="logo"
                onUpload={(url) => handleChange('logoUrl', url)}
                currentUrl={formData.logoUrl}
                buttonText="Subir logo"
                maxSizeMB={2}
                accept="image/*"
                showPreview={true}
              />
              <p className="text-xs text-gray-500 mt-2">
                Logo de la serie especial (opcional). Formato recomendado: PNG con fondo transparente.
              </p>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Share2 className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Redes Sociales</h2>
            </div>

            <div className="space-y-4">
              {/* Instagram */}
              <div>
                <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  id="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  placeholder="https://www.instagram.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              {/* Facebook */}
              <div>
                <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                  placeholder="https://www.facebook.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              {/* Twitter */}
              <div>
                <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter / X
                </label>
                <input
                  type="url"
                  id="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={(e) => handleChange('twitterUrl', e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              {/* YouTube */}
              <div>
                <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube
                </label>
                <input
                  type="url"
                  id="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                  placeholder="https://www.youtube.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Info Note */}
          {mode === 'create' && user?.role !== 'ADMIN' && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Tu serie especial quedará en estado "Borrador" hasta que un administrador la apruebe. Recibirás una notificación cuando sea aprobada.
              </p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || (slugValidation.isAvailable === false)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {mode === 'create' ? 'Crear Serie Especial' : 'Guardar Cambios'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
