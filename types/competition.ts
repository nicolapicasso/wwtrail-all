// types/competition.ts - Competition types for API v2

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
 * Competition with counts
 */
export interface CompetitionWithCounts extends Competition {
  _count: {
    editions: number;
    translations: number;
  };
}

/**
 * Competition Detail (full info)
 */
export interface CompetitionDetail extends CompetitionWithEvent {
  editions: Array<{
    id: string;
    slug: string;
    year: number;
    startDate: string;
    status: EditionStatus;
    registrationStatus: RegistrationStatus;
  }>;
  translations: Array<{
    id: string;
    language: Language;
    name: string;
    description?: string;
  }>;
  _count: {
    editions: number;
    translations: number;
  };
}

/**
 * Competition Translation
 */
export interface CompetitionTranslation {
  id: string;
  competitionId: string;
  language: Language;
  name: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
  createdAt: string;
  updatedAt: string;
}

/**
 * Edition Status
 */
export enum EditionStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

/**
 * Registration Status
 */
export enum RegistrationStatus {
  NOT_OPEN = 'NOT_OPEN',
  OPEN = 'OPEN',
  FULL = 'FULL',
  CLOSED = 'CLOSED',
}

/**
 * Create Competition Input
 */
export interface CreateCompetitionInput {
  name: string;
  description?: string;
  type: CompetitionType;
  baseDistance?: number;
  baseElevation?: number;
  baseMaxParticipants?: number;
  displayOrder?: number;
}

/**
 * Update Competition Input
 */
export interface UpdateCompetitionInput {
  name?: string;
  description?: string;
  type?: CompetitionType;
  baseDistance?: number;
  baseElevation?: number;
  baseMaxParticipants?: number;
  isActive?: boolean;
  displayOrder?: number;
}

/**
 * Reorder Competitions Input
 */
export interface ReorderCompetitionsInput {
  order: string[]; // Array of competition IDs in new order
}

/**
 * Competition Filters
 */
export interface CompetitionFilters {
  eventId?: string;
  type?: CompetitionType;
  isActive?: boolean;
}
