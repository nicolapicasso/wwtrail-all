import { z } from 'zod';

export const createCompetitionSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
    type: z.enum(['TRAIL', 'ULTRA', 'VERTICAL', 'SKYRUNNING', 'CANICROSS', 'OTHER']),
    startDate: z.string().datetime('Invalid date format'),
    endDate: z.string().datetime('Invalid date format').optional(),
    country: z.string().min(2, 'Country is required'),
    region: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    distance: z.number().positive().optional(),
    elevation: z.number().optional(),
    website: z.string().url().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    registrationUrl: z.string().url().optional().or(z.literal('')),
    registrationStart: z.string().datetime().optional(),
    registrationEnd: z.string().datetime().optional(),
    maxParticipants: z.number().int().positive().optional(),
  }),
});

export const updateCompetitionSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    type: z.enum(['TRAIL', 'ULTRA', 'VERTICAL', 'SKYRUNNING', 'CANICROSS', 'OTHER']).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ONGOING', 'FINISHED', 'CANCELLED']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    country: z.string().optional(),
    region: z.string().optional(),
    city: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    distance: z.number().positive().optional(),
    elevation: z.number().optional(),
    website: z.string().url().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    registrationStatus: z.enum(['OPEN', 'CLOSED', 'FULL', 'COMING_SOON']).optional(),
    registrationUrl: z.string().url().optional().or(z.literal('')),
    registrationStart: z.string().datetime().optional(),
    registrationEnd: z.string().datetime().optional(),
    maxParticipants: z.number().int().positive().optional(),
    isHighlighted: z.boolean().optional(),
  }),
});

export const getCompetitionsSchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    search: z.string().optional(),
    type: z.enum(['TRAIL', 'ULTRA', 'VERTICAL', 'SKYRUNNING', 'CANICROSS', 'OTHER']).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ONGOING', 'FINISHED', 'CANCELLED']).optional(),
    country: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    sortBy: z.enum(['startDate', 'name', 'createdAt', 'viewCount']).optional().default('startDate'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
    language: z.enum(['ES', 'EN', 'IT', 'CA', 'FR', 'DE']).optional(),
  }),
});

export const competitionIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid competition ID'),
  }),
});

export const competitionSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, 'Slug is required'),
  }),
});

// Schema para búsqueda full-text
export const searchCompetitionsSchema = z.object({
  query: z.object({
    q: z.string().min(2, 'Search query must be at least 2 characters'),
    limit: z.string().optional().default('20').transform(Number),
  }),
});

// Schema para búsqueda geoespacial (nearby)
export const nearbyCompetitionsSchema = z.object({
  query: z.object({
    lat: z.string().transform(Number).refine((val) => val >= -90 && val <= 90, {
      message: 'Latitude must be between -90 and 90',
    }),
    lon: z.string().transform(Number).refine((val) => val >= -180 && val <= 180, {
      message: 'Longitude must be between -180 and 180',
    }),
    radius: z.string().optional().default('50').transform(Number).refine((val) => val > 0 && val <= 500, {
      message: 'Radius must be between 1 and 500 km',
    }),
  }),
});

// Schema para obtener destacadas
export const featuredCompetitionsSchema = z.object({
  query: z.object({
    limit: z.string().optional().default('10').transform(Number).refine((val) => val > 0 && val <= 50, {
      message: 'Limit must be between 1 and 50',
    }),
  }),
});

// Schema para obtener próximas
export const upcomingCompetitionsSchema = z.object({
  query: z.object({
    limit: z.string().optional().default('20').transform(Number).refine((val) => val > 0 && val <= 100, {
      message: 'Limit must be between 1 and 100',
    }),
  }),
});

// Schema para obtener por país
export const competitionsByCountrySchema = z.object({
  params: z.object({
    country: z.string().min(2, 'Country code must be at least 2 characters'),
  }),
  query: z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('20').transform(Number),
  }),
});

export type CreateCompetitionInput = z.infer<typeof createCompetitionSchema>['body'];
export type UpdateCompetitionInput = z.infer<typeof updateCompetitionSchema>['body'];
export type GetCompetitionsQuery = z.infer<typeof getCompetitionsSchema>['query'];
export type SearchCompetitionsQuery = z.infer<typeof searchCompetitionsSchema>['query'];
export type NearbyCompetitionsQuery = z.infer<typeof nearbyCompetitionsSchema>['query'];
export type FeaturedCompetitionsQuery = z.infer<typeof featuredCompetitionsSchema>['query'];
export type UpcomingCompetitionsQuery = z.infer<typeof upcomingCompetitionsSchema>['query'];
export type CompetitionsByCountryParams = z.infer<typeof competitionsByCountrySchema>['params'];
export type CompetitionsByCountryQuery = z.infer<typeof competitionsByCountrySchema>['query'];
