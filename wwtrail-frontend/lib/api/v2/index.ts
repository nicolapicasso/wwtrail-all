// lib/api/v2/index.ts
// ✅ Central export for v2 services

// Export services only, NOT types
export { default as eventsService } from './events.service';
export { default as competitionsService } from './competitions.service';
export { default as editionsService } from './editions.service';
export { default as servicesService } from './services.service';
export { default as serviceCategoriesService } from './serviceCategories.service';
export { default as organizersService } from './organizers.service';

// Types should be imported from @/types/v2 instead