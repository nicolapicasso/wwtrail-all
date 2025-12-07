// types/home.ts - Types for Home Configuration

export enum HomeBlockType {
  EVENTS = 'EVENTS',
  COMPETITIONS = 'COMPETITIONS',
  EDITIONS = 'EDITIONS',
  SERVICES = 'SERVICES',
  POSTS = 'POSTS',
  TEXT = 'TEXT',
  LINKS = 'LINKS',
  MAP = 'MAP',
}

export type MapMode = 'street' | 'satellite' | 'terrain';

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

export enum HomeTextAlign {
  LEFT = 'LEFT',
  CENTER = 'CENTER',
  RIGHT = 'RIGHT',
}

// Configuraciones específicas por tipo de bloque
export interface ContentBlockConfig {
  limit: number;
  viewType: HomeBlockViewType;
  featuredOnly?: boolean; // Only for EVENTS blocks
}

export interface TextBlockConfig {
  content: string;
  size: HomeTextSize;
  variant: HomeTextVariant;
  align?: HomeTextAlign; // Alineación del texto
}

export interface LinkItem {
  url: string;
  title: string;
  imageUrl: string;
  text?: string; // Párrafo opcional debajo del título
}

export interface LinksBlockConfig {
  items: LinkItem[];
  // Título de la sección
  title?: string;
  titleSize?: HomeTextSize;
  titleAlign?: HomeTextAlign;
  // Subtítulo de la sección
  subtitle?: string;
  subtitleSize?: HomeTextSize;
  subtitleAlign?: HomeTextAlign;
}

export interface MapBlockConfig {
  height: number; // Height in pixels
  mapMode: MapMode; // terrain, satellite, street
  showEvents: boolean;
  showCompetitions: boolean;
  showServices: boolean;
}

export type BlockConfig = ContentBlockConfig | TextBlockConfig | LinksBlockConfig | MapBlockConfig;

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
  heroImages?: string[]; // Array de URLs para el slider de imágenes
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
  heroImages?: string[] | null; // Array de URLs para el slider
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  isActive?: boolean;
}

export interface UpdateFullHomeConfigDTO {
  heroImage?: string | null;
  heroImages?: string[] | null; // Array de URLs para el slider
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
