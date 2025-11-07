import { CompetitionType, Language } from './event';

/**
 * Competition - Distance/modality of an event
 * Example: "UTMB 171K", "CCC 101K"
 */
export interface Competition {
  id: string;
  eventId: string;
  slug: string;
  name: string;
  description?: string;
  type: CompetitionType;
  baseDistance?: number; // km
  baseElevation?: number; // meters D+
  baseMaxParticipants?: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  
  // Relación opcional con Event
  event?: {
    id: string;
    slug: string;
    name: string;
    country: string;
    city: string;
    organizerId: string;
  };
  
  // Contador de ediciones
  _count?: {
    editions: number;
  };
}

/**
 * Competition with Event info
 */
export interface CompetitionWithEvent extends Competition {
  event: {
    id: string;
    slug: string;
    name: string;
    country: string;
    city: string;
    organizerId: string;
  };
}

/**
 * Competition filters
 */
export interface CompetitionFilters {
  page?: number;
  limit?: number;
  type?: CompetitionType;
  country?: string;
  search?: string;
  minDistance?: number;
  maxDistance?: number;
}

/**
 * Paginated response
 */
export interface PaginatedCompetitionsResponse {
  data: Competition[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// ENUMS PARA EDITIONS
// ============================================

/**
 * Edition Status
 */
export enum EditionStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED'
}

/**
 * Registration Status
 */
export enum RegistrationStatus {
  NOT_OPEN = 'NOT_OPEN',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  FULL = 'FULL',
  COMING_SOON = 'COMING_SOON'

}

// ============================================

export { Language } from './event';






















