// lib/api/v2/index.ts

export { eventsService } from './events.service';
export { competitionsService } from './competitions.service';
export { editionsService } from './editions.service';

export type { Event, EventDetail, EventFilters, EventListResponse } from './events.service';
export type { Competition, Edition as CompetitionEdition } from './competitions.service';
export type { Edition, EditionStats } from './editions.service';