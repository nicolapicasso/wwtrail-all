// src/schemas/import.schema.ts
import { z } from 'zod';

// ============================================
// ORGANIZER IMPORT SCHEMA
// ============================================
export const importOrganizerSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
});

export type ImportOrganizer = z.infer<typeof importOrganizerSchema>;

// ============================================
// SPECIAL SERIES IMPORT SCHEMA
// ============================================
export const importSeriesSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
});

export type ImportSeries = z.infer<typeof importSeriesSchema>;

// ============================================
// EVENT IMPORT SCHEMA
// ============================================
export const importEventSchema = z.object({
  id: z.string().uuid(),
  wp_grupo: z.string().optional(),
  wp_id: z.number().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  country: z.string().length(2).nullable(),
  city: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  website: z.string(),
  phone: z.string(),
  email: z.string(),
  instagram: z.string(),
  facebook: z.string(),
  typicalMonth: z.number().min(1).max(12).nullable(),
  status: z.enum(['PUBLISHED', 'DRAFT']),
});

export type ImportEvent = z.infer<typeof importEventSchema>;

// ============================================
// COMPETITION IMPORT SCHEMA
// ============================================
export const importCompetitionSchema = z.object({
  id: z.string().uuid(),
  wp_id: z.number(),
  eventId: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  baseDistance: z.number().nullable(),
  baseElevation: z.number().nullable(),
  itraPoints: z.number().min(0).max(6).nullable(),
  terrainType: z.string().nullable(),
  series: z.array(z.string()),
  organizerSlug: z.string().nullable(),
  featured: z.boolean(),
  status: z.enum(['PUBLISHED', 'DRAFT']),
  language: z.enum(['ES', 'IT', 'EN', 'FR', 'DE', 'CA']),
});

export type ImportCompetition = z.infer<typeof importCompetitionSchema>;

// ============================================
// FULL IMPORT SCHEMA
// ============================================
export const fullImportSchema = z.object({
  organizers: z.array(importOrganizerSchema).optional(),
  series: z.array(importSeriesSchema).optional(),
  events: z.array(importEventSchema).optional(),
  competitions: z.array(importCompetitionSchema).optional(),
});

export type FullImport = z.infer<typeof fullImportSchema>;

// ============================================
// IMPORT RESULT
// ============================================
export interface ImportResult {
  created: number;
  skipped: number;
  errors: Array<{ identifier: string; error: string }>;
}

export interface FullImportResult {
  organizers?: ImportResult;
  series?: ImportResult;
  events?: ImportResult;
  competitions?: ImportResult;
  terrainTypes?: ImportResult;
}
