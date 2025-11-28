import { z } from 'zod';

// Schema para crear/actualizar participación
export const userEditionSchema = z.object({
  body: z.object({
    status: z.enum(['COMPLETED', 'DNF']), // Solo finisher o DNF
    finishTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Format must be HH:MM:SS').optional().nullable(),
    position: z.number().int().positive().optional().nullable(),
    categoryPosition: z.number().int().positive().optional().nullable(),
    categoryType: z.enum(['GENERAL', 'MALE', 'FEMALE', 'CATEGORY']).optional().nullable(),
    categoryName: z.string().max(100).optional().nullable(), // Solo si categoryType = CATEGORY
    bibNumber: z.string().max(20).optional().nullable(),
    notes: z.string().max(1000).optional().nullable(),
    personalRating: z.number().int().min(1).max(5).optional().nullable(),
  }),
});

// Schema para el parámetro editionId
export const editionIdParamSchema = z.object({
  params: z.object({
    editionId: z.string().uuid('Invalid edition ID'),
  }),
});

// Schema para el parámetro de participación
export const participationIdParamSchema = z.object({
  params: z.object({
    participationId: z.string().uuid('Invalid participation ID'),
  }),
});

// Schema para buscar ediciones (para selector en perfil)
export const searchEditionsSchema = z.object({
  query: z.object({
    search: z.string().min(2).optional(),
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('20').transform(Number),
  }),
});

export type UserEditionInput = z.infer<typeof userEditionSchema>['body'];
export type SearchEditionsQuery = z.infer<typeof searchEditionsSchema>['query'];
