// components/forms/CompetitionForm.tsx - Formulario reutilizable para crear/editar competiciones

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, AlertCircle, Image as ImageIcon, Tag, Globe, Sparkles, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import competitionsService from '@/lib/api/v2/competitions.service';
import specialSeriesService from '@/lib/api/v2/specialSeries.service';
import { terrainTypesService } from '@/lib/api/catalogs.service';
import aiAutofillService from '@/lib/api/v2/aiAutofill.service';
import type { CompetitionAutoFillResult, SuggestedImage } from '@/lib/api/v2/aiAutofill.service';
import type { Competition, UTMBIndex } from '@/types/competition';
import type { TerrainType, SpecialSeriesListItem } from '@/types/v2';
import { CompetitionType, Language } from '@/types/event';
import { LANGUAGE_LABELS } from '@/types/post';
import FileUpload from '@/components/FileUpload';

interface CompetitionFormProps {
  eventId: string;
  competition?: Competition; // Si existe, es modo edición
  onSuccess?: (competition: Competition) => void;
  onCancel?: () => void;
}

export default function CompetitionForm({
  eventId,
  competition,
  onSuccess,
  onCancel,
}: CompetitionFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!competition;

  // AI auto-fill state
  const [aiUrl, setAiUrl] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [suggestedImages, setSuggestedImages] = useState<SuggestedImage[]>([]);
  const [showImageSuggestions, setShowImageSuggestions] = useState(false);

  const handleAiAutofill = async () => {
    if (!aiUrl.trim()) {
      setError('Introduce la URL de la competición para usar el auto-relleno con IA');
      return;
    }

    try {
      setAiLoading(true);
      setError(null);

      const result = await aiAutofillService.autofillCompetition(aiUrl.trim());

      // Auto-rellenar campos vacíos
      setFormData(prev => ({
        ...prev,
        name: prev.name || result.name || prev.name,
        description: prev.description || result.description || prev.description,
        type: (result.type as CompetitionType) || prev.type,
        baseDistance: prev.baseDistance || (result.baseDistance?.toString() || prev.baseDistance),
        baseElevation: prev.baseElevation || (result.baseElevation?.toString() || prev.baseElevation),
        baseMaxParticipants: prev.baseMaxParticipants || (result.baseMaxParticipants?.toString() || prev.baseMaxParticipants),
        itraPoints: prev.itraPoints || (result.itraPoints?.toString() || prev.itraPoints),
        utmbIndex: prev.utmbIndex || result.utmbIndex || prev.utmbIndex,
      }));

      // Auto-generar slug si vacío
      if (!formData.slug && result.name) {
        setFormData(prev => ({ ...prev, slug: generateSlug(result.name!) }));
      }

      // Imágenes sugeridas
      if (result.suggestedImages && result.suggestedImages.length > 0) {
        setSuggestedImages(result.suggestedImages);
        setShowImageSuggestions(true);
      }

      setAiDone(true);
      toast.success(`Auto-relleno completado. Se encontraron ${Object.keys(result).filter(k => result[k as keyof CompetitionAutoFillResult]).length} campos.`);
    } catch (err: any) {
      console.error('AI autofill error:', err);
      setError(err.response?.data?.error || err.message || 'Error al analizar la URL con IA');
      toast.error('Error al analizar la URL');
    } finally {
      setAiLoading(false);
    }
  };

  // Catalog data
  const [terrainTypes, setTerrainTypes] = useState<TerrainType[]>([]);
  const [specialSeriesList, setSpecialSeriesList] = useState<SpecialSeriesListItem[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: competition?.name || '',
    slug: competition?.slug || '',
    description: competition?.description || '',
    language: competition?.language || Language.ES,
    type: competition?.type || CompetitionType.TRAIL,
    baseDistance: competition?.baseDistance?.toString() || '',
    baseElevation: competition?.baseElevation?.toString() || '',
    baseMaxParticipants: competition?.baseMaxParticipants?.toString() || '',
    displayOrder: competition?.displayOrder?.toString() || '0',
    isActive: competition?.isActive ?? true,
    // Media fields
    logoUrl: competition?.logoUrl || '',
    coverImage: competition?.coverImage || '',
    gallery: competition?.gallery || [],
    status: competition?.status || 'DRAFT',
    featured: competition?.featured || false,
    // Classification fields
    terrainTypeId: competition?.terrainTypeId || '',
    specialSeriesIds: competition?.specialSeries?.map((s: any) => s.id) || [],
    itraPoints: competition?.itraPoints?.toString() || '',
    utmbIndex: competition?.utmbIndex || '',
  });

  // Load catalogs on mount
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [terrainTypesData, specialSeriesData] = await Promise.all([
          terrainTypesService.getAll(true), // Only active terrain types
          specialSeriesService.getAll({ status: 'PUBLISHED', limit: 100 }), // Only published special series
        ]);
        // Defensive unwrap: terrainTypesData should be T[] but guard against apiSuccess wrapper
        const ttArray = Array.isArray(terrainTypesData)
          ? terrainTypesData
          : Array.isArray((terrainTypesData as any)?.data)
            ? (terrainTypesData as any).data
            : [];
        setTerrainTypes(ttArray);
        // specialSeriesData should be { data: [...], pagination } but guard against wrapper
        const ssRaw = specialSeriesData?.data ?? specialSeriesData;
        const ssArray = Array.isArray(ssRaw)
          ? ssRaw
          : Array.isArray((ssRaw as any)?.data)
            ? (ssRaw as any).data
            : [];
        setSpecialSeriesList(ssArray);
      } catch (err) {
        console.error('Error loading catalogs:', err);
        toast.error('Error al cargar los catálogos');
      } finally {
        setLoadingCatalogs(false);
      }
    };

    loadCatalogs();
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

  // Update slug when name changes (only in create mode)
  useEffect(() => {
    if (!isEditMode && formData.name && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.name),
      }));
    }
  }, [formData.name, isEditMode, formData.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!formData.slug.trim()) {
      setError('El slug es obligatorio');
      return;
    }

    if (!formData.type) {
      setError('El tipo de competición es obligatorio');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        type: formData.type,
        description: formData.description.trim() || undefined,
        language: formData.language,
        baseDistance: formData.baseDistance ? parseFloat(formData.baseDistance) : undefined,
        baseElevation: formData.baseElevation ? parseInt(formData.baseElevation) : undefined,
        baseMaxParticipants: formData.baseMaxParticipants
          ? parseInt(formData.baseMaxParticipants)
          : undefined,
        displayOrder: parseInt(formData.displayOrder) || 0,
        isActive: formData.isActive,
        // Media fields
        logoUrl: formData.logoUrl.trim() || undefined,
        coverImage: formData.coverImage.trim() || undefined,
        gallery: formData.gallery.length > 0 ? formData.gallery : undefined,
        status: formData.status,
        featured: formData.featured,
        // Classification fields
        terrainTypeId: formData.terrainTypeId || undefined,
        specialSeriesIds: formData.specialSeriesIds.length > 0 ? formData.specialSeriesIds : [],
        itraPoints: formData.itraPoints ? parseInt(formData.itraPoints) : undefined,
        utmbIndex: (formData.utmbIndex as UTMBIndex) || undefined,
      };

      let result: Competition;

      if (isEditMode) {
        result = await competitionsService.update(competition.id, payload);
        toast.success('Competición actualizada correctamente');
      } else {
        result = await competitionsService.create(eventId, payload);
        toast.success('Competición creada correctamente');
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push(`/organizer/events/${eventId}`);
      }
    } catch (err: any) {
      console.error('Error saving competition:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error al guardar la competición';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Editar Competición' : 'Nueva Competición'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Define las características de esta competición
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Card: Auto-relleno con IA */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-900">Auto-relleno con IA</h3>
        </div>
        <p className="text-sm text-purple-700 mb-4">
          Introduce la URL específica de esta competición y la IA rellenará los campos posibles.
        </p>

        <div className="flex gap-2">
          <input
            type="url"
            value={aiUrl}
            onChange={(e) => setAiUrl(e.target.value)}
            placeholder="https://www.ejemplo-evento.com/competicion-50k"
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
              La IA está analizando la web de la competición...
            </p>
          </div>
        )}

        {aiDone && !aiLoading && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              Auto-relleno completado. Revisa los campos y ajusta lo que necesites.
            </p>
          </div>
        )}
      </div>

      {/* Imágenes sugeridas por la IA */}
      {showImageSuggestions && suggestedImages.length > 0 && (
        <div className="rounded-lg bg-amber-50 p-6 shadow-sm border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-amber-900">Imágenes sugeridas</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowImageSuggestions(false)}
              className="text-amber-600 hover:text-amber-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-amber-700 mb-4">
            Imágenes encontradas en la web. Haz clic en "Ver" para abrirla y decidir si descargarla.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {suggestedImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <div className="aspect-video bg-white rounded-lg border border-amber-200 overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.alt || `Imagen ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-amber-700 capitalize px-1.5 py-0.5 bg-amber-100 rounded">
                    {img.type}
                  </span>
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ver
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 p-2 bg-amber-100 border border-amber-200 rounded text-xs text-amber-800">
            Para usar una imagen, ábrela con "Ver", descárgala, y luego súbela en la sección de medios del formulario.
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información Básica
        </h3>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="UTMB 171K"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="utmb-171k"
            required
            disabled={isEditMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
          />
          {isEditMode && (
            <p className="text-xs text-gray-500 mt-1">
              El slug no puede modificarse una vez creada la competición
            </p>
          )}
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Competición *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as CompetitionType })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value={CompetitionType.TRAIL}>Trail</option>
            <option value={CompetitionType.ULTRA}>Ultra</option>
            <option value={CompetitionType.VERTICAL}>Vertical</option>
            <option value={CompetitionType.SKYRUNNING}>Skyrunning</option>
            <option value={CompetitionType.CANICROSS}>Canicross</option>
            <option value={CompetitionType.OTHER}>Otro</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            placeholder="Descripción de la competición..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Idioma del Contenido *
            </span>
          </label>
          <select
            id="language"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          >
            {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Selecciona el idioma en el que escribes el contenido. Se traducirá automáticamente a los otros idiomas.
          </p>
        </div>
      </div>

      {/* Technical Specs Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Características Base
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Estos valores pueden ser sobreescritos en cada edición
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Base Distance */}
          <div>
            <label htmlFor="baseDistance" className="block text-sm font-medium text-gray-700 mb-1">
              Distancia (km)
            </label>
            <input
              type="number"
              id="baseDistance"
              value={formData.baseDistance}
              onChange={(e) => setFormData({ ...formData, baseDistance: e.target.value })}
              placeholder="171"
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Base Elevation */}
          <div>
            <label htmlFor="baseElevation" className="block text-sm font-medium text-gray-700 mb-1">
              Desnivel (m D+)
            </label>
            <input
              type="number"
              id="baseElevation"
              value={formData.baseElevation}
              onChange={(e) => setFormData({ ...formData, baseElevation: e.target.value })}
              placeholder="10000"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Base Max Participants */}
          <div>
            <label
              htmlFor="baseMaxParticipants"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Participantes Máx.
            </label>
            <input
              type="number"
              id="baseMaxParticipants"
              value={formData.baseMaxParticipants}
              onChange={(e) => setFormData({ ...formData, baseMaxParticipants: e.target.value })}
              placeholder="2500"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Classification Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Clasificación y Certificaciones
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Información adicional para filtros y búsqueda en el directorio
        </p>

        {loadingCatalogs ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Cargando catálogos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Terrain Type */}
            <div>
              <label htmlFor="terrainTypeId" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Terreno
              </label>
              <select
                id="terrainTypeId"
                value={formData.terrainTypeId}
                onChange={(e) => setFormData({ ...formData, terrainTypeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">-- Sin especificar --</option>
                {terrainTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Ej: Alta montaña, Costa, Desierto
              </p>
            </div>

            {/* Special Series - Multi-select */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Series Especiales
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Selecciona todas las series a las que pertenece esta competición
              </p>
              <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {specialSeriesList.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay series disponibles</p>
                ) : (
                  specialSeriesList.map((series) => (
                    <label
                      key={series.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.specialSeriesIds.includes(series.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              specialSeriesIds: [...formData.specialSeriesIds, series.id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              specialSeriesIds: formData.specialSeriesIds.filter(
                                (id: string) => id !== series.id
                              ),
                            });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{series.name}</span>
                    </label>
                  ))
                )}
              </div>
              {formData.specialSeriesIds.length > 0 && (
                <p className="text-xs text-blue-600 mt-2">
                  {formData.specialSeriesIds.length} serie(s) seleccionada(s)
                </p>
              )}
            </div>

            {/* ITRA Points */}
            <div>
              <label htmlFor="itraPoints" className="block text-sm font-medium text-gray-700 mb-1">
                Puntos ITRA
              </label>
              <select
                id="itraPoints"
                value={formData.itraPoints}
                onChange={(e) => setFormData({ ...formData, itraPoints: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">-- Sin especificar --</option>
                <option value="0">0 puntos</option>
                <option value="1">1 punto</option>
                <option value="2">2 puntos</option>
                <option value="3">3 puntos</option>
                <option value="4">4 puntos</option>
                <option value="5">5 puntos</option>
                <option value="6">6 puntos</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Certificación ITRA (0-6 puntos)
              </p>
            </div>

            {/* UTMB Index */}
            <div>
              <label htmlFor="utmbIndex" className="block text-sm font-medium text-gray-700 mb-1">
                Índice UTMB
              </label>
              <select
                id="utmbIndex"
                value={formData.utmbIndex}
                onChange={(e) => setFormData({ ...formData, utmbIndex: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">-- Sin especificar --</option>
                <option value="INDEX_20K">20K</option>
                <option value="INDEX_50K">50K</option>
                <option value="INDEX_100K">100K</option>
                <option value="INDEX_100M">100M</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Categoría según distancia UTMB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Media Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Imágenes y Medios
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logotipo
            </label>
            <FileUpload
              fieldname="logo"
              onUpload={(url) => setFormData({ ...formData, logoUrl: url })}
              currentUrl={formData.logoUrl}
              buttonText="Subir logo"
              maxSizeMB={2}
              accept="image/*"
              showPreview={true}
            />
            {formData.logoUrl && (
              <p className="text-xs text-green-600 font-medium mt-2">
                ✓ Logo subido
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Logo específico de la competición (opcional)
            </p>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de Portada
            </label>
            <FileUpload
              fieldname="cover"
              onUpload={(url) => setFormData({ ...formData, coverImage: url })}
              currentUrl={formData.coverImage}
              buttonText="Subir portada"
              maxSizeMB={5}
              accept="image/*"
              showPreview={true}
            />
            {formData.coverImage && (
              <p className="text-xs text-green-600 font-medium mt-2">
                ✓ Portada subida
              </p>
            )}
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Galería de Fotos
            </label>
            <FileUpload
              fieldname="gallery"
              multiple={true}
              onUploadMultiple={(urls) => setFormData({ ...formData, gallery: urls })}
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

      {/* Display Settings Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configuración de Visualización
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Estado de Publicación
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={user?.role !== 'ADMIN' && formData.status !== 'DRAFT'}
            >
              <option value="DRAFT">Borrador</option>
              {user?.role === 'ADMIN' && (
                <option value="PUBLISHED">Publicada</option>
              )}
              {user?.role === 'ADMIN' && (
                <option value="CANCELLED">Cancelada</option>
              )}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {user?.role === 'ADMIN'
                ? 'Solo las competiciones publicadas son visibles'
                : 'Solo los administradores pueden publicar contenido. La competición quedará pendiente de revisión.'}
            </p>
          </div>

          {/* Display Order */}
          <div>
            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-1">
              Orden de Visualización
            </label>
            <input
              type="number"
              id="displayOrder"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Número más bajo aparece primero
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Featured */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Competición Destacada
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {formData.featured ? 'Destacada' : 'Normal'}
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Las competiciones destacadas se muestran de forma prominente
            </p>
          </div>

          {/* Is Active */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activa/Inactiva
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {formData.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Solo las competiciones activas son visibles al público
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditMode ? 'Actualizar' : 'Crear'} Competición
            </>
          )}
        </button>
      </div>
    </form>
  );
}
