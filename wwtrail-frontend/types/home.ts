// types/home.ts - Types for Home Configuration

export enum HomeBlockType {
  EVENTS = 'EVENTS',
  COMPETITIONS = 'COMPETITIONS',
  EDITIONS = 'EDITIONS',
  TEXT = 'TEXT',
  LINKS = 'LINKS',
}

export enum HomeBlockViewType {
  LIST = 'LIST',
  CARDS = 'CARDS',
}

export enum HomeTextSize {
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
}

export enum HomeTextVariant {
  PARAGRAPH = 'PARAGRAPH',
  HEADING = 'HEADING',
}

// Configuraciones específicas por tipo de bloque
export interface ContentBlockConfig {
  limit: number;
  viewType: HomeBlockViewType;
}

export interface TextBlockConfig {
  content: string;
  size: HomeTextSize;
  variant: HomeTextVariant;
}

export interface LinkItem {
  url: string;
  title: string;
  imageUrl: string;
}

export interface LinksBlockConfig {
  items: LinkItem[];
}

export type BlockConfig = ContentBlockConfig | TextBlockConfig | LinksBlockConfig;

// Modelo de bloque
export interface HomeBlock {
  id: string;
  configurationId: string;
  type: HomeBlockType;
  order: number;
  visible: boolean;
  config?: BlockConfig;
  createdAt: string;
  updatedAt: string;
}

// Modelo de configuración
export interface HomeConfiguration {
  id: string;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  isActive: boolean;
  blocks: HomeBlock[];
  createdAt: string;
  updatedAt: string;
}

// DTOs para el admin
export interface CreateHomeBlockDTO {
  type: HomeBlockType;
  order: number;
  visible: boolean;
  config?: BlockConfig;
}

export interface UpdateHomeBlockDTO {
  type?: HomeBlockType;
  order?: number;
  visible?: boolean;
  config?: BlockConfig;
}

export interface UpdateHomeConfigurationDTO {
  heroImage?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  isActive?: boolean;
}

export interface UpdateFullHomeConfigDTO {
  heroImage?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  blocks: Array<{
    id?: string;
    type: HomeBlockType;
    order: number;
    visible: boolean;
    config?: BlockConfig;
  }>;
}
