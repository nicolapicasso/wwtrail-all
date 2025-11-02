import { z } from 'zod';

// Schema para actualizar perfil de usuario
export const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
      .optional(),
    bio: z.string().max(500).optional(),
    avatar: z.string().url().optional().or(z.literal('')),
    phone: z.string().optional(),
    country: z.string().min(2).max(2).optional(), // ISO country code
    city: z.string().max(100).optional(),
    language: z.enum(['ES', 'EN', 'IT', 'CA', 'FR', 'DE']).optional(),
  }),
});

// Schema para cambiar contraseña
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'New password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

// Schema para obtener usuario por ID
export const userIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
});

// Schema para listar usuarios (solo admin)
export const getUsersSchema = z.object({
  query: z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('20').transform(Number),
    role: z.enum(['ADMIN', 'ORGANIZER', 'ATHLETE', 'VIEWER']).optional(),
    isActive: z.string().optional().transform((val) => val === 'true'),
    search: z.string().optional(),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
export type GetUsersQuery = z.infer<typeof getUsersSchema>['query'];
