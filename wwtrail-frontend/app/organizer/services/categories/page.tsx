// app/admin/services/categories/page.tsx
// Admin page for managing service categories

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import serviceCategoriesService from '@/lib/api/v2/serviceCategories.service';
import { ServiceCategoryWithCount } from '@/lib/api/v2/serviceCategories.service';
import { Tag, Plus, Edit2, Trash2, Loader2, X, Save, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function ServiceCategoriesAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<ServiceCategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategoryWithCount | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    icon: '🏷️',
  });
  const [formLoading, setFormLoading] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await serviceCategoriesService.getAllWithCount();
      setCategories(data);
    } catch (error: any) {
      console.error('Error loading categories:', error);
      toast.error('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadCategories();
    }
  }, [user]);

  const handleOpenModal = (category?: ServiceCategoryWithCount) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        icon: category.icon,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        icon: '🏷️',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', icon: '🏷️' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.icon.trim()) {
      toast.error('Nombre e icono son obligatorios');
      return;
    }

    setFormLoading(true);
    try {
      if (editingCategory) {
        await serviceCategoriesService.update(editingCategory.id, formData);
        toast.success('Categoría actualizada correctamente');
      } else {
        await serviceCategoriesService.create(formData);
        toast.success('Categoría creada correctamente');
      }

      handleCloseModal();
      await loadCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      const message = error.response?.data?.message || 'Error al guardar la categoría';
      toast.error(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string, count: number) => {
    if (count > 0) {
      toast.error(`No se puede eliminar "${categoryName}" porque tiene ${count} servicios asociados`);
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?`)) {
      return;
    }

    setDeleting(categoryId);
    try {
      await serviceCategoriesService.delete(categoryId);
      toast.success('Categoría eliminada correctamente');
      await loadCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      const message = error.response?.data?.message || 'Error al eliminar la categoría';
      toast.error(message);
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading || (loading && categories.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Tag className="h-8 w-8" />
            Categorías de Servicios
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las categorías que se pueden asignar a los servicios
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadCategories}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Categories List */}
      {loading && categories.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No hay categorías</h3>
          <p className="text-muted-foreground mb-4">
            Crea la primera categoría para empezar
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{category.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} {category.count === 1 ? 'servicio' : 'servicios'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Editar"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id, category.name, category.count)}
                  disabled={deleting === category.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  {deleting === category.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Alojamiento, Restaurante, Tienda"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Icono (Emoji) *
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center w-16 h-16 border rounded-md text-4xl bg-gray-50">
                    {formData.icon}
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    required
                    maxLength={10}
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="🏨"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Puedes copiar un emoji desde{' '}
                  <a
                    href="https://emojipedia.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Emojipedia
                  </a>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {editingCategory ? 'Actualizar' : 'Crear'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
