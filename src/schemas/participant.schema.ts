import { z } from 'zod';

// Schema para registrar participante
export const createParticipantSchema = z.object({
  body: z.object({
    competitionId: z.string().uuid('Invalid competition ID'),
    categoryId: z.string().uuid('Invalid category ID').optional(),
    // Datos opcionales si no es usuario registrado
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    email: z.string().email().optional(),
    bibNumber: z.string().max(20).optional(),
  }),
});

// Schema para actualizar participante
export const updateParticipantSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('Invalid category ID').optional(),
    bibNumber: z.string().max(20).optional(),
    status: z
      .enum(['REGISTERED', 'CONFIRMED', 'DNS', 'DNF', 'DSQ', 'FINISHED'])
      .optional(),
  }),
});

// Schema para listar participantes de una competición
export const getParticipantsSchema = z.object({
  query: z.object({
    competitionId: z.string().uuid('Invalid competition ID').optional(),
    categoryId: z.string().uuid('Invalid category ID').optional(),
    status: z
      .enum(['REGISTERED', 'CONFIRMED', 'DNS', 'DNF', 'DSQ', 'FINISHED'])
      .optional(),
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('20').transform(Number),
    search: z.string().optional(), // Buscar por nombre o email
  }),
});

// Schema para participante por ID
export const participantIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid participant ID'),
  }),
});

export type CreateParticipantInput = z.infer<typeof createParticipantSchema>['body'];
export type UpdateParticipantInput = z.infer<typeof updateParticipantSchema>['body'];
export type GetParticipantsQuery = z.infer<typeof getParticipantsSchema>['query'];
