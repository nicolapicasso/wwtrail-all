// types/specialSeries.ts - SpecialSeries entity types

/**
 * SpecialSeries - Circuitos/series especiales que agrupan competiciones
 * Ejemplo: UTMB World Series, Golden Trail Series
 */
export interface SpecialSeries {
  id: string;
  name: string;
  slug: string;
  description?: string;
  country: string;

  // Contact info
  website?: string;

  // Social media
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;

  // Images
  logoUrl?: string;

  // Status
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';

  // Relations
  createdById: string;
  createdBy?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };

  // Statistics
  _count?: {
    competitions: number;
  };

  // Competitions (only in detail view)
  competitions?: Array<{
    id: string;
    name: string;
    slug: string;
    type: string;
    baseDistance?: number;
    baseElevation?: number;
    logoUrl?: string;
    event?: {
      id: string;
      name: string;
      slug: string;
      country: string;
      city: string;
    };
  }>;

  createdAt: string;
  updatedAt: string;
}

/**
 * SpecialSeriesListItem - Simplified special series for lists
 */
export interface SpecialSeriesListItem {
  id: string;
  name: string;
  slug: string;
  country: string;
  logoUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  _count?: {
    competitions: number;
  };
}

/**
 * CreateSpecialSeriesInput - Data for creating a new special series
 */
export interface CreateSpecialSeriesInput {
  name: string;
  description?: string;
  country: string;
  website?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  logoUrl?: string;
}

/**
 * UpdateSpecialSeriesInput - Data for updating a special series
 */
export interface UpdateSpecialSeriesInput {
  name?: string;
  description?: string;
  country?: string;
  website?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  logoUrl?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
}

/**
 * SpecialSeriesFilters - Filters for listing special series
 */
export interface SpecialSeriesFilters {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
