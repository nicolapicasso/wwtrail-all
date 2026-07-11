// components/home/HomeBlockRenderer.tsx

'use client';

import dynamic from 'next/dynamic';
import { HomeBlockType, type HomeBlock, type ContentBlockConfig, type TextBlockConfig, type LinksBlockConfig, type MapBlockConfig } from '@/types/home';
import { EventsBlock } from './EventsBlock';
import { CompetitionsBlock } from './CompetitionsBlock';
import { EditionsBlock } from './EditionsBlock';
import { ServicesBlock } from './ServicesBlock';
import { PostsBlock } from './PostsBlock';
import { TextBlock } from './TextBlock';
import { LinksBlock } from './LinksBlock';

// Dynamic import for MapBlock (no SSR due to Leaflet)
const MapBlock = dynamic(() => import('./MapBlock').then(mod => ({ default: mod.MapBlock })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">Cargando mapa...</p>
      </div>
    </div>
  ),
});

interface HomeBlockRendererProps {
  block: HomeBlock;
}

export function HomeBlockRenderer({ block }: HomeBlockRendererProps) {
  // No renderizar bloques ocultos
  if (!block.visible) {
    return null;
  }

  // No renderizar si no hay configuración
  if (!block.config) {
    return null;
  }

  switch (block.type) {
    case HomeBlockType.EVENTS:
      return <EventsBlock config={block.config as ContentBlockConfig} />;

    case HomeBlockType.COMPETITIONS:
      return <CompetitionsBlock config={block.config as ContentBlockConfig} />;

    case HomeBlockType.EDITIONS:
      return <EditionsBlock config={block.config as ContentBlockConfig} />;

    case HomeBlockType.SERVICES:
      return <ServicesBlock config={block.config as ContentBlockConfig} />;

    case HomeBlockType.POSTS:
      return <PostsBlock config={block.config as ContentBlockConfig} />;

    case HomeBlockType.TEXT:
      return <TextBlock config={block.config as TextBlockConfig} />;

    case HomeBlockType.LINKS:
      return <LinksBlock config={block.config as LinksBlockConfig} />;

    case HomeBlockType.MAP:
      return <MapBlock config={block.config as MapBlockConfig} />;

    default:
      console.warn(`Unknown block type: ${block.type}`);
      return null;
  }
}
