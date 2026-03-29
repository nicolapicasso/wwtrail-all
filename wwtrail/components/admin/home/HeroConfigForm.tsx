// components/admin/home/HeroConfigForm.tsx

'use client';

import { useState } from 'react';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import FileUpload from '@/components/FileUpload';

interface HeroConfigFormProps {
  heroImages: string[];
  heroTitle: string;
  heroSubtitle: string;
  onImagesChange: (images: string[]) => void;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}

export function HeroConfigForm({
  heroImages,
  heroTitle,
  heroSubtitle,
  onImagesChange,
  onTitleChange,
  onSubtitleChange,
  onSave,
  saving,
}: HeroConfigFormProps) {
  const [showAddImage, setShowAddImage] = useState(false);

  const handleAddImage = (url: string) => {
    if (url && !heroImages.includes(url)) {
      onImagesChange([...heroImages, url]);
    }
    setShowAddImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = heroImages.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === heroImages.length - 1) return;

    const newImages = [...heroImages];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Images Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Imágenes del Slider ({heroImages.length})
          </label>
          <button
            onClick={() => setShowAddImage(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar imagen
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Las imágenes se mostrarán como un slider automático. Puedes agregar hasta 10 imágenes.
        </p>

        {/* Image List */}
        {heroImages.length > 0 ? (
          <div className="space-y-3">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                {/* Order indicator */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleMoveImage(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover arriba"
                  >
                    <GripVertical className="w-4 h-4 rotate-180" />
                  </button>
                  <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                  <button
                    onClick={() => handleMoveImage(index, 'down')}
                    disabled={index === heroImages.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover abajo"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="w-32 h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>

                {/* URL */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate" title={image}>
                    {image}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Eliminar imagen"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay imágenes configuradas</p>
            <p className="text-sm text-gray-400 mt-1">
              Agrega imágenes para crear un slider en el hero
            </p>
          </div>
        )}

        {/* Add Image Modal/Form */}
        {showAddImage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Agregar Imagen al Slider</h3>
              <FileUpload
                onUpload={handleAddImage}
                buttonText="Subir imagen"
                fieldname="hero-slider"
                maxSizeMB={10}
                showPreview={false}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowAddImage(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título
        </label>
        <input
          type="text"
          value={heroTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Bienvenido a WWTRAIL"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtítulo
        </label>
        <input
          type="text"
          value={heroSubtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder="La plataforma para trail runners"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Guardando...' : 'Guardar Hero'}
        </button>
      </div>
    </div>
  );
}
