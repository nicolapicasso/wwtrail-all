// components/PodiumForm.tsx - Formulario para crear/editar podiums

'use client';

import { useState } from 'react';
import { X, Trophy } from 'lucide-react';
import { PODIUM_TYPE_LABELS } from '@/types/podium';
import type { EditionPodium, PodiumType, CreatePodiumDTO } from '@/types/podium';

interface PodiumFormProps {
  editionId: string;
  podium?: EditionPodium;
  onSubmit: (data: CreatePodiumDTO) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function PodiumForm({
  editionId,
  podium,
  onSubmit,
  onCancel,
  loading = false,
}: PodiumFormProps) {
  const [formData, setFormData] = useState<CreatePodiumDTO>({
    type: podium?.type || 'GENERAL',
    categoryName: podium?.categoryName || undefined,
    firstPlace: podium?.firstPlace || '',
    firstTime: podium?.firstTime || undefined,
    secondPlace: podium?.secondPlace || undefined,
    secondTime: podium?.secondTime || undefined,
    thirdPlace: podium?.thirdPlace || undefined,
    thirdTime: podium?.thirdTime || undefined,
    sortOrder: podium?.sortOrder || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CreatePodiumDTO, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validaciones obligatorias
    if (!formData.firstPlace?.trim()) {
      newErrors.firstPlace = 'El primer lugar es obligatorio';
    }

    // Si es categoría, debe tener nombre de categoría
    if (formData.type === 'CATEGORY' && !formData.categoryName?.trim()) {
      newErrors.categoryName = 'El nombre de categoría es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Limpiar campos opcionales vacíos
    const cleanData: CreatePodiumDTO = {
      ...formData,
      categoryName: formData.categoryName?.trim() || undefined,
      firstTime: formData.firstTime?.trim() || undefined,
      secondPlace: formData.secondPlace?.trim() || undefined,
      secondTime: formData.secondTime?.trim() || undefined,
      thirdPlace: formData.thirdPlace?.trim() || undefined,
      thirdTime: formData.thirdTime?.trim() || undefined,
    };

    await onSubmit(cleanData);
  };

  const podiumTypes: { value: PodiumType; label: string }[] = [
    { value: 'GENERAL', label: PODIUM_TYPE_LABELS.GENERAL },
    { value: 'MALE', label: PODIUM_TYPE_LABELS.MALE },
    { value: 'FEMALE', label: PODIUM_TYPE_LABELS.FEMALE },
    { value: 'CATEGORY', label: PODIUM_TYPE_LABELS.CATEGORY },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Trophy className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {podium ? 'Editar Clasificación' : 'Nueva Clasificación'}
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Tipo de Podio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Clasificación *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as PodiumType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            {podiumTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Nombre de Categoría (solo si type === CATEGORY) */}
        {formData.type === 'CATEGORY' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Categoría *
            </label>
            <input
              type="text"
              value={formData.categoryName || ''}
              onChange={(e) => handleChange('categoryName', e.target.value)}
              placeholder="Ej: Veteranos A, Sub-23, etc."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.categoryName ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.categoryName && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryName}</p>
            )}
          </div>
        )}

        {/* Primer Lugar */}
        <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🥇</span>
            <h4 className="font-bold text-gray-900">1er Lugar</h4>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.firstPlace}
                onChange={(e) => handleChange('firstPlace', e.target.value)}
                placeholder="Nombre del corredor"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.firstPlace ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.firstPlace && (
                <p className="mt-1 text-sm text-red-600">{errors.firstPlace}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo (opcional)
              </label>
              <input
                type="text"
                value={formData.firstTime || ''}
                onChange={(e) => handleChange('firstTime', e.target.value)}
                placeholder="Ej: 12:34:56"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Segundo Lugar */}
        <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🥈</span>
            <h4 className="font-bold text-gray-900">2do Lugar</h4>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.secondPlace || ''}
                onChange={(e) => handleChange('secondPlace', e.target.value)}
                placeholder="Nombre del corredor"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo (opcional)
              </label>
              <input
                type="text"
                value={formData.secondTime || ''}
                onChange={(e) => handleChange('secondTime', e.target.value)}
                placeholder="Ej: 12:34:56"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent font-mono"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Tercer Lugar */}
        <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-300">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🥉</span>
            <h4 className="font-bold text-gray-900">3er Lugar</h4>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.thirdPlace || ''}
                onChange={(e) => handleChange('thirdPlace', e.target.value)}
                placeholder="Nombre del corredor"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo (opcional)
              </label>
              <input
                type="text"
                value={formData.thirdTime || ''}
                onChange={(e) => handleChange('thirdTime', e.target.value)}
                placeholder="Ej: 12:34:56"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Orden de visualización
          </label>
          <input
            type="number"
            value={formData.sortOrder}
            onChange={(e) => handleChange('sortOrder', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
            min="0"
          />
          <p className="mt-1 text-xs text-gray-500">
            Menor número se muestra primero (0 por defecto)
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Guardando...' : podium ? 'Actualizar' : 'Crear Clasificación'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
