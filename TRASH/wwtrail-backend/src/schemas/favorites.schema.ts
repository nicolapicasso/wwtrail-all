import { z } from 'zod';

// Schema for competitionId param
export const competitionIdParamSchema = z.object({
  params: z.object({
    competitionId: z.string().uuid('Invalid competition ID format'),
  }),
});

export type CompetitionIdParam = z.infer<typeof competitionIdParamSchema>['params'];
