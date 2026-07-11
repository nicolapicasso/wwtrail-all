// types/v2.ts - Index file for v2 API types

/**
 * Central export for all v2 types
 * Usage: import { Event, Competition, Edition } from '@/types/v2'
 */

// Event types
export * from './event';

// Competition types
export * from './competition';

// Edition types
export * from './edition';

// Service types
export * from './service';

// Organizer types
export * from './organizer';

// SpecialSeries types
export * from './specialSeries';

// TerrainType types
export * from './terrainType';

// Post types
export * from './post';

// Promotion types
export * from './promotion';

// API Response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  status: 'success';
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  status: 'error';
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}
