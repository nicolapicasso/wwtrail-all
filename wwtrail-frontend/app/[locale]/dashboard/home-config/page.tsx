// app/dashboard/home-config/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Plus,
  Save,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { homeService } from '@/lib/api/home.service';
import type { HomeConfiguration, HomeBlock, HomeBlockType } from '@/types/home';
import { BlockConfigModal } from '@/components/admin/home/BlockConfigModal';
import { HeroConfigForm } from '@/components/admin/home/HeroConfigForm';

export default function HomeConfigPage() {
  const router = useRouter();
  const [config, setConfig] = useState<HomeConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<HomeBlock | null>(null);

  // Hero form state
  const [heroImage, setHeroImage] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await homeService.getActiveConfiguration();
      setConfig(data);
      setHeroImage(data.heroImage || '');
      setHeroTitle(data.heroTitle || '');
      setHeroSubtitle(data.heroSubtitle || '');
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async () => {
    if (!config) return;

    setSaving(true);
    try {
      await homeService.updateConfiguration(config.id, {
        heroImage,
        heroTitle,
        heroSubtitle,
      });
      alert('Hero actualizado correctamente');
      await loadConfig();
    } catch (error) {
      console.error('Error saving hero:', error);
      alert('Error al guardar el hero');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async (blockId: string) => {
    try {
      await homeService.toggleBlockVisibility(blockId);
      await loadConfig();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('Error al cambiar visibilidad');
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('¿Estás seguro de eliminar este bloque?')) return;

    try {
      await homeService.deleteBlock(blockId);
      await loadConfig();
    } catch (error) {
      console.error('Error deleting block:', error);
      alert('Error al eliminar el bloque');
    }
  };

  const handleMoveBlock = async (blockId: string, direction: 'up' | 'down') => {
    if (!config) return;

    const blocks = [...config.blocks].sort((a, b) => a.order - b.order);
    const index = blocks.findIndex(b => b.id === blockId);

    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap orders
    const temp = blocks[index].order;
    blocks[index].order = blocks[newIndex].order;
    blocks[newIndex].order = temp;

    try {
      await homeService.reorderBlocks(
        config.id,
        blocks.map(b => ({ id: b.id, order: b.order }))
      );
      await loadConfig();
    } catch (error) {
      console.error('Error reordering blocks:', error);
      alert('Error al reordenar bloques');
    }
  };

  const handleBlockSaved = async () => {
    setShowBlockModal(false);
    setEditingBlock(null);
    await loadConfig();
  };

  const getBlockTypeLabel = (type: HomeBlockType): string => {
    const labels: Record<HomeBlockType, string> = {
      EVENTS: 'Eventos',
      COMPETITIONS: 'Competiciones',
      EDITIONS: 'Ediciones',
      SERVICES: 'Servicios',
      POSTS: 'Artículos',
      TEXT: 'Texto',
      LINKS: 'Enlaces',
    };
    return labels[type] || type;
  };

  const getBlockTypeColor = (type: HomeBlockType): string => {
    const colors: Record<HomeBlockType, string> = {
      EVENTS: 'bg-blue-100 text-blue-800',
      COMPETITIONS: 'bg-green-100 text-green-800',
      EDITIONS: 'bg-black text-white',
      SERVICES: 'bg-orange-100 text-orange-800',
      POSTS: 'bg-emerald-100 text-emerald-800',
      TEXT: 'bg-gray-100 text-gray-800',
      LINKS: 'bg-amber-100 text-amber-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-red-600">Error al cargar la configuración</p>
        </div>
      </div>
    );
  }

  const sortedBlocks = [...config.blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Home className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Configuración de la Home
          </h1>
        </div>
        <p className="text-gray-600">
          Configura el hero y los bloques de contenido de la página principal
        </p>
      </div>

      {/* Hero Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hero Section</h2>
        <HeroConfigForm
          heroImage={heroImage}
          heroTitle={heroTitle}
          heroSubtitle={heroSubtitle}
          onImageChange={setHeroImage}
          onTitleChange={setHeroTitle}
          onSubtitleChange={setHeroSubtitle}
          onSave={handleSaveHero}
          saving={saving}
        />
      </div>

      {/* Blocks Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Bloques de Contenido</h2>
          <button
            onClick={() => setShowBlockModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar Bloque
          </button>
        </div>

        {sortedBlocks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay bloques configurados. Agrega tu primer bloque.
          </div>
        ) : (
          <div className="space-y-3">
            {sortedBlocks.map((block, index) => (
              <div
                key={block.id}
                className={`border rounded-lg p-4 ${
                  block.visible ? 'bg-white' : 'bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Drag handle visual */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveBlock(block.id, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveBlock(block.id, 'down')}
                      disabled={index === sortedBlocks.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Block info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getBlockTypeColor(
                          block.type
                        )}`}
                      >
                        {getBlockTypeLabel(block.type)}
                      </span>
                      <span className="text-sm text-gray-500">Orden: {block.order}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {block.config && JSON.stringify(block.config, null, 2).substring(0, 100)}...
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleVisibility(block.id)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                      title={block.visible ? 'Ocultar' : 'Mostrar'}
                    >
                      {block.visible ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingBlock(block)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlock(block.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Block Config Modal */}
      {(showBlockModal || editingBlock) && (
        <BlockConfigModal
          configId={config.id}
          block={editingBlock}
          onClose={() => {
            setShowBlockModal(false);
            setEditingBlock(null);
          }}
          onSaved={handleBlockSaved}
        />
      )}
    </div>
  );
}
