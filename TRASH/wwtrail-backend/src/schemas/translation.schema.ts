import { z } from 'zod';

// Schema para crear/actualizar traducción manual
export const createTranslationSchema = z.object({
  body: z.object({
    competitionId: z.string().uuid('Invalid competition ID'),
    language: z.enum(['ES', 'EN', 'IT', 'CA', 'FR', 'DE']),
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
  }),
});

export const updateTranslationSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').optional(),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVIEW']).optional(),
  }),
});

// Schema para traducción automática con IA
export const autoTranslateSchema = z.object({
  body: z.object({
    competitionId: z.string().uuid('Invalid competition ID'),
    targetLanguages: z
      .array(z.enum(['ES', 'EN', 'IT', 'CA', 'FR', 'DE']))
      .min(1, 'At least one target language is required')
      .max(5, 'Maximum 5 languages at once'),
    overwrite: z.boolean().optional().default(false), // Si sobrescribir traducciones existentes
  }),
});

// Schema para obtener traducciones de una competición
export const getTranslationsSchema = z.object({
  params: z.object({
    competitionId: z.string().uuid('Invalid competition ID'),
  }),
  query: z.object({
    language: z.enum(['ES', 'EN', 'IT', 'CA', 'FR', 'DE']).optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVIEW']).optional(),
  }),
});

// Schema para actualizar estado de traducción
export const updateTranslationStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVIEW']),
  }),
});

// Schema para traducción por ID
export const translationIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid translation ID'),
  }),
});

export type CreateTranslationInput = z.infer<typeof createTranslationSchema>['body'];
export type UpdateTranslationInput = z.infer<typeof updateTranslationSchema>['body'];
export type AutoTranslateInput = z.infer<typeof autoTranslateSchema>['body'];
export type GetTranslationsQuery = z.infer<typeof getTranslationsSchema>['query'];
export type UpdateTranslationStatusInput = z.infer<typeof updateTranslationStatusSchema>['body'];
