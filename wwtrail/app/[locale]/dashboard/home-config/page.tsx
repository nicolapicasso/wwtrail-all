// app/dashboard/home-config/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
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
  ArrowDown,
  Calendar,
  Trophy,
  Layers,
  Wrench,
  Newspaper,
  Type as TypeIcon,
  Link as LinkIcon,
  Map as MapIcon,
  LayoutGrid,
} from 'lucide-react';
import { homeService } from '@/lib/api/home.service';
import type { HomeConfiguration, HomeBlock, HomeBlockType } from '@/types/home';
import { BlockConfigModal } from '@/components/admin/home/BlockConfigModal';
import { HeroConfigForm } from '@/components/admin/home/HeroConfigForm';

export default function HomeConfigPage() {
  const t = useTranslations('boMisc');
  const router = useRouter();
  const [config, setConfig] = useState<HomeConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<HomeBlock | null>(null);

  // Hero form state
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await homeService.getActiveConfiguration();
      setConfig(data);
      // Compatibilidad: usar heroImages si existe, sino heroImage como array
      const images = data.heroImages || (data.heroImage ? [data.heroImage] : []);
      setHeroImages(images);
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
        heroImages,
        heroImage: heroImages[0] || null, // Mantener compatibilidad con heroImage legacy
        heroTitle,
        heroSubtitle,
      });
      alert(t('homeConfigHeroSaved'));
      await loadConfig();
    } catch (error) {
      console.error('Error saving hero:', error);
      alert(t('homeConfigHeroSaveError'));
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
      alert(t('homeConfigVisibilityError'));
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm(t('homeConfigDeleteBlockConfirm'))) return;

    try {
      await homeService.deleteBlock(blockId);
      await loadConfig();
    } catch (error) {
      console.error('Error deleting block:', error);
      alert(t('homeConfigDeleteBlockError'));
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
      alert(t('homeConfigReorderError'));
    }
  };

  const handleBlockSaved = async () => {
    setShowBlockModal(false);
    setEditingBlock(null);
    await loadConfig();
  };

  const getBlockTypeLabel = (type: HomeBlockType): string => {
    const labels: Record<HomeBlockType, string> = {
      EVENTS: t('dashEvents'),
      COMPETITIONS: t('dashCompetitions'),
      EDITIONS: t('dashEditions'),
      SERVICES: t('dashServices'),
      POSTS: t('homeConfigBlockPosts'),
      TEXT: t('homeConfigBlockText'),
      LINKS: t('homeConfigBlockLinks'),
      MAP: t('homeConfigBlockMap'),
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
      MAP: 'bg-teal-100 text-teal-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getBlockIcon = (type: HomeBlockType) => {
    const icons: Record<HomeBlockType, any> = {
      EVENTS: Calendar,
      COMPETITIONS: Trophy,
      EDITIONS: Layers,
      SERVICES: Wrench,
      POSTS: Newspaper,
      TEXT: TypeIcon,
      LINKS: LinkIcon,
      MAP: MapIcon,
    };
    return icons[type] || LayoutGrid;
  };

  // Human-readable summary of a block's config (replaces the raw JSON dump).
  const getBlockSummary = (block: HomeBlock): { title: string | null; chips: string[] } => {
    const c: any = block.config || {};
    const chips: string[] = [];
    const title = typeof c.title === 'string' && c.title.trim() ? c.title.trim() : null;

    switch (block.type) {
      case 'EVENTS':
      case 'COMPETITIONS':
      case 'EDITIONS':
      case 'SERVICES':
      case 'POSTS':
        if (typeof c.limit === 'number') chips.push(t('homeBlockItemsCount', { count: c.limit }));
        if (c.viewType) chips.push(String(c.viewType));
        if (c.featuredOnly === true) chips.push(t('homeBlockFeaturedOnly'));
        return { title: title || (typeof c.subtitle === 'string' ? c.subtitle : null), chips };
      case 'LINKS':
        chips.push(t('homeBlockLinksCount', { count: Array.isArray(c.items) ? c.items.length : 0 }));
        return { title, chips };
      case 'MAP':
        if (c.mapMode) chips.push(String(c.mapMode));
        if (typeof c.height === 'number') chips.push(`${c.height}px`);
        if (c.showEvents) chips.push(t('dashEvents'));
        if (c.showServices) chips.push(t('dashServices'));
        return { title, chips };
      case 'TEXT': {
        const txt = typeof c.text === 'string' ? c.text : typeof c.content === 'string' ? c.content : '';
        return { title: txt ? txt.slice(0, 90) : title, chips };
      }
      default:
        return { title, chips };
    }
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
          <p className="text-red-600">{t('homeConfigLoadError')}</p>
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
            {t('homeConfigTitle')}
          </h1>
        </div>
        <p className="text-gray-600">
          {t('homeConfigSubtitle')}
        </p>
      </div>

      {/* Hero Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('homeConfigHeroSection')}</h2>
        <HeroConfigForm
          heroImages={heroImages}
          heroTitle={heroTitle}
          heroSubtitle={heroSubtitle}
          onImagesChange={setHeroImages}
          onTitleChange={setHeroTitle}
          onSubtitleChange={setHeroSubtitle}
          onSave={handleSaveHero}
          saving={saving}
        />
      </div>

      {/* Blocks Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t('homeConfigContentBlocks')}</h2>
          <button
            onClick={() => setShowBlockModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('homeConfigAddBlock')}
          </button>
        </div>

        {sortedBlocks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t('homeConfigNoBlocks')}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedBlocks.map((block, index) => {
              const BlockIcon = getBlockIcon(block.type);
              const summary = getBlockSummary(block);
              return (
              <div
                key={block.id}
                className={`group flex items-center gap-4 rounded-xl border p-3.5 transition-shadow hover:shadow-sm ${
                  block.visible ? 'border-gray-200 bg-white' : 'border-dashed border-gray-300 bg-gray-50'
                }`}
              >
                {/* Reorder */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleMoveBlock(block.id, 'up')}
                    disabled={index === 0}
                    className="text-gray-300 transition-colors hover:text-gray-600 disabled:opacity-0"
                    aria-label={t('homeConfigOrder')}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <span className="my-0.5 text-[11px] font-bold tabular-nums text-gray-400">{index + 1}</span>
                  <button
                    onClick={() => handleMoveBlock(block.id, 'down')}
                    disabled={index === sortedBlocks.length - 1}
                    className="text-gray-300 transition-colors hover:text-gray-600 disabled:opacity-0"
                    aria-label={t('homeConfigOrder')}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Icon tile */}
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getBlockTypeColor(block.type)} ${block.visible ? '' : 'opacity-70'}`}>
                  <BlockIcon className="h-5 w-5" />
                </div>

                {/* Block info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getBlockTypeColor(block.type)}`}>
                      {getBlockTypeLabel(block.type)}
                    </span>
                    {!block.visible && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">
                        <EyeOff className="h-3 w-3" /> {t('homeBlockHidden')}
                      </span>
                    )}
                  </div>
                  {summary.title && (
                    <p className="mt-1 truncate text-sm font-semibold text-gray-900">{summary.title}</p>
                  )}
                  {summary.chips.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {summary.chips.map((chip, i) => (
                        <span key={i} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleVisibility(block.id)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    title={block.visible ? t('homeConfigHide') : t('homeConfigShow')}
                  >
                    {block.visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => setEditingBlock(block)}
                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                    title={t('editar')}
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                    title={t('eliminar')}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              );
            })}
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
