// components/home/HomeBlockRenderer.tsx

'use client';

import { HomeBlockType, type HomeBlock, type ContentBlockConfig, type TextBlockConfig, type LinksBlockConfig } from '@/types/home';
import { EventsBlock } from './EventsBlock';
import { CompetitionsBlock } from './CompetitionsBlock';
import { EditionsBlock } from './EditionsBlock';
import { ServicesBlock } from './ServicesBlock';
import { PostsBlock } from './PostsBlock';
import { TextBlock } from './TextBlock';
import { LinksBlock } from './LinksBlock';

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

    default:
      console.warn(`Unknown block type: ${block.type}`);
      return null;
  }
}
