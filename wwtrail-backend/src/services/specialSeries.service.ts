// src/services/specialSeries.service.ts
import prisma from '../config/database';
import { cache, CACHE_TTL } from '../config/redis';
import logger from '../utils/logger';
import { generateUniqueSlug } from '../utils/slugify';
import { EventStatus } from '@prisma/client';

interface CreateSpecialSeriesInput {
  name: string;
  description?: string;
  country: string;
  website?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  logoUrl?: string;
  createdById: string;
}

interface UpdateSpecialSeriesInput {
  name?: string;
  description?: string;
  country?: string;
  website?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  logoUrl?: string;
  status?: EventStatus;
}

interface SpecialSeriesFilters {
  page?: number | string;
  limit?: number | string;
  search?: string;
  country?: string;
  status?: EventStatus;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  createdById?: string; // Filtrar por creador (para organizadores)
}

export class SpecialSeriesService {
  /**
   * Crear una nueva special series
   * - Si el usuario es ADMIN → status PUBLISHED
   * - Si el usuario es ORGANIZER → status DRAFT (pendiente aprobación)
   */
  static async create(data: CreateSpecialSeriesInput, userRole: string) {
    try {
      // Determinar status según rol
      const status = userRole === 'ADMIN' ? 'PUBLISHED' : 'DRAFT';

      // Generar slug único
      const slug = await generateUniqueSlug(data.name, prisma.specialSeries);

      const specialSeries = await prisma.specialSeries.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          country: data.country,
          website: data.website,
          instagramUrl: data.instagramUrl,
          facebookUrl: data.facebookUrl,
          twitterUrl: data.twitterUrl,
          youtubeUrl: data.youtubeUrl,
          logoUrl: data.logoUrl,
          createdById: data.createdById,
          status,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              competitions: true,
            },
          },
        },
      });

      logger.info(`Special series created: ${specialSeries.id} by user ${data.createdById}`);
      return specialSeries;
    } catch (error: any) {
      logger.error('Error creating special series:', error);
      throw new Error(error.message || 'Error creating special series');
    }
  }

  /**
   * Obtener todas las special series (con filtros)
   */
  static async getAll(filters: SpecialSeriesFilters = {}) {
    try {
      const page = parseInt(filters.page as string) || 1;
      const limit = parseInt(filters.limit as string) || 20;
      const skip = (page - 1) * limit;
      const sortBy = filters.sortBy || 'name';
      const sortOrder = filters.sortOrder || 'asc';

      // Construir where clause
      const where: any = {};

      if (filters.search) {
        where.name = {
          contains: filters.search,
          mode: 'insensitive',
        };
      }

      if (filters.country) {
        where.country = filters.country;
      }

      if (filters.status) {
        where.status = filters.status;
      }

      // Filtro por creador (para organizadores que solo ven las suyas)
      if (filters.createdById) {
        where.createdById = filters.createdById;
      }

      // Query
      const [data, total] = await Promise.all([
        prisma.specialSeries.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            _count: {
              select: {
                competitions: true,
              },
            },
          },
        }),
        prisma.specialSeries.count({ where }),
      ]);

      return {
        data,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      logger.error('Error getting special series:', error);
      throw new Error(error.message || 'Error getting special series');
    }
  }

  /**
   * Obtener special series por ID
   */
  static async getById(id: string) {
    try {
      const specialSeries = await prisma.specialSeries.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          competitions: {
            where: { status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' },
            include: {
              event: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  city: true,
                  country: true,
                  logoUrl: true,
                },
              },
            },
          },
          _count: {
            select: {
              competitions: true,
            },
          },
        },
      });

      if (!specialSeries) {
        throw new Error('Special series not found');
      }

      return specialSeries;
    } catch (error: any) {
      logger.error(`Error getting special series ${id}:`, error);
      throw new Error(error.message || 'Error getting special series');
    }
  }

  /**
   * Obtener special series por slug
   */
  static async getBySlug(slug: string) {
    try {
      const cacheKey = `special-series:slug:${slug}`;
      const cached = await cache.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      const specialSeries = await prisma.specialSeries.findUnique({
        where: { slug },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          competitions: {
            where: { status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' },
            include: {
              event: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  city: true,
                  country: true,
                  logoUrl: true,
                },
              },
            },
          },
          translations: true,  // ✅ Include translations
          _count: {
            select: {
              competitions: true,
            },
          },
        },
      });

      if (!specialSeries) {
        throw new Error('Special series not found');
      }

      await cache.set(cacheKey, JSON.stringify(specialSeries), CACHE_TTL);

      return specialSeries;
    } catch (error: any) {
      logger.error(`Error getting special series by slug ${slug}:`, error);
      throw new Error(error.message || 'Error getting special series');
    }
  }

  /**
   * Verificar disponibilidad de slug
   */
  static async checkSlug(slug: string) {
    try {
      const existing = await prisma.specialSeries.findUnique({
        where: { slug },
        select: { id: true },
      });

      return {
        available: !existing,
        slug,
      };
    } catch (error: any) {
      logger.error('Error checking slug:', error);
      throw new Error(error.message || 'Error checking slug');
    }
  }

  /**
   * Actualizar special series
   */
  static async update(id: string, data: UpdateSpecialSeriesInput, userId: string, userRole: string) {
    try {
      // Verificar que existe
      const existing = await prisma.specialSeries.findUnique({
        where: { id },
        select: { createdById: true },
      });

      if (!existing) {
        throw new Error('Special series not found');
      }

      // Solo ADMIN puede editar special series
      // Los organizadores solo pueden crear nuevas, no editar existentes
      if (userRole !== 'ADMIN') {
        throw new Error('No tienes permisos para editar esta serie especial. Los organizadores solo pueden crear nuevas series.');
      }

      // Actualizar
      const updated = await prisma.specialSeries.update({
        where: { id },
        data,
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              competitions: true,
            },
          },
        },
      });

      // Invalidar caché
      await cache.del(`special-series:slug:${updated.slug}`);

      logger.info(`Special series updated: ${id} by user ${userId}`);
      return updated;
    } catch (error: any) {
      logger.error(`Error updating special series ${id}:`, error);
      throw new Error(error.message || 'Error updating special series');
    }
  }

  /**
   * Aprobar special series (ADMIN only)
   */
  static async approve(id: string, userId: string) {
    try {
      const updated = await prisma.specialSeries.update({
        where: { id },
        data: { status: 'PUBLISHED' },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      // Invalidar caché
      await cache.del(`special-series:slug:${updated.slug}`);

      logger.info(`Special series approved: ${id} by admin ${userId}`);
      return updated;
    } catch (error: any) {
      logger.error(`Error approving special series ${id}:`, error);
      throw new Error(error.message || 'Error approving special series');
    }
  }

  /**
   * Rechazar special series (ADMIN only)
   */
  static async reject(id: string, userId: string) {
    try {
      const updated = await prisma.specialSeries.update({
        where: { id },
        data: { status: 'CANCELLED' },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      // Invalidar caché
      await cache.del(`special-series:slug:${updated.slug}`);

      logger.info(`Special series rejected: ${id} by admin ${userId}`);
      return updated;
    } catch (error: any) {
      logger.error(`Error rejecting special series ${id}:`, error);
      throw new Error(error.message || 'Error rejecting special series');
    }
  }

  /**
   * Eliminar special series (ADMIN only)
   */
  static async delete(id: string, userId: string) {
    try {
      const specialSeries = await prisma.specialSeries.findUnique({
        where: { id },
        select: { slug: true },
      });

      if (!specialSeries) {
        throw new Error('Special series not found');
      }

      await prisma.specialSeries.delete({
        where: { id },
      });

      // Invalidar caché
      await cache.del(`special-series:slug:${specialSeries.slug}`);

      logger.info(`Special series deleted: ${id} by admin ${userId}`);
    } catch (error: any) {
      logger.error(`Error deleting special series ${id}:`, error);
      throw new Error(error.message || 'Error deleting special series');
    }
  }
}

export default SpecialSeriesService;
