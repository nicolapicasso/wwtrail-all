// components/forms/CompetitionForm.tsx - Formulario reutilizable para crear/editar competiciones

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Save, Loader2, AlertCircle, Image as ImageIcon, Tag, Globe, Sparkles, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import competitionsService from '@/lib/api/v2/competitions.service';
import specialSeriesService from '@/lib/api/v2/specialSeries.service';
import { terrainTypesService } from '@/lib/api/catalogs.service';
import aiAutofillService from '@/lib/api/v2/aiAutofill.service';
import type { CompetitionAutoFillResult, SuggestedImage } from '@/lib/api/v2/aiAutofill.service';
import { ImageImportSelector } from '@/components/ImageImportSelector';
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
  const t = useTranslations('boForms');
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
      setError(t('aiUrlRequiredComp'));
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
      toast.success(t('aiAutofillDoneFields', { fields: Object.keys(result).filter(k => result[k as keyof CompetitionAutoFillResult]).length }));
    } catch (err: any) {
      console.error('AI autofill error:', err);
      setError(err.response?.data?.error || err.message || t('aiUrlError'));
      toast.error(t('aiUrlAnalyzeError'));
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
        toast.error(t('catalogsLoadError'));
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
      setError(t('nameRequired'));
      return;
    }

    if (!formData.slug.trim()) {
      setError(t('slugRequired'));
      return;
    }

    if (!formData.type) {
      setError(t('compTypeRequired'));
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
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
        // Media fields — send null/[] when cleared so removals persist (undefined
        // would omit the key and Prisma would leave the old value untouched).
        logoUrl: formData.logoUrl.trim() || null,
        coverImage: formData.coverImage.trim() || null,
        gallery: formData.gallery,
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
        toast.success(t('compUpdatedSuccess'));
      } else {
        result = await competitionsService.create(eventId, payload);
        toast.success(t('compCreatedSuccess'));
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
        t('compSaveError');
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
            {isEditMode ? t('editCompTitle') : t('newCompTitle')}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t('compSubtitle')}
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('cancel')}
          </button>
        )}
      </div>

      {/* Card: Auto-relleno con IA */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-900">{t('aiAutofillTitle')}</h3>
        </div>
        <p className="text-sm text-purple-700 mb-4">
          {t('aiAutofillCompDesc')}
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
                {t('analyzing')}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {t('analyzeWithAi')}
              </>
            )}
          </button>
        </div>

        {aiLoading && (
          <div className="mt-3 p-3 bg-purple-100 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('aiAnalyzingComp')}
            </p>
          </div>
        )}

        {aiDone && !aiLoading && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              {t('aiAutofillReview')}
            </p>
          </div>
        )}
      </div>

      {/* Imágenes sugeridas por la IA — selector interactivo */}
      {showImageSuggestions && suggestedImages.length > 0 && (
        <ImageImportSelector
          images={suggestedImages}
          onImport={({ logoUrl, coverImage, gallery }) => {
            setFormData((prev: any) => ({
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

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">{t('errorTitle')}</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('basicInfo')}
        </h3>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('nameRequiredLabel')}
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
            {t('slugRequiredLabel')}
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
              {t('slugImmutableComp')}
            </p>
          )}
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            {t('compTypeLabel')}
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
            <option value={CompetitionType.OTHER}>{t('other')}</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            {t('description')}
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            placeholder={t('compDescriptionPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('contentLanguageLabel')}
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
            {t('contentLanguageHelp')}
          </p>
        </div>
      </div>

      {/* Technical Specs Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('baseCharacteristics')}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {t('baseCharacteristicsHelp')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Base Distance */}
          <div>
            <label htmlFor="baseDistance" className="block text-sm font-medium text-gray-700 mb-1">
              {t('distanceKm')}
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
              {t('elevationDPlus')}
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
              {t('maxParticipants')}
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
            {t('classificationCertifications')}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {t('classificationHelp')}
        </p>

        {loadingCatalogs ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">{t('loadingCatalogs')}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Terrain Type */}
            <div>
              <label htmlFor="terrainTypeId" className="block text-sm font-medium text-gray-700 mb-1">
                {t('terrainType')}
              </label>
              <select
                id="terrainTypeId"
                value={formData.terrainTypeId}
                onChange={(e) => setFormData({ ...formData, terrainTypeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">{t('unspecified')}</option>
                {terrainTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {t('terrainTypeHelp')}
              </p>
            </div>

            {/* Special Series - Multi-select */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('specialSeries')}
              </label>
              <p className="text-xs text-gray-500 mb-2">
                {t('specialSeriesHelp')}
              </p>
              <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {specialSeriesList.length === 0 ? (
                  <p className="text-sm text-gray-500">{t('noSeriesAvailable')}</p>
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
                  {t('seriesSelectedCount', { count: formData.specialSeriesIds.length })}
                </p>
              )}
            </div>

            {/* ITRA Points */}
            <div>
              <label htmlFor="itraPoints" className="block text-sm font-medium text-gray-700 mb-1">
                {t('itraPoints')}
              </label>
              <select
                id="itraPoints"
                value={formData.itraPoints}
                onChange={(e) => setFormData({ ...formData, itraPoints: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">{t('unspecified')}</option>
                <option value="0">{t('itraPointsCount', { count: 0 })}</option>
                <option value="1">{t('itraPointsCount', { count: 1 })}</option>
                <option value="2">{t('itraPointsCount', { count: 2 })}</option>
                <option value="3">{t('itraPointsCount', { count: 3 })}</option>
                <option value="4">{t('itraPointsCount', { count: 4 })}</option>
                <option value="5">{t('itraPointsCount', { count: 5 })}</option>
                <option value="6">{t('itraPointsCount', { count: 6 })}</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {t('itraPointsHelp')}
              </p>
            </div>

            {/* UTMB Index */}
            <div>
              <label htmlFor="utmbIndex" className="block text-sm font-medium text-gray-700 mb-1">
                {t('utmbIndex')}
              </label>
              <select
                id="utmbIndex"
                value={formData.utmbIndex}
                onChange={(e) => setFormData({ ...formData, utmbIndex: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">{t('unspecified')}</option>
                <option value="INDEX_20K">20K</option>
                <option value="INDEX_50K">50K</option>
                <option value="INDEX_100K">100K</option>
                <option value="INDEX_100M">100M</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {t('utmbIndexHelp')}
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
            {t('imagesAndMedia')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('logo')}
            </label>
            <FileUpload
              fieldname="logo"
              onUpload={(url) => setFormData({ ...formData, logoUrl: url })}
              currentUrl={formData.logoUrl}
              buttonText={t('uploadLogo')}
              maxSizeMB={2}
              accept="image/*"
              showPreview={true}
            />
            {formData.logoUrl && (
              <p className="text-xs text-green-600 font-medium mt-2">
                {t('logoUploaded')}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {t('compLogoHelp')}
            </p>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('coverImage')}
            </label>
            <FileUpload
              fieldname="cover"
              onUpload={(url) => setFormData({ ...formData, coverImage: url })}
              currentUrl={formData.coverImage}
              buttonText={t('uploadCover')}
              maxSizeMB={5}
              accept="image/*"
              showPreview={true}
            />
            {formData.coverImage && (
              <p className="text-xs text-green-600 font-medium mt-2">
                {t('coverUploaded')}
              </p>
            )}
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('photoGallery')}
            </label>
            <FileUpload
              fieldname="gallery"
              multiple={true}
              onUploadMultiple={(urls) => setFormData({ ...formData, gallery: urls })}
              currentUrls={formData.gallery}
              buttonText={t('uploadPhotos')}
              maxSizeMB={3}
              accept="image/*"
              showPreview={true}
            />
            {formData.gallery.length > 0 && (
              <p className="text-xs text-green-600 font-medium mt-2">
                {t('photosCount', { count: formData.gallery.length })}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          {t('imagesOptimizedNote')}
        </div>
      </div>

      {/* Display Settings Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('displaySettings')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              {t('publicationStatus')}
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={user?.role !== 'ADMIN' && formData.status !== 'DRAFT'}
            >
              <option value="DRAFT">{t('statusDraft')}</option>
              {user?.role === 'ADMIN' && (
                <option value="PUBLISHED">{t('statusPublishedFem')}</option>
              )}
              {user?.role === 'ADMIN' && (
                <option value="CANCELLED">{t('statusCancelledFem')}</option>
              )}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {user?.role === 'ADMIN'
                ? t('compVisibilityAdmin')
                : t('compVisibilityNonAdmin')}
            </p>
          </div>

          {/* Display Order */}
          <div>
            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-1">
              {t('displayOrder')}
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
              {t('displayOrderHelp')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Featured */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('featuredComp')}
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {formData.featured ? t('featuredFem') : t('normal')}
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              {t('featuredCompHelp')}
            </p>
          </div>

          {/* Is Active */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('activeInactive')}
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {formData.isActive ? t('active') : t('inactive')}
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              {t('activeCompHelp')}
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
              {t('saving')}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditMode ? t('updateComp') : t('createComp')}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
