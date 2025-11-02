import { z } from 'zod';

// Schema para crear resultado
export const createResultSchema = z.object({
  body: z.object({
    competitionId: z.string().uuid('Invalid competition ID'),
    categoryId: z.string().uuid('Invalid category ID'),
    participantId: z.string().uuid('Invalid participant ID'),
    position: z.number().int().positive().optional(),
    time: z.string().regex(/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/, 'Time must be in HH:MM:SS format').optional(),
    timeSeconds: z.number().int().positive().optional(),
    pace: z.string().optional(), // Formato: MM:SS por km
    avgHeartRate: z.number().int().positive().max(250).optional(),
  }),
});

// Schema para actualizar resultado
export const updateResultSchema = z.object({
  body: z.object({
    position: z.number().int().positive().optional(),
    time: z.string().regex(/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/, 'Time must be in HH:MM:SS format').optional(),
    timeSeconds: z.number().int().positive().optional(),
    pace: z.string().optional(),
    avgHeartRate: z.number().int().positive().max(250).optional(),
    isVerified: z.boolean().optional(),
  }),
});

// Schema para listar resultados
export const getResultsSchema = z.object({
  query: z.object({
    competitionId: z.string().uuid('Invalid competition ID').optional(),
    categoryId: z.string().uuid('Invalid category ID').optional(),
    participantId: z.string().uuid('Invalid participant ID').optional(),
    userId: z.string().uuid('Invalid user ID').optional(),
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('20').transform(Number),
    sortBy: z.enum(['position', 'timeSeconds', 'createdAt']).optional().default('position'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
    isVerified: z.string().optional().transform((val) => val === 'true'),
  }),
});

// Schema para resultado por ID
export const resultIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid result ID'),
  }),
});

// Schema para importar múltiples resultados (CSV)
export const importResultsSchema = z.object({
  body: z.object({
    competitionId: z.string().uuid('Invalid competition ID'),
    categoryId: z.string().uuid('Invalid category ID'),
    results: z.array(
      z.object({
        participantId: z.string().uuid().optional(),
        bibNumber: z.string().optional(),
        position: z.number().int().positive(),
        time: z.string().regex(/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/),
        timeSeconds: z.number().int().positive().optional(),
      })
    ).min(1, 'At least one result is required'),
  }),
});

export type CreateResultInput = z.infer<typeof createResultSchema>['body'];
export type UpdateResultInput = z.infer<typeof updateResultSchema>['body'];
export type GetResultsQuery = z.infer<typeof getResultsSchema>['query'];
export type ImportResultsInput = z.infer<typeof importResultsSchema>['body'];
