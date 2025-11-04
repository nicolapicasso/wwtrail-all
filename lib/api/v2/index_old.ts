// lib/api/v2/index.ts - Export all v2 API services

/**
 * Central export for v2 API services
 * Usage: import { eventsService, editionsService } from '@/lib/api/v2'
 */

export { default as eventsService } from './events.service';
export { default as competitionsService } from './competitions.service';
export { default as editionsService } from './editions.service';

// Re-export for convenience
export * from './events.service';
export * from './competitions.service';
export * from './editions.service';
