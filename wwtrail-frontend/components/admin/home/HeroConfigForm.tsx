// components/admin/home/HeroConfigForm.tsx

'use client';

import { Save } from 'lucide-react';

interface HeroConfigFormProps {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  onImageChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}

export function HeroConfigForm({
  heroImage,
  heroTitle,
  heroSubtitle,
  onImageChange,
  onTitleChange,
  onSubtitleChange,
  onSave,
  saving,
}: HeroConfigFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen de Fondo (URL)
        </label>
        <input
          type="text"
          value={heroImage}
          onChange={(e) => onImageChange(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {heroImage && (
          <div className="mt-2">
            <img
              src={heroImage}
              alt="Preview"
              className="h-32 w-full object-cover rounded-md"
            />
          </div>
        )}
      </div>

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
