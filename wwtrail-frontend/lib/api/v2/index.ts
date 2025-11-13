// lib/api/v2/index.ts
// ✅ Central export for v2 services

// Export services only, NOT types
export { eventsService } from './events.service';
export { competitionsService } from './competitions.service';
export { editionsService } from './editions.service';

// Types should be imported from @/types/v2 instead