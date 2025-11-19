// components/CategoryManager.tsx
// Gestor de categorías de servicios para administradores

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import servicesService from '@/lib/api/v2/services.service';
import { Tag, Trash2, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';

interface Category {
  name: string;
  count: number;
}

export default function CategoryManager() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicesService.getCategoriesWithCount();
      setCategories(data);
    } catch (err: any) {
      console.error('Error loading categories:', err);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadCategories();
    }
  }, [user]);

  const handleDelete = async (categoryName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?\n\nTodos los servicios de esta categoría se actualizarán a "Sin categoría".`)) {
      return;
    }

    setDeleting(categoryName);
    setError(null);
    setSuccess(null);

    try {
      const result = await servicesService.deleteCategory(categoryName);
      setSuccess(`Categoría eliminada. ${result.data.updatedCount} servicios actualizados.`);
      await loadCategories(); // Recargar la lista
    } catch (err: any) {
      console.error('Error deleting category:', err);
      setError(err.response?.data?.message || 'Error al eliminar la categoría');
    } finally {
      setDeleting(null);
    }
  };

  // Solo mostrar a administradores
  if (user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Gestión de Categorías
        </h2>
        <button
          onClick={loadCategories}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">
          No hay categorías creadas todavía
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-3">
            {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'}
          </p>

          {/* Categories List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.count} {category.count === 1 ? 'servicio' : 'servicios'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(category.name)}
                  disabled={deleting === category.name}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Eliminar categoría"
                >
                  {deleting === category.name ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          ⚠️ Al eliminar una categoría, todos los servicios asociados se actualizarán a "Sin categoría".
        </p>
      </div>
    </div>
  );
}
