// types/organizer.ts - Organizer entity types

/**
 * Organizer - Entidad organizadora (club, sociedad, etc.)
 */
export interface Organizer {
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
    events: number;
  };

  // Events (only in detail view)
  events?: Array<{
    id: string;
    name: string;
    slug: string;
    city: string;
    country: string;
    logoUrl?: string;
    status: string;
    competitions?: Array<{
      id: string;
      name: string;
      slug: string;
      type: string;
      baseDistance?: number;
      baseElevation?: number;
      logoUrl?: string;
    }>;
  }>;

  createdAt: string;
  updatedAt: string;
}

/**
 * OrganizerListItem - Simplified organizer for lists
 */
export interface OrganizerListItem {
  id: string;
  name: string;
  slug: string;
  country: string;
  logoUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  _count?: {
    events: number;
  };
}

/**
 * CreateOrganizerInput - Data for creating a new organizer
 */
export interface CreateOrganizerInput {
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
 * UpdateOrganizerInput - Data for updating an organizer
 */
export interface UpdateOrganizerInput {
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
 * OrganizerFilters - Filters for listing organizers
 */
export interface OrganizerFilters {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
