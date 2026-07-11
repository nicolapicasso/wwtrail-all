'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { promotionsService } from '@/lib/api/v2';
import { Promotion } from '@/types/v2';
import PromotionForm from '@/components/promotions/PromotionForm';
import { ArrowLeft, Plus } from 'lucide-react';

export default function EditPromotionPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCodes, setShowAddCodes] = useState(false);
  const [newCodes, setNewCodes] = useState('');
  const [addingCodes, setAddingCodes] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    if (user?.role === 'ADMIN' && id) {
      loadPromotion();
    }
  }, [user, authLoading, router, id]);

  const loadPromotion = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await promotionsService.getByIdOrSlug(id);
      setPromotion(response.data);
    } catch (err: any) {
      console.error('Error loading promotion:', err);
      setError(err.message || 'Error al cargar la promoción');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCodes = async () => {
    if (!newCodes.trim()) {
      alert('Debes agregar al menos un código');
      return;
    }

    try {
      setAddingCodes(true);
      await promotionsService.uploadCouponCodes(id, newCodes);
      setNewCodes('');
      setShowAddCodes(false);
      loadPromotion(); // Reload to get updated stats
      alert('Códigos agregados correctamente');
    } catch (err: any) {
      alert(err.message || 'Error al agregar códigos');
    } finally {
      setAddingCodes(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return null;
  }

  if (error || !promotion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Promoción no encontrada'}</p>
          <button
            onClick={() => router.push('/organizer/promotions')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Editar Promoción</h1>
          <p className="text-gray-600 mt-1">{promotion.title}</p>
        </div>

        {/* Add Codes Section (only for coupons) */}
        {promotion.type === 'COUPON' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Pool de Cupones</h2>
                <p className="text-sm text-gray-600">
                  Disponibles: {promotion.couponStats?.available || 0} de {promotion.couponStats?.total || 0}
                </p>
              </div>
              <button
                onClick={() => setShowAddCodes(!showAddCodes)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                Agregar Códigos
              </button>
            </div>

            {showAddCodes && (
              <div className="border-t pt-4 mt-4">
                <label htmlFor="newCodes" className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevos Códigos (uno por línea o separados por comas)
                </label>
                <textarea
                  id="newCodes"
                  value={newCodes}
                  onChange={(e) => setNewCodes(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="NUEVO1&#10;NUEVO2&#10;NUEVO3"
                />
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-gray-500">
                    Códigos a agregar: {newCodes.split(/[\n,]/).filter(c => c.trim()).length}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowAddCodes(false);
                        setNewCodes('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      disabled={addingCodes}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddCodes}
                      disabled={addingCodes || !newCodes.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingCodes ? 'Agregando...' : 'Agregar Códigos'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <PromotionForm
            promotion={promotion}
            onSuccess={() => router.push('/organizer/promotions')}
          />
        </div>
      </div>
    </div>
  );
}
