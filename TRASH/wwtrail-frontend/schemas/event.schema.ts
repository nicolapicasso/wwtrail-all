import { z } from 'zod';

// Schema para crear/editar evento
export const eventSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones')
    .optional(),
  
  description: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres')
    .optional(),
  
  country: z
    .string()
    .length(2, 'El código de país debe tener 2 caracteres')
    .toUpperCase(),
  
  city: z
    .string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres'),
  
  address: z
    .string()
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .optional(),
  
  latitude: z
    .number()
    .min(-90, 'Latitud inválida')
    .max(90, 'Latitud inválida')
    .optional()
    .nullable(),
  
  longitude: z
    .number()
    .min(-180, 'Longitud inválida')
    .max(180, 'Longitud inválida')
    .optional()
    .nullable(),
  
  websiteUrl: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  
  registrationUrl: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  
  contactEmail: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  
  contactPhone: z
    .string()
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional()
    .or(z.literal('')),
  
  imageUrl: z
    .string()
    .url('URL de imagen inválida')
    .optional()
    .or(z.literal('')),
  
  logoUrl: z
    .string()
    .url('URL de logo inválida')
    .optional()
    .or(z.literal('')),
  
  isHighlighted: z
    .boolean()
    .optional()
    .default(false),
});

export type EventFormData = z.infer<typeof eventSchema>;

// Schema para rechazo de evento (solo admin)
export const rejectEventSchema = z.object({
  reason: z
    .string()
    .min(10, 'La razón debe tener al menos 10 caracteres')
    .max(500, 'La razón no puede exceder 500 caracteres'),
});

export type RejectEventFormData = z.infer<typeof rejectEventSchema>;
