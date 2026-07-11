// src/schemas/landing.schema.ts
import { z } from 'zod';
import { Language } from '@prisma/client';

export const createLandingSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'El título es obligatorio').max(255),
    slug: z.string().optional(), // Se genera automáticamente si no se proporciona
    language: z.nativeEnum(Language).default(Language.ES),
    coverImage: z.string().url().optional().nullable(),
    gallery: z.array(z.string().url()).optional().default([]),
    content: z.string().min(1, 'El contenido es obligatorio'),
    metaTitle: z.string().max(255).optional().nullable(),
    metaDescription: z.string().optional().nullable(),
  }),
});

export const updateLandingSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    slug: z.string().optional(),
    coverImage: z.string().url().optional().nullable(),
    gallery: z.array(z.string().url()).optional(),
    content: z.string().min(1).optional(),
    metaTitle: z.string().max(255).optional().nullable(),
    metaDescription: z.string().optional().nullable(),
  }),
});

export const getLandingsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
    search: z.string().optional(),
    language: z.nativeEnum(Language).optional(),
  }),
});

export const translateLandingSchema = z.object({
  body: z.object({
    targetLanguages: z.array(z.nativeEnum(Language)).min(1, 'Debes especificar al menos un idioma'),
    overwrite: z.boolean().optional().default(false),
  }),
});

export type CreateLandingInput = z.infer<typeof createLandingSchema>['body'];
export type UpdateLandingInput = z.infer<typeof updateLandingSchema>['body'];
export type GetLandingsQuery = z.infer<typeof getLandingsSchema>['query'];
export type TranslateLandingInput = z.infer<typeof translateLandingSchema>['body'];
