import { z } from 'zod';

// ===================================
// ENUMS
// ===================================

export const HomeBlockTypeSchema = z.enum(['EVENTS', 'COMPETITIONS', 'EDITIONS', 'SERVICES', 'POSTS', 'TEXT', 'LINKS']);
export const HomeBlockViewTypeSchema = z.enum(['LIST', 'CARDS']);
export const HomeTextSizeSchema = z.enum(['SM', 'MD', 'LG', 'XL']);
export const HomeTextVariantSchema = z.enum(['PARAGRAPH', 'HEADING']);

// ===================================
// CONFIG SCHEMAS (por tipo de bloque)
// ===================================

// Config para bloques EVENTS, COMPETITIONS, EDITIONS, SERVICES, POSTS
export const ContentBlockConfigSchema = z.object({
  limit: z.number().int().min(1).max(50).default(6),
  viewType: HomeBlockViewTypeSchema.default('CARDS'),
  featuredOnly: z.boolean().default(false),
});

// Config para bloques TEXT
export const TextBlockConfigSchema = z.object({
  content: z.string().min(1).max(5000),
  size: HomeTextSizeSchema.default('MD'),
  variant: HomeTextVariantSchema.default('PARAGRAPH'),
});

// Config para bloques LINKS
export const LinkItemSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1).max(200),
  imageUrl: z.string().url(),
});

export const LinksBlockConfigSchema = z.object({
  items: z.array(LinkItemSchema).min(1).max(12),
});

// ===================================
// HOME BLOCK SCHEMA
// ===================================

export const createHomeBlockSchema = z.object({
  body: z.object({
    type: HomeBlockTypeSchema,
    order: z.number().int().min(0).default(0),
    visible: z.boolean().default(true),
    config: z.union([
      ContentBlockConfigSchema,
      TextBlockConfigSchema,
      LinksBlockConfigSchema,
    ]).optional(),
  }),
});

export const updateHomeBlockSchema = z.object({
  body: z.object({
    type: HomeBlockTypeSchema.optional(),
    order: z.number().int().min(0).optional(),
    visible: z.boolean().optional(),
    config: z.union([
      ContentBlockConfigSchema,
      TextBlockConfigSchema,
      LinksBlockConfigSchema,
    ]).optional(),
  }),
});

// ===================================
// HOME CONFIGURATION SCHEMA
// ===================================

export const createHomeConfigurationSchema = z.object({
  body: z.object({
    heroImage: z.string().url().optional(),
    heroImages: z.array(z.string().url()).optional(), // Array de URLs para el slider
    heroTitle: z.string().min(1).max(200).optional(),
    heroSubtitle: z.string().min(1).max(500).optional(),
    isActive: z.boolean().default(true),
  }),
});

export const updateHomeConfigurationSchema = z.object({
  body: z.object({
    heroImage: z.string().url().optional().nullable(),
    heroImages: z.array(z.string().url()).optional().nullable(), // Array de URLs para el slider
    heroTitle: z.string().min(1).max(200).optional().nullable(),
    heroSubtitle: z.string().min(1).max(500).optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

// ===================================
// BULK UPDATE SCHEMA (actualizar configuración completa)
// ===================================

export const updateFullHomeConfigSchema = z.object({
  body: z.object({
    heroImage: z.string().url().optional().nullable(),
    heroImages: z.array(z.string().url()).optional().nullable(), // Array de URLs para el slider
    heroTitle: z.string().min(1).max(200).optional().nullable(),
    heroSubtitle: z.string().min(1).max(500).optional().nullable(),
    blocks: z.array(
      z.object({
        id: z.string().uuid().optional(), // Si tiene ID, actualiza; si no, crea
        type: HomeBlockTypeSchema,
        order: z.number().int().min(0),
        visible: z.boolean(),
        config: z.union([
          ContentBlockConfigSchema,
          TextBlockConfigSchema,
          LinksBlockConfigSchema,
        ]).optional(),
      })
    ),
  }),
});

// ===================================
// REORDER BLOCKS SCHEMA
// ===================================

export const reorderBlocksSchema = z.object({
  body: z.object({
    blockOrders: z.array(
      z.object({
        id: z.string().uuid(),
        order: z.number().int().min(0),
      })
    ).min(1),
  }),
});

// ===================================
// TYPES
// ===================================

export type CreateHomeBlockInput = z.infer<typeof createHomeBlockSchema>['body'];
export type UpdateHomeBlockInput = z.infer<typeof updateHomeBlockSchema>['body'];
export type CreateHomeConfigurationInput = z.infer<typeof createHomeConfigurationSchema>['body'];
export type UpdateHomeConfigurationInput = z.infer<typeof updateHomeConfigurationSchema>['body'];
export type UpdateFullHomeConfigInput = z.infer<typeof updateFullHomeConfigSchema>['body'];
export type ReorderBlocksInput = z.infer<typeof reorderBlocksSchema>['body'];

export type ContentBlockConfig = z.infer<typeof ContentBlockConfigSchema>;
export type TextBlockConfig = z.infer<typeof TextBlockConfigSchema>;
export type LinksBlockConfig = z.infer<typeof LinksBlockConfigSchema>;
export type LinkItem = z.infer<typeof LinkItemSchema>;
