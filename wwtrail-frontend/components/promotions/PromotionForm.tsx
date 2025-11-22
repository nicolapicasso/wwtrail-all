'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Promotion, CreatePromotionInput, UpdatePromotionInput, Language, PromotionType } from '@/types/v2';
import { promotionsService } from '@/lib/api/v2';
import { Upload, X, Plus } from 'lucide-react';
import { uploadFile } from '@/lib/api/files.service';
import { RichTextEditor } from '@/components/RichTextEditor';
import { COUNTRIES } from '@/lib/data/countries';

interface PromotionFormProps {
  promotion?: Promotion;
  onSuccess?: () => void;
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'ES', label: 'Español' },
  { value: 'EN', label: 'English' },
  { value: 'IT', label: 'Italiano' },
  { value: 'CA', label: 'Català' },
  { value: 'FR', label: 'Français' },
  { value: 'DE', label: 'Deutsch' },
];

export default function PromotionForm({ promotion, onSuccess }: PromotionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [type, setType] = useState<PromotionType>(promotion?.type || 'COUPON');
  const [title, setTitle] = useState(promotion?.title || '');
  const [description, setDescription] = useState(promotion?.description || '');
  const [coverImage, setCoverImage] = useState(promotion?.coverImage || '');
  const [gallery, setGallery] = useState<string[]>(promotion?.gallery || []);
  const [brandUrl, setBrandUrl] = useState(promotion?.brandUrl || '');
  const [language, setLanguage] = useState<Language>(promotion?.language || 'ES');
  const [isGlobal, setIsGlobal] = useState(promotion?.isGlobal || false);
  const [countries, setCountries] = useState<string[]>(
    promotion?.countries?.map(c => c.countryCode) || []
  );
  const [featured, setFeatured] = useState(promotion?.featured || false);

  // Type-specific fields
  const [exclusiveContent, setExclusiveContent] = useState(promotion?.exclusiveContent || '');
  const [couponCodesText, setCouponCodesText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validations
      if (!title.trim()) {
        throw new Error('El título es obligatorio');
      }
      if (!description.trim()) {
        throw new Error('La descripción es obligatoria');
      }
      if (type === 'EXCLUSIVE_CONTENT' && !exclusiveContent.trim()) {
        throw new Error('El contenido exclusivo es obligatorio para este tipo');
      }
      if (type === 'COUPON' && !promotion && !couponCodesText.trim()) {
        throw new Error('Debes agregar al menos un código de cupón');
      }
      if (!isGlobal && countries.length === 0) {
        throw new Error('Selecciona al menos un país o marca como Global');
      }

      // Parse coupon codes
      const couponCodes = type === 'COUPON' && !promotion
        ? couponCodesText
            .split(/[\n,]/)
            .map(code => code.trim())
            .filter(code => code.length > 0)
        : undefined;

      const data: CreatePromotionInput | UpdatePromotionInput = {
        type,
        title,
        description,
        coverImage: coverImage || undefined,
        gallery,
        brandUrl: brandUrl || undefined,
        language,
        isGlobal,
        countries: !isGlobal ? countries : undefined,
        exclusiveContent: type === 'EXCLUSIVE_CONTENT' ? exclusiveContent : undefined,
        couponCodes,
        featured,
      };

      if (promotion) {
        // Update
        await promotionsService.update(promotion.id, data);
      } else {
        // Create
        await promotionsService.create(data as CreatePromotionInput);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/promotions');
      }
    } catch (err: any) {
      console.error('Error saving promotion:', err);
      setError(err.message || 'Error al guardar la promoción');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, isGallery: boolean = false) => {
    try {
      setUploadingImage(true);
      const url = await uploadFile(file, 'file');

      if (isGallery) {
        setGallery([...gallery, url]);
      } else {
        setCoverImage(url);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const toggleCountry = (countryCode: string) => {
    if (countries.includes(countryCode)) {
      setCountries(countries.filter(c => c !== countryCode));
    } else {
      setCountries([...countries, countryCode]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Promoción *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setType('COUPON')}
            disabled={!!promotion}
            className={`p-4 border-2 rounded-lg text-center transition-colors ${
              type === 'COUPON'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${promotion ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-3xl mb-2">🎟️</div>
            <div className="font-semibold">Cupón</div>
            <div className="text-xs text-gray-600">Pool de códigos únicos</div>
          </button>

          <button
            type="button"
            onClick={() => setType('EXCLUSIVE_CONTENT')}
            disabled={!!promotion}
            className={`p-4 border-2 rounded-lg text-center transition-colors ${
              type === 'EXCLUSIVE_CONTENT'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${promotion ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-3xl mb-2">🔒</div>
            <div className="font-semibold">Contenido Exclusivo</div>
            <div className="text-xs text-gray-600">Solo para usuarios registrados</div>
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ej: Descuento 20% en equipamiento trail"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Descripción de la promoción..."
          required
        />
      </div>

      {/* Brand URL */}
      <div>
        <label htmlFor="brandUrl" className="block text-sm font-medium text-gray-700 mb-2">
          URL de la Marca/Fabricante
        </label>
        <input
          id="brandUrl"
          type="url"
          value={brandUrl}
          onChange={(e) => setBrandUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="https://ejemplo.com"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen de Portada
        </label>
        {coverImage ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setCoverImage('')}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
            <Upload className="h-12 w-12 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Click para subir imagen</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              disabled={uploadingImage}
            />
          </label>
        )}
      </div>

      {/* Gallery */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Galería de Fotos
        </label>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {gallery.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
            <Plus className="h-8 w-8 text-gray-400 mb-1" />
            <span className="text-xs text-gray-600">Agregar</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)}
              disabled={uploadingImage}
            />
          </label>
        </div>
      </div>

      {/* Language */}
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
          Idioma *
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          {LANGUAGES.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Countries */}
      <div>
        <div className="flex items-center gap-4 mb-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isGlobal}
              onChange={(e) => {
                setIsGlobal(e.target.checked);
                if (e.target.checked) setCountries([]);
              }}
              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">Global (todos los países)</span>
          </label>
        </div>

        {!isGlobal && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Países Válidos * ({countries.length} seleccionados)
            </label>
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COUNTRIES.map(country => (
                  <label
                    key={country.code}
                    className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={countries.includes(country.code)}
                      onChange={() => toggleCountry(country.code)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm">{country.flag} {country.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exclusive Content */}
      {type === 'EXCLUSIVE_CONTENT' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido Oculto (solo usuarios registrados) *
          </label>
          <RichTextEditor
            content={exclusiveContent}
            onChange={setExclusiveContent}
            placeholder="Escribe el contenido exclusivo que solo verán usuarios registrados..."
          />
        </div>
      )}

      {/* Coupon Codes */}
      {type === 'COUPON' && !promotion && (
        <div>
          <label htmlFor="couponCodes" className="block text-sm font-medium text-gray-700 mb-2">
            Códigos de Cupón * (uno por línea o separados por comas)
          </label>
          <textarea
            id="couponCodes"
            value={couponCodesText}
            onChange={(e) => setCouponCodesText(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
            placeholder="CODIGO1&#10;CODIGO2&#10;CODIGO3"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Total de códigos: {couponCodesText.split(/[\n,]/).filter(c => c.trim()).length}
          </p>
        </div>
      )}

      {/* Featured */}
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <span className="text-sm font-medium text-gray-700">Destacar esta promoción</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : promotion ? 'Actualizar' : 'Crear Promoción'}
        </button>
      </div>
    </form>
  );
}
