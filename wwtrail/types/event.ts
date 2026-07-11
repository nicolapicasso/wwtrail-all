// types/event.ts - Event types for API v2
//
// Source of truth: the Prisma `Event` model + the shape the API actually
// returns (apiSuccess wraps payloads in { success, data }; PostGIS enrichment
// injects flat `latitude`/`longitude`). Field names mirror Prisma.

/**
 * Event Status
 */
export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Competition Type
 */
export enum CompetitionType {
  TRAIL = 'TRAIL',
  ULTRA = 'ULTRA',
  VERTICAL = 'VERTICAL',
  SKYRUNNING = 'SKYRUNNING',
  CANICROSS = 'CANICROSS',
  OTHER = 'OTHER',
}

/**
 * Language
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
 * Organizer entity reference (the real organizing club/society).
 * This is the `Organizer` relation — NOT the user who created the event.
 */
export interface EventOrganizerRef {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

/**
 * Event creator/manager reference (a `User` with permissions over the event).
 * This is the `user` relation (relation "EventCreator") — distinct from the
 * `organizer` entity above. Historically these were both called "organizer",
 * which caused the type to never line up with the data.
 */
export interface EventCreatorRef {
  id: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

/**
 * Nested competition summary returned on event detail endpoints.
 */
export interface EventCompetitionSummary {
  id: string;
  slug: string;
  name: string;
  baseDistance?: number | null;
  baseElevation?: number | null;
  status?: EventStatus;
  displayOrder?: number;
  _count?: {
    editions?: number;
  };
}

/**
 * Event - Permanent event entity
 * Example: "UTMB Mont Blanc"
 *
 * Mirrors the Prisma `Event` model plus the API's flat lat/lon enrichment.
 * Relations (`organizer`, `user`, `competitions`, `translations`, `_count`)
 * are optional because different endpoints include different subsets.
 */
export interface Event {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  language: Language;

  // Location — the API returns flat coordinates (PostGIS), not a nested object.
  country: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;

  // Contact / links
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  youtubeUrl?: string | null;

  // Images
  logo?: string | null;
  logoUrl?: string | null;
  coverImage?: string | null;
  coverImageUrl?: string | null;
  gallery: string[]; // Prisma String[]: always present (defaults to [])

  // Ownership
  userId: string;
  organizerId?: string | null;

  // Status & temporal
  status: EventStatus;
  typicalMonth?: number | null;
  firstEditionYear: number;

  // Classification (FASE 1 fields)
  competitionTypeId?: string | null;
  terrainTypeId?: string | null;
  itraPoints?: number | null;
  utmbPoints?: number | null;

  // Metrics
  viewCount: number;
  featured: boolean;

  createdAt: string;
  updatedAt: string;

  // Relations (endpoint-dependent)
  organizer?: EventOrganizerRef | null;
  user?: EventCreatorRef | null;
  competitions?: EventCompetitionSummary[];
  translations?: EventTranslation[];
  _count?: {
    competitions?: number;
    editions?: number;
    reviews?: number;
    translations?: number;
  };

  // getMyEvents adds these for non-admins
  isOwner?: boolean;
  isManager?: boolean;
}

/**
 * Event with its creator/manager user guaranteed present.
 * (Formerly `EventWithOrganizer`, which mislabeled the creator as the organizer.)
 */
export interface EventWithCreator extends Event {
  user: EventCreatorRef;
}

/**
 * Event as seen in management/moderation UIs.
 *
 * NOTE: `adminNotes`, `rejectionReason`, `isFeatured` and the `REJECTED` status
 * are NOT backed by the current Prisma schema (EventStatus is DRAFT/PUBLISHED/
 * CANCELLED; there is no moderation model yet). They are typed as optional here
 * so the management views compile honestly; they will only ever be populated
 * once/if a moderation feature is added on the backend.
 */
export interface ManagedEvent extends Omit<Event, 'status'> {
  status: EventStatus | 'REJECTED';
  isFeatured?: boolean;
  adminNotes?: string | null;
  rejectionReason?: string | null;
}

/**
 * Event with counts
 */
export interface EventWithCounts extends Event {
  _count: {
    competitions?: number;
    translations?: number;
    editions?: number;
    reviews?: number;
  };
}

/**
 * Event with full details (for detail page)
 */
export interface EventDetail extends Event {
  organizer?: EventOrganizerRef | null;
  user?: EventCreatorRef | null;
  competitions: EventCompetitionSummary[];
  translations: EventTranslation[];
  _count: {
    competitions?: number;
    translations?: number;
  };
}

/**
 * Event Translation
 */
export interface EventTranslation {
  id: string;
  eventId: string;
  language: Language;
  name: string;
  description?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
  createdAt: string;
  updatedAt: string;
}

/**
 * Event for search results
 */
export interface EventSearchResult {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  relevance?: number;
}

/**
 * Event for nearby search (geospatial)
 */
export interface EventNearby extends EventSearchResult {
  distance_km: number;
  firstEditionYear?: number;
}

/**
 * Event Statistics
 */
export interface EventStats {
  id: string;
  name: string;
  totalCompetitions: number;
  totalEditions: number;
  totalParticipations: number;
  viewCount: number;
}

/**
 * Create Event Input
 */
export interface CreateEventInput {
  name: string;
  description?: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;

  // Images
  logo?: string;
  logoUrl?: string;
  coverImage?: string;
  coverImageUrl?: string;
  gallery?: string[];

  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  email?: string;
  phone?: string;
  typicalMonth?: number;
  firstEditionYear?: number;
  featured?: boolean;
  language?: Language;
}

/**
 * Update Event Input
 */
export interface UpdateEventInput {
  name?: string;
  description?: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;

  // Images
  logo?: string;
  logoUrl?: string;
  coverImage?: string;
  coverImageUrl?: string;
  gallery?: string[];

  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  email?: string;
  phone?: string;
  status?: EventStatus;
  typicalMonth?: number;
  featured?: boolean;
}

/**
 * Event Filters (for list page)
 */
export interface EventFilters {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  city?: string;
  status?: EventStatus;
  featured?: boolean;
  typicalMonth?: number;
  organizerId?: string;
  language?: Language;
  sortBy?: 'name' | 'createdAt' | 'viewCount' | 'firstEditionYear';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Event List Response (paginated)
 */
export interface EventListResponse {
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * API response envelopes (apiSuccess wraps data in { success, data }).
 */
export type EventsResponse = EventListResponse; // list endpoints unwrap to { data, pagination }
export interface EventResponse {
  success: boolean;
  data: Event;
}
export interface EventStatsResponse {
  success: boolean;
  data: EventStats;
}

/**
 * Write payloads (aliases of the input types for the API client).
 */
export type CreateEventData = CreateEventInput;
export type UpdateEventData = UpdateEventInput;
export interface RejectEventData {
  reason?: string;
  adminNotes?: string;
}

/**
 * Nearby Events Query
 */
export interface NearbyEventsQuery {
  lat: number;
  lon: number;
  radius?: number; // km
  limit?: number;
}

/**
 * Search Events Query
 */
export interface SearchEventsQuery {
  q: string;
  limit?: number;
}
