// components/forms/EventForm.tsx
// Formulario reutilizable para CREAR y EDITAR eventos

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import eventsService from '@/lib/api/v2/events.service';
import { organizersService } from '@/lib/api/v2';
import { ArrowLeft, MapPin, Calendar, Save, Loader2, Check, X, AlertCircle, Image as ImageIcon, Share2, Building2, Sparkles, ExternalLink, Download } from 'lucide-react';
import CountrySelect from '@/components/CountrySelect';
import FileUpload from '@/components/FileUpload';
import aiAutofillService from '@/lib/api/v2/aiAutofill.service';
import type { EventAutoFillResult, SuggestedImage } from '@/lib/api/v2/aiAutofill.service';
import { ImageImportSelector } from '@/components/ImageImportSelector';

interface EventFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  eventId?: string;
}

export default function EventForm({ mode, initialData, eventId }: EventFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizers, setOrganizers] = useState<Array<{ id: string; name: string }>>([]);

  // Form state - inicializar con datos existentes si es modo edición
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
    description: initialData?.description || '',
    website: initialData?.websiteUrl || initialData?.website || '',
    typicalMonth: initialData?.typicalMonth?.toString() || '',
    firstEditionYear: initialData?.firstEditionYear?.toString() || new Date().getFullYear().toString(),
    latitude: initialData?.latitude?.toString() || '',
    longitude: initialData?.longitude?.toString() || '',
    logoUrl: initialData?.logoUrl || initialData?.logo || '',
    coverImage: initialData?.coverImageUrl || initialData?.coverImage || '',
    gallery: initialData?.images || initialData?.gallery || [],
    featured: initialData?.featured || initialData?.isFeatured || false,
    organizerId: initialData?.organizerId || '',
    // Redes sociales
    instagramUrl: initialData?.instagramUrl || '',
    facebookUrl: initialData?.facebookUrl || '',
    twitterUrl: initialData?.twitterUrl || '',
    youtubeUrl: initialData?.youtubeUrl || '',
  });

  // AI auto-fill state
  const [aiUrl, setAiUrl] = useState(initialData?.websiteUrl || initialData?.website || '');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<EventAutoFillResult | null>(null);
  const [suggestedImages, setSuggestedImages] = useState<SuggestedImage[]>([]);
  const [showImageSuggestions, setShowImageSuggestions] = useState(false);

  // AI auto-fill handler
  const handleAiAutofill = async () => {
    if (!aiUrl.trim()) {
      setError('Introduce la URL del evento para usar el auto-relleno con IA');
      return;
    }

    try {
      setAiLoading(true);
      setError(null);

      const result = await aiAutofillService.autofillEvent(aiUrl.trim());
      setAiResult(result);

      // Auto-rellenar campos vacíos con los datos de la IA
      setFormData(prev => ({
        ...prev,
        name: prev.name || result.name || prev.name,
        description: prev.description || result.description || prev.description,
        city: prev.city || result.city || prev.city,
        country: prev.country || result.country || prev.country,
        website: prev.website || result.website || aiUrl.trim(),
        typicalMonth: prev.typicalMonth || (result.typicalMonth?.toString() || prev.typicalMonth),
        firstEditionYear: prev.firstEditionYear || (result.firstEditionYear?.toString() || prev.firstEditionYear),
        instagramUrl: prev.instagramUrl || result.instagramUrl || prev.instagramUrl,
        facebookUrl: prev.facebookUrl || result.facebookUrl || prev.facebookUrl,
        twitterUrl: prev.twitterUrl || result.twitterUrl || prev.twitterUrl,
        youtubeUrl: prev.youtubeUrl || result.youtubeUrl || prev.youtubeUrl,
      }));

      // Si hay slug vacío, generarlo del nombre
      if (!formData.slug && result.name) {
        const newSlug = generateSlug(result.name);
        setFormData(prev => ({ ...prev, slug: newSlug }));
        if (newSlug.length >= 3) {
          validateSlug(newSlug);
        }
      }

      // Guardar imágenes sugeridas
      if (result.suggestedImages && result.suggestedImages.length > 0) {
        setSuggestedImages(result.suggestedImages);
        setShowImageSuggestions(true);
      }

      alert(`Auto-relleno completado. Se encontraron ${Object.keys(result).filter(k => result[k as keyof EventAutoFillResult]).length} campos${result.competitions?.length ? ` y ${result.competitions.length} competiciones` : ''}.`);
    } catch (err: any) {
      console.error('AI autofill error:', err);
      setError(err.response?.data?.error || err.message || 'Error al analizar la URL con IA');
    } finally {
      setAiLoading(false);
    }
  };

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

  // Load organizers list on mount
  useEffect(() => {
    const loadOrganizers = async () => {
      try {
        // Get all organizers (limit: 1000 to ensure we get all)
        const response = await organizersService.getAll({ status: 'PUBLISHED', limit: 1000 });
        setOrganizers(response.data.map(org => ({ id: org.id, name: org.name })));
      } catch (error) {
        console.error('Error loading organizers:', error);
      }
    };
    loadOrganizers();
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
      if (!eventsService || typeof eventsService.checkSlug !== 'function') {
        console.error('eventsService.checkSlug no está disponible');
        setSlugValidation({
          isChecking: false,
          isAvailable: null,
          error: 'Error al validar slug',
        });
        return;
      }

      const result = await eventsService.checkSlug(slug);
      
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

  // Geocoding con Nominatim
  const handleGeocoding = async () => {
    if (!formData.city.trim() || !formData.country.trim()) {
      setError('Por favor, rellena ciudad y país antes de buscar coordenadas');
      return;
    }

    try {
      setGeocoding(true);
      setError(null);

      const query = `${formData.city}, ${formData.country}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}` +
        `&format=json` +
        `&limit=1`,
        {
          headers: {
            'User-Agent': 'WWTRAIL/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al buscar coordenadas');
      }

      const data = await response.json();

      if (data.length === 0) {
        setError(`No se encontraron coordenadas para "${query}". Por favor, ingrésalas manualmente.`);
        return;
      }

      setFormData({
        ...formData,
        latitude: parseFloat(data[0].lat).toFixed(6),
        longitude: parseFloat(data[0].lon).toFixed(6),
      });

      alert(`✓ Coordenadas encontradas:\n${data[0].display_name}`);
    } catch (err: any) {
      console.error('Geocoding error:', err);
      setError('Error al buscar coordenadas. Ingrésalas manualmente.');
    } finally {
      setGeocoding(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre del evento es obligatorio');
      return false;
    }
    if (!formData.city.trim()) {
      setError('La ciudad es obligatoria');
      return false;
    }
    if (!formData.country.trim()) {
      setError('El país es obligatorio');
      return false;
    }
    if (!formData.firstEditionYear || parseInt(formData.firstEditionYear) < 1900) {
      setError('El año de primera edición debe ser válido (mayor a 1900)');
      return false;
    }
    if (formData.latitude && (parseFloat(formData.latitude) < -90 || parseFloat(formData.latitude) > 90)) {
      setError('La latitud debe estar entre -90 y 90');
      return false;
    }
    if (formData.longitude && (parseFloat(formData.longitude) < -180 || parseFloat(formData.longitude) > 180)) {
      setError('La longitud debe estar entre -180 y 180');
      return false;
    }
    
    if (formData.slug.length >= 3 && slugValidation.isAvailable === false) {
      setError('El slug ya está en uso. Por favor, modifica el nombre del evento.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log(`📤 ${mode === 'create' ? 'CREAR' : 'ACTUALIZAR'} EVENTO:`, formData);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const eventData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
        city: formData.city.trim(),
        country: formData.country.trim(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        websiteUrl: formData.website.trim() || undefined,
        firstEditionYear: parseInt(formData.firstEditionYear),
        typicalMonth: formData.typicalMonth ? parseInt(formData.typicalMonth) : undefined,
        logoUrl: formData.logoUrl || undefined,
        coverImageUrl: formData.coverImage || undefined,
        images: formData.gallery.length > 0 ? formData.gallery : undefined,
        featured: formData.featured,
        organizerId: formData.organizerId || undefined,
        // Redes Sociales
        instagramUrl: formData.instagramUrl.trim() || undefined,
        facebookUrl: formData.facebookUrl.trim() || undefined,
        twitterUrl: formData.twitterUrl.trim() || undefined,
        youtubeUrl: formData.youtubeUrl.trim() || undefined,
      };

      // ✅ FILTRAR campos undefined para no enviarlos al backend
      const cleanEventData = Object.fromEntries(
        Object.entries(eventData).filter(([_, value]) => value !== undefined)
      );

      console.log('📤 Enviando al backend:', cleanEventData);

      let response;
      if (mode === 'create') {
        response = await eventsService.create(cleanEventData);
        alert('✓ Evento creado exitosamente');
      } else {
        response = await eventsService.update(eventId!, cleanEventData);
        alert('✓ Evento actualizado exitosamente');
      }

      console.log('✅ Respuesta del backend:', response);

      router.push('/organizer/events');
    } catch (err: any) {
      console.error(`❌ Error al ${mode === 'create' ? 'crear' : 'actualizar'} evento:`, err);
      setError(err.message || `Error al ${mode === 'create' ? 'crear' : 'actualizar'} el evento`);
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card: Auto-relleno con IA */}
        <div className="rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-6 shadow-sm border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-purple-900">Auto-relleno con IA</h2>
          </div>
          <p className="text-sm text-purple-700 mb-4">
            Introduce la URL de la web del evento y la IA rellenará automáticamente los campos posibles.
          </p>

          <div className="flex gap-2">
            <input
              type="url"
              value={aiUrl}
              onChange={(e) => setAiUrl(e.target.value)}
              placeholder="https://www.ejemplo-evento.com"
              className="flex-1 rounded-lg border border-purple-300 px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
            />
            <button
              type="button"
              onClick={handleAiAutofill}
              disabled={aiLoading || !aiUrl.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analizar con IA
                </>
              )}
            </button>
          </div>

          {aiLoading && (
            <div className="mt-3 p-3 bg-purple-100 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-800 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                La IA está analizando la web del evento. Esto puede tardar unos segundos...
              </p>
            </div>
          )}

          {aiResult && !aiLoading && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                Auto-relleno completado. Revisa los campos y ajusta lo que necesites.
              </p>
              {aiResult.competitions && aiResult.competitions.length > 0 && (
                <p className="text-sm text-green-700 mt-1">
                  Se detectaron {aiResult.competitions.length} competiciones. Podrás crearlas después de guardar el evento.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Imágenes sugeridas por la IA — selector interactivo */}
        {showImageSuggestions && suggestedImages.length > 0 && (
          <ImageImportSelector
            images={suggestedImages}
            onImport={({ logoUrl, coverImage, gallery }) => {
              setFormData(prev => ({
                ...prev,
                logoUrl: logoUrl || prev.logoUrl,
                coverImage: coverImage || prev.coverImage,
                gallery: [...(prev.gallery || []), ...gallery],
              }));
              setShowImageSuggestions(false);
            }}
            onClose={() => setShowImageSuggestions(false)}
          />
        )}

        {/* Competiciones detectadas por la IA */}
        {aiResult?.competitions && aiResult.competitions.length > 0 && (
          <div className="rounded-lg bg-blue-50 p-6 shadow-sm border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-900">Competiciones detectadas</h2>
            </div>
            <p className="text-sm text-blue-700 mb-4">
              La IA ha detectado estas competiciones en la web del evento. Podrás crearlas después de guardar el evento.
            </p>

            <div className="space-y-3">
              {aiResult.competitions.map((comp, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-blue-200 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{comp.name}</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {comp.type}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    {comp.baseDistance && <span>{comp.baseDistance} km</span>}
                    {comp.baseElevation && <span>{comp.baseElevation} m D+</span>}
                    {comp.baseMaxParticipants && <span>Max: {comp.baseMaxParticipants}</span>}
                    {comp.itraPoints !== undefined && <span>ITRA: {comp.itraPoints}</span>}
                  </div>
                  {comp.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{comp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card: Información Básica */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Evento *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Ultra Trail Mont Blanc"
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
                placeholder="Describe el evento, su historia, características principales..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card: Imágenes */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Imágenes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logotipo
              </label>
              <FileUpload
                fieldname="logo"
                onUpload={(url) => handleChange('logoUrl', url)}
                buttonText="Subir logo"
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

            {/* Cover */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de Portada
              </label>
              <FileUpload
                fieldname="cover"
                onUpload={(url) => handleChange('coverImage', url)}
                buttonText="Subir portada"
                maxSizeMB={5}
                accept="image/*"
                showPreview={true}
                initialPreview={formData.coverImage}
              />
              {formData.coverImage && (
                <p className="text-xs text-green-600 font-medium mt-2">
                  ✓ Portada subida
                </p>
              )}
            </div>

            {/* Galería */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Galería de Fotos
              </label>
              <FileUpload
                fieldname="gallery"
                multiple={true}
                onUploadMultiple={(urls) => handleChange('gallery', urls)}
                currentUrls={formData.gallery}
                buttonText="Subir fotos"
                maxSizeMB={3}
                accept="image/*"
                showPreview={true}
              />
              {formData.gallery.length > 0 && (
                <p className="text-xs text-green-600 font-medium mt-2">
                  ✓ {formData.gallery.length} fotos
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            💡 Las imágenes se optimizan automáticamente. Máximo 5MB por archivo.
          </div>
        </div>

        {/* Card: Ubicación */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Ubicación</h2>
          </div>

          <div className="space-y-4">
            {/* Ciudad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Ej: Chamonix"
                required
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

            {/* Botón Geocoding */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGeocoding}
                disabled={geocoding || !formData.city || !formData.country}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {geocoding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Buscando coordenadas...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    Buscar Coordenadas Automáticamente
                  </>
                )}
              </button>
              <p className="mt-2 text-xs text-gray-500 text-center">
                O ingrésalas manualmente abajo
              </p>
            </div>

            {/* Coordenadas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitud
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  placeholder="41.385063"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitud
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  placeholder="2.173404"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card: Información Adicional */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Información Adicional</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mes Típico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mes Típico del Evento
                </label>
                <select
                  value={formData.typicalMonth}
                  onChange={(e) => handleChange('typicalMonth', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Selecciona un mes</option>
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>

              {/* Año Primera Edición */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año Primera Edición *
                </label>
                <input
                  type="number"
                  value={formData.firstEditionYear}
                  onChange={(e) => handleChange('firstEditionYear', e.target.value)}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
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

            {/* Organizer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Entidad Organizadora (opcional)
                </span>
              </label>
              <select
                value={formData.organizerId}
                onChange={(e) => handleChange('organizerId', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Sin organizador</option>
                {organizers.map((org) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Selecciona la entidad organizadora de este evento (club, sociedad, etc.)
              </p>
            </div>
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
                placeholder="https://www.instagram.com/tu-evento"
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
                placeholder="https://www.facebook.com/tu-evento"
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
                placeholder="https://twitter.com/tu-evento"
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
                placeholder="https://www.youtube.com/@tu-evento"
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
                {mode === 'create' ? 'Crear Evento' : 'Guardar Cambios'}
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
