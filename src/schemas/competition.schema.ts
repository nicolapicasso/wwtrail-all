import { z } from 'zod';
import { RaceType } from '@prisma/client';

/**
 * SCHEMAS DE VALIDACIÓN PARA COMPETICIONES v2
 */

// ============================================
// CREATE COMPETITION
// ============================================

export const createCompetitionSchema = z.object({
  params: z.object({
    eventId: z.string().uuid('Invalid event ID'),
  }),
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
    type: z.nativeEnum(RaceType),
    
    // Datos base que heredarán las editions
    baseDistance: z.number().positive('Distance must be positive').optional(),
    baseElevation: z.number().int().optional(),
    baseMaxParticipants: z.number().int().positive('Max participants must be positive').optional(),
    basePrice: z.number().positive('Price must be positive').optional(),
    
    // Orden de visualización
    displayOrder: z.number().int().min(0).optional(),
  }),
});

export type CreateCompetitionInput = z.infer<typeof createCompetitionSchema>['body'];

// ============================================
// UPDATE COMPETITION
// ============================================

export const updateCompetitionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid competition ID'),
  }),
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    type: z.nativeEnum(RaceType).optional(),
    
    baseDistance: z.number().positive().optional(),
    baseElevation: z.number().int().optional(),
    baseMaxParticipants: z.number().int().positive().optional(),
    basePrice: z.number().positive().optional(),
    
    displayOrder: z.number().int().min(0).optional(),
  }),
});

export type UpdateCompetitionInput = z.infer<typeof updateCompetitionSchema>['body'];

// ============================================
// GET COMPETITION BY ID
// ============================================

export const competitionIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid competition ID'),
  }),
});

// ============================================
// GET COMPETITION BY SLUG
// ============================================

export const competitionSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, 'Slug is required'),
  }),
});

// ============================================
// GET COMPETITIONS BY EVENT
// ============================================

export const eventIdSchema = z.object({
  params: z.object({
    eventId: z.string().uuid('Invalid event ID'),
  }),
});

// ============================================
// REORDER COMPETITIONS
// ============================================

export const reorderCompetitionsSchema = z.object({
  params: z.object({
    eventId: z.string().uuid('Invalid event ID'),
  }),
  body: z.object({
    order: z.array(
      z.object({
        id: z.string().uuid('Invalid competition ID'),
        displayOrder: z.number().int().min(0, 'Display order must be non-negative'),
      })
    ).min(1, 'Order array must contain at least one item'),
  }),
});

export type ReorderCompetitionsInput = z.infer<typeof reorderCompetitionsSchema>['body'];
