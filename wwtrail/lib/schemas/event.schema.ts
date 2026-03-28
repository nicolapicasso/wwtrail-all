import { z } from 'zod';
import { EventStatus, Language } from '@prisma/client';

/**
 * SCHEMAS DE VALIDACIÓN PARA EVENTOS
 */

// ============================================
// CREATE EVENT
// ============================================

export const createEventSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
    country: z.string().min(2, 'Country code required (ISO 2 letters)'),
    city: z.string().min(2, 'City is required'),
    
    // Coordenadas opcionales (PostGIS)
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    
    // URLs opcionales
    websiteUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
    facebookUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
    instagramUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
    
    // Contacto opcional
    email: z.string().email('Invalid email').optional(),
    phone: z.string().optional(),
    
    // Configuración
    isHighlighted: z.boolean().optional(),
    originalLanguage: z.nativeEnum(Language).optional(),
    
    // Año de primera edición (opcional)
    firstEditionYear: z.number().int().min(1900).max(2100).optional(),
  }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>['body'];

// ============================================
// UPDATE EVENT
// ============================================

export const updateEventSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid event ID'),
  }),
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    country: z.string().min(2).optional(),
    city: z.string().min(2).optional(),
    
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    
    websiteUrl: z.string().url().or(z.literal('')).optional(),
    facebookUrl: z.string().url().or(z.literal('')).optional(),
    instagramUrl: z.string().url().or(z.literal('')).optional(),
    
    email: z.string().email().optional(),
    phone: z.string().optional(),
    
    status: z.nativeEnum(EventStatus).optional(),
    isHighlighted: z.boolean().optional(),
    originalLanguage: z.nativeEnum(Language).optional(),
    
    firstEditionYear: z.number().int().min(1900).max(2100).optional(),
  }),
});

export type UpdateEventInput = z.infer<typeof updateEventSchema>['body'];

// ============================================
// GET EVENTS (LIST WITH FILTERS)
// ============================================

export const getEventsSchema = z.object({
  query: z.object({
    // Paginación
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('20').transform(Number),
    
    // Filtros
    search: z.string().optional(),
    country: z.string().optional(),
    isHighlighted: z.string().optional().transform(val => val === 'true'),
    status: z.nativeEnum(EventStatus).optional(),
    
    // Ordenamiento
    sortBy: z.enum(['name', 'createdAt', 'viewCount']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    
    // Idioma (acepta minúsculas y transforma a mayúsculas)
    language: z.string().optional().transform(val => val ? val.toUpperCase() as Language : undefined),
  }),
});

export type GetEventsQuery = z.infer<typeof getEventsSchema>['query'];

// ============================================
// SEARCH EVENTS (FULL-TEXT)
// ============================================

export const searchEventsSchema = z.object({
  query: z.object({
    q: z.string().min(2, 'Search query must be at least 2 characters'),
    limit: z.string().optional().default('20').transform(Number),
  }),
});

export type SearchEventsQuery = z.infer<typeof searchEventsSchema>['query'];

// ============================================
// NEARBY EVENTS (GEOSPATIAL)
// ============================================

export const nearbyEventsSchema = z.object({
  query: z.object({
    lat: z.string().transform(Number).refine(val => val >= -90 && val <= 90, {
      message: 'Latitude must be between -90 and 90',
    }),
    lon: z.string().transform(Number).refine(val => val >= -180 && val <= 180, {
      message: 'Longitude must be between -180 and 180',
    }),
    radius: z.string().optional().default('50').transform(Number).refine(val => val > 0 && val <= 500, {
      message: 'Radius must be between 1 and 500 km',
    }),
  }),
});

export type NearbyEventsQuery = z.infer<typeof nearbyEventsSchema>['query'];

// ============================================
// FEATURED EVENTS
// ============================================

export const featuredEventsSchema = z.object({
  query: z.object({
    limit: z.string().optional().default('10').transform(Number).refine(val => val >= 1 && val <= 50, {
      message: 'Limit must be between 1 and 50',
    }),
  }),
});

export type FeaturedEventsQuery = z.infer<typeof featuredEventsSchema>['query'];

// ============================================
// EVENTS BY COUNTRY
// ============================================

export const eventsByCountrySchema = z.object({
  params: z.object({
    country: z.string().min(2, 'Country code required'),
  }),
  query: z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('20').transform(Number),
  }),
});

export type EventsByCountryParams = z.infer<typeof eventsByCountrySchema>['params'];
export type EventsByCountryQuery = z.infer<typeof eventsByCountrySchema>['query'];

// ============================================
// GET EVENT BY ID
// ============================================

export const eventIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid event ID'),
  }),
});

// ============================================
// GET EVENT BY SLUG
// ============================================

export const eventSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, 'Slug is required'),
  }),
});


/**
 * Schema para rechazar evento con razón
 */
export const rejectEventSchema = z.object({
  body: z.object({
    reason: z.string().min(10, 'Reason must be at least 10 characters').max(500).optional(),
  }),
});

export type RejectEventInput = z.infer<typeof rejectEventSchema>['body'];
