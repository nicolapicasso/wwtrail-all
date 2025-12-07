// components/admin/home/BlockConfigModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { homeService } from '@/lib/api/home.service';
import FileUpload from '@/components/FileUpload';
import type {
  HomeBlock,
  HomeBlockType,
  ContentBlockConfig,
  TextBlockConfig,
  LinksBlockConfig,
  MapBlockConfig,
  HomeBlockViewType,
  HomeTextSize,
  HomeTextVariant,
  HomeTextAlign,
  LinkItem,
  MapMode,
} from '@/types/home';

interface BlockConfigModalProps {
  configId: string;
  block: HomeBlock | null; // null = creating new block
  onClose: () => void;
  onSaved: () => void;
}

export function BlockConfigModal({ configId, block, onClose, onSaved }: BlockConfigModalProps) {
  const isEditing = !!block;

  // Common fields
  const [blockType, setBlockType] = useState<HomeBlockType>(block?.type || 'EVENTS');
  const [visible, setVisible] = useState(block?.visible ?? true);
  const [order, setOrder] = useState(block?.order ?? 0);

  // Content block config (EVENTS, COMPETITIONS, EDITIONS)
  const [limit, setLimit] = useState(6);
  const [viewType, setViewType] = useState<HomeBlockViewType>('CARDS');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Text block config
  const [textContent, setTextContent] = useState('');
  const [textSize, setTextSize] = useState<HomeTextSize>('MD');
  const [textVariant, setTextVariant] = useState<HomeTextVariant>('PARAGRAPH');
  const [textAlign, setTextAlign] = useState<HomeTextAlign>('LEFT');

  // Links block config
  const [items, setItems] = useState<LinkItem[]>([]);
  const [linksTitle, setLinksTitle] = useState('');
  const [linksTitleSize, setLinksTitleSize] = useState<HomeTextSize>('XL');
  const [linksTitleAlign, setLinksTitleAlign] = useState<HomeTextAlign>('CENTER');
  const [linksSubtitle, setLinksSubtitle] = useState('');
  const [linksSubtitleSize, setLinksSubtitleSize] = useState<HomeTextSize>('MD');
  const [linksSubtitleAlign, setLinksSubtitleAlign] = useState<HomeTextAlign>('CENTER');

  // Map block config
  const [mapHeight, setMapHeight] = useState(400);
  const [mapMode, setMapMode] = useState<MapMode>('terrain');
  const [showEvents, setShowEvents] = useState(true);
  const [showCompetitions, setShowCompetitions] = useState(true);
  const [showServices, setShowServices] = useState(true);

  const [saving, setSaving] = useState(false);

  // Load existing config
  useEffect(() => {
    if (block?.config) {
      const config = block.config;

      if (block.type === 'EVENTS' || block.type === 'COMPETITIONS' || block.type === 'EDITIONS' || block.type === 'SERVICES' || block.type === 'POSTS') {
        const contentConfig = config as ContentBlockConfig;
        setLimit(contentConfig.limit);
        setViewType(contentConfig.viewType);
        setFeaturedOnly(contentConfig.featuredOnly || false);
      } else if (block.type === 'TEXT') {
        const textConfig = config as TextBlockConfig;
        setTextContent(textConfig.content);
        setTextSize(textConfig.size);
        setTextVariant(textConfig.variant);
        setTextAlign(textConfig.align || 'LEFT');
      } else if (block.type === 'LINKS') {
        const linksConfig = config as LinksBlockConfig;
        setItems(linksConfig.items || []);
        setLinksTitle(linksConfig.title || '');
        setLinksTitleSize(linksConfig.titleSize || 'XL');
        setLinksTitleAlign(linksConfig.titleAlign || 'CENTER');
        setLinksSubtitle(linksConfig.subtitle || '');
        setLinksSubtitleSize(linksConfig.subtitleSize || 'MD');
        setLinksSubtitleAlign(linksConfig.subtitleAlign || 'CENTER');
      } else if (block.type === 'MAP') {
        const mapConfig = config as MapBlockConfig;
        setMapHeight(mapConfig.height || 400);
        setMapMode(mapConfig.mapMode || 'terrain');
        setShowEvents(mapConfig.showEvents ?? true);
        setShowCompetitions(mapConfig.showCompetitions ?? true);
        setShowServices(mapConfig.showServices ?? true);
      }
    }
  }, [block]);

  const buildConfig = () => {
    if (blockType === 'EVENTS' || blockType === 'COMPETITIONS' || blockType === 'EDITIONS' || blockType === 'SERVICES' || blockType === 'POSTS') {
      const config: ContentBlockConfig = {
        limit,
        viewType,
        featuredOnly,
      };
      return config;
    } else if (blockType === 'TEXT') {
      return {
        content: textContent,
        size: textSize,
        variant: textVariant,
        align: textAlign,
      } as TextBlockConfig;
    } else if (blockType === 'LINKS') {
      return {
        items,
        title: linksTitle || undefined,
        titleSize: linksTitleSize,
        titleAlign: linksTitleAlign,
        subtitle: linksSubtitle || undefined,
        subtitleSize: linksSubtitleSize,
        subtitleAlign: linksSubtitleAlign,
      } as LinksBlockConfig;
    } else if (blockType === 'MAP') {
      return {
        height: mapHeight,
        mapMode: mapMode,
        showEvents,
        showCompetitions,
        showServices,
      } as MapBlockConfig;
    }
    return {};
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const config = buildConfig();

      if (isEditing && block) {
        // Update existing block
        await homeService.updateBlock(block.id, {
          type: blockType,
          order,
          visible,
          config,
        });
      } else {
        // Create new block
        await homeService.createBlock(configId, {
          type: blockType,
          order,
          visible,
          config,
        });
      }

      onSaved();
    } catch (error) {
      console.error('Error saving block:', error);
      alert('Error al guardar el bloque');
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    setItems([...items, { title: '', url: '', imageUrl: '', text: '' }]);
  };

  const updateLink = (index: number, field: keyof LinkItem, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeLink = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Selector de alineación reutilizable
  const AlignSelect = ({ value, onChange, id }: { value: HomeTextAlign; onChange: (v: HomeTextAlign) => void; id: string }) => (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as HomeTextAlign)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="LEFT">Izquierda</option>
      <option value="CENTER">Centrado</option>
      <option value="RIGHT">Derecha</option>
    </select>
  );

  // Selector de tamaño reutilizable
  const SizeSelect = ({ value, onChange, id }: { value: HomeTextSize; onChange: (v: HomeTextSize) => void; id: string }) => (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as HomeTextSize)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="SM">Pequeño</option>
      <option value="MD">Mediano</option>
      <option value="LG">Grande</option>
      <option value="XL">Extra Grande</option>
    </select>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Bloque' : 'Nuevo Bloque'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Block Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Bloque
            </label>
            <select
              value={blockType}
              onChange={(e) => setBlockType(e.target.value as HomeBlockType)}
              disabled={isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="EVENTS">Eventos</option>
              <option value="COMPETITIONS">Competiciones</option>
              <option value="EDITIONS">Ediciones</option>
              <option value="SERVICES">Servicios</option>
              <option value="POSTS">Artículos (Magazine)</option>
              <option value="TEXT">Texto</option>
              <option value="LINKS">Enlaces</option>
              <option value="MAP">Mapa</option>
            </select>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orden
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Visible */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="visible"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="visible" className="text-sm font-medium text-gray-700">
              Visible en la home
            </label>
          </div>

          {/* Config específica por tipo */}
          {(blockType === 'EVENTS' || blockType === 'COMPETITIONS' || blockType === 'EDITIONS' || blockType === 'SERVICES' || blockType === 'POSTS') && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Configuración de Contenido</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Límite de elementos
                </label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value) || 6)}
                  min={1}
                  max={50}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de vista
                </label>
                <select
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value as HomeBlockViewType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="CARDS">Tarjetas (Grid)</option>
                  <option value="LIST">Lista</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredOnly"
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="featuredOnly" className="text-sm font-medium text-gray-700">
                  Solo elementos destacados
                </label>
              </div>
            </div>
          )}

          {blockType === 'TEXT' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Configuración de Texto</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño
                  </label>
                  <SizeSelect value={textSize} onChange={setTextSize} id="textSize" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alineación
                  </label>
                  <AlignSelect value={textAlign} onChange={setTextAlign} id="textAlign" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variante
                </label>
                <select
                  value={textVariant}
                  onChange={(e) => setTextVariant(e.target.value as HomeTextVariant)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PARAGRAPH">Párrafo</option>
                  <option value="HEADING">Encabezado</option>
                </select>
              </div>
            </div>
          )}

          {blockType === 'LINKS' && (
            <div className="space-y-4 border-t pt-4">
              {/* Título y Subtítulo de la sección */}
              <h3 className="font-semibold text-gray-900">Título de la Sección</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={linksTitle}
                  onChange={(e) => setLinksTitle(e.target.value)}
                  placeholder="Título de la sección (opcional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño del título
                  </label>
                  <SizeSelect value={linksTitleSize} onChange={setLinksTitleSize} id="linksTitleSize" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alineación del título
                  </label>
                  <AlignSelect value={linksTitleAlign} onChange={setLinksTitleAlign} id="linksTitleAlign" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={linksSubtitle}
                  onChange={(e) => setLinksSubtitle(e.target.value)}
                  placeholder="Subtítulo de la sección (opcional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño del subtítulo
                  </label>
                  <SizeSelect value={linksSubtitleSize} onChange={setLinksSubtitleSize} id="linksSubtitleSize" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alineación del subtítulo
                  </label>
                  <AlignSelect value={linksSubtitleAlign} onChange={setLinksSubtitleAlign} id="linksSubtitleAlign" />
                </div>
              </div>

              {/* Enlaces */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Enlaces</h3>
                  <button
                    onClick={addLink}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Agregar Enlace
                  </button>
                </div>

                {items.map((item, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Enlace {index + 1}</span>
                      <button
                        onClick={() => removeLink(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
                      <input
                        type="text"
                        placeholder="Título del enlace"
                        value={item.title}
                        onChange={(e) => updateLink(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Texto (opcional)</label>
                      <textarea
                        placeholder="Descripción o párrafo bajo el título"
                        value={item.text || ''}
                        onChange={(e) => updateLink(index, 'text', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                      <input
                        type="text"
                        placeholder="https://ejemplo.com"
                        value={item.url}
                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Imagen</label>
                      <FileUpload
                        onUpload={(url) => updateLink(index, 'imageUrl', url)}
                        currentUrl={item.imageUrl}
                        buttonText="Subir imagen"
                        fieldname="link"
                        maxSizeMB={5}
                        showPreview={true}
                      />
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay enlaces. Agrega al menos uno.
                  </p>
                )}
              </div>
            </div>
          )}

          {blockType === 'MAP' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Configuración del Mapa</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (píxeles)
                </label>
                <input
                  type="number"
                  value={mapHeight}
                  onChange={(e) => setMapHeight(parseInt(e.target.value) || 400)}
                  min={200}
                  max={800}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">El zoom se ajusta automáticamente para mostrar todos los elementos</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Mapa
                </label>
                <select
                  value={mapMode}
                  onChange={(e) => setMapMode(e.target.value as MapMode)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="terrain">Terreno (OpenTopoMap)</option>
                  <option value="satellite">Satélite (ESRI)</option>
                  <option value="street">Calles (OpenStreetMap)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Elementos a mostrar
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showEvents}
                      onChange={(e) => setShowEvents(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Eventos</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCompetitions}
                      onChange={(e) => setShowCompetitions(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Competiciones</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showServices}
                      onChange={(e) => setShowServices(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Servicios</span>
                  </label>
                </div>
                {!showEvents && !showCompetitions && !showServices && (
                  <p className="text-xs text-red-500 mt-1">
                    Selecciona al menos un tipo de elemento
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
