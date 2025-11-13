import { z } from 'zod';

// Schema para crear una review
export const createReviewSchema = z.object({
  body: z.object({
    competitionId: z.string().uuid('Invalid competition ID'),
    rating: z
      .number()
      .int('Rating must be an integer')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    comment: z.string().max(1000, 'Comment must be at most 1000 characters').optional(),
  }),
});

// Schema para actualizar una review
export const updateReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .int('Rating must be an integer')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5')
      .optional(),
    comment: z.string().max(1000, 'Comment must be at most 1000 characters').optional(),
  }),
});

// Schema para obtener reviews de una competición
export const getReviewsSchema = z.object({
  params: z.object({
    competitionId: z.string().uuid('Invalid competition ID'),
  }),
  query: z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('10').transform(Number),
    sortBy: z.enum(['createdAt', 'rating']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    rating: z.string().optional().transform(Number).refine((val) => !val || (val >= 1 && val <= 5), {
      message: 'Rating filter must be between 1 and 5',
    }),
  }),
});

// Schema para review por ID
export const reviewIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid review ID'),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>['body'];
export type GetReviewsQuery = z.infer<typeof getReviewsSchema>['query'];
export type GetReviewsParams = z.infer<typeof getReviewsSchema>['params'];
