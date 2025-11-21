// types/post.ts - Post/Article entity types

/**
 * PostCategory - Categorías de artículos del magazine
 */
export enum PostCategory {
  GENERAL = 'GENERAL',
  TRAINING = 'TRAINING',
  NUTRITION = 'NUTRITION',
  GEAR = 'GEAR',
  DESTINATIONS = 'DESTINATIONS',
  INTERVIEWS = 'INTERVIEWS',
  RACE_REPORTS = 'RACE_REPORTS',
  TIPS = 'TIPS',
}

/**
 * PostStatus - Estados de publicación
 */
export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Language - Idiomas disponibles
 */
export enum Language {
  ES = 'ES',
  EN = 'EN',
  IT = 'IT',
  CA = 'CA',
  FR = 'FR',
  DE = 'DE',
}

/**
 * PostImage - Imagen de la galería de un post
 */
export interface PostImage {
  id: string;
  postId: string;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * PostTag - Etiqueta/tag de un post
 */
export interface PostTag {
  id: string;
  name: string;
  slug: string;
}

/**
 * Post - Artículo completo del magazine/blog
 */
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Clasificación
  category: PostCategory;
  status: PostStatus;
  language: Language;

  // Relaciones con eventos/competiciones/ediciones
  eventId?: string;
  event?: {
    id: string;
    name: string;
    slug: string;
    coverImageUrl?: string;
    city: string;
    country: string;
  };

  competitionId?: string;
  competition?: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    type: string;
  };

  editionId?: string;
  edition?: {
    id: string;
    year: number;
    slug: string;
    startDate: string;
  };

  // Autor
  authorId: string;
  author?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };

  // Estadísticas
  viewCount: number;
  publishedAt?: string;
  scheduledPublishAt?: string;

  // Colecciones relacionadas
  images?: PostImage[];
  tags?: PostTag[];

  createdAt: string;
  updatedAt: string;
}

/**
 * PostListItem - Versión simplificada para listados
 */
export interface PostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  category: PostCategory;
  status: PostStatus;
  language: Language;

  author?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };

  event?: {
    id: string;
    name: string;
    slug: string;
  };

  competition?: {
    id: string;
    name: string;
    slug: string;
  };

  edition?: {
    id: string;
    year: number;
    slug: string;
  };

  viewCount: number;
  publishedAt?: string;
  createdAt: string;
}

/**
 * CreatePostInput - Datos para crear un nuevo post
 */
export interface CreatePostInput {
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  category: PostCategory;
  language: Language;
  eventId?: string;
  competitionId?: string;
  editionId?: string;
  publishedAt?: string;
  scheduledPublishAt?: string;
  images?: Array<{
    imageUrl: string;
    caption?: string;
    sortOrder: number;
  }>;
}

/**
 * UpdatePostInput - Datos para actualizar un post
 */
export interface UpdatePostInput {
  title?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  category?: PostCategory;
  language?: Language;
  eventId?: string;
  competitionId?: string;
  editionId?: string;
  status?: PostStatus;
  publishedAt?: string;
  scheduledPublishAt?: string;
}

/**
 * PostFilters - Filtros para listar posts
 */
export interface PostFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: PostCategory;
  language?: Language;
  status?: PostStatus;
  authorId?: string;
  eventId?: string;
  competitionId?: string;
  editionId?: string;
  sortBy?: 'publishedAt' | 'createdAt' | 'viewCount' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Category labels for UI
export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  [PostCategory.GENERAL]: 'General',
  [PostCategory.TRAINING]: 'Entrenamiento',
  [PostCategory.NUTRITION]: 'Nutrición',
  [PostCategory.GEAR]: 'Equipamiento',
  [PostCategory.DESTINATIONS]: 'Destinos',
  [PostCategory.INTERVIEWS]: 'Entrevistas',
  [PostCategory.RACE_REPORTS]: 'Crónicas de Carrera',
  [PostCategory.TIPS]: 'Consejos',
};

// Language labels for UI
export const LANGUAGE_LABELS: Record<Language, string> = {
  [Language.ES]: 'Español',
  [Language.EN]: 'English',
  [Language.IT]: 'Italiano',
  [Language.CA]: 'Català',
  [Language.FR]: 'Français',
  [Language.DE]: 'Deutsch',
};
