// src/services/organizer.service.ts
import prisma from '../config/database';
import { cache, CACHE_TTL } from '../config/redis';
import logger from '../utils/logger';
import { generateUniqueSlug } from '../utils/slugify';
import { EventStatus } from '@prisma/client';

interface CreateOrganizerInput {
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

interface UpdateOrganizerInput {
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

interface OrganizerFilters {
  page?: number | string;
  limit?: number | string;
  search?: string;
  country?: string;
  status?: EventStatus;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export class OrganizerService {
  /**
   * Crear un nuevo organizador
   * - Si el usuario es ADMIN → status PUBLISHED
   * - Si el usuario es ORGANIZER → status DRAFT (pendiente aprobación)
   */
  static async create(data: CreateOrganizerInput, userRole: string) {
    try {
      // Determinar status según rol
      const status = userRole === 'ADMIN' ? 'PUBLISHED' : 'DRAFT';

      // Generar slug único
      const slug = await generateUniqueSlug(data.name, prisma.organizer);

      const organizer = await prisma.organizer.create({
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
        },
      });

      // Invalidar caché
      await cache.del('organizers:list');

      logger.info(`✅ Organizer created: ${organizer.id} with status ${status}`);
      return organizer;
    } catch (error) {
      logger.error(`❌ Error creating organizer: ${error}`);
      throw error;
    }
  }

  /**
   * Actualizar un organizador
   */
  static async update(id: string, data: UpdateOrganizerInput, userId: string) {
    // Verificar que el organizador existe
    const organizer = await prisma.organizer.findUnique({
      where: { id },
    });

    if (!organizer) {
      throw new Error('Organizer not found');
    }

    // Verificar permisos (solo creador o admin)
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role !== 'ADMIN' && organizer.createdById !== userId) {
      throw new Error('Unauthorized: Only the creator or admin can update this organizer');
    }

    const updated = await prisma.organizer.update({
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
      },
    });

    // Invalidar caché
    await cache.del('organizers:list');
    await cache.del(`organizer:${id}`);
    await cache.del(`organizer:slug:${organizer.slug}`);

    logger.info(`✅ Organizer updated: ${id}`);
    return updated;
  }

  /**
   * Aprobar un organizador (solo ADMIN)
   */
  static async approve(id: string, userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only admin can approve organizers');
    }

    const organizer = await prisma.organizer.update({
      where: { id },
      data: { status: 'PUBLISHED' },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Invalidar caché
    await cache.del('organizers:list');
    await cache.del(`organizer:${id}`);

    logger.info(`✅ Organizer approved: ${id}`);
    return organizer;
  }

  /**
   * Rechazar/cancelar un organizador (solo ADMIN)
   */
  static async reject(id: string, userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only admin can reject organizers');
    }

    const organizer = await prisma.organizer.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Invalidar caché
    await cache.del('organizers:list');
    await cache.del(`organizer:${id}`);

    logger.info(`✅ Organizer rejected: ${id}`);
    return organizer;
  }

  /**
   * Obtener organizador por ID
   */
  static async getById(id: string) {
    const cacheKey = `organizer:${id}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const organizer = await prisma.organizer.findUnique({
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
        events: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            country: true,
            logoUrl: true,
            status: true,
          },
          where: {
            status: 'PUBLISHED',
          },
        },
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    if (!organizer) {
      throw new Error('Organizer not found');
    }

    await cache.set(cacheKey, JSON.stringify(organizer), CACHE_TTL);
    return organizer;
  }

  /**
   * Obtener organizador por slug
   */
  static async getBySlug(slug: string) {
    const cacheKey = `organizer:slug:${slug}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const organizer = await prisma.organizer.findUnique({
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
        events: {
          include: {
            competitions: {
              select: {
                id: true,
                name: true,
                slug: true,
                type: true,
                baseDistance: true,
                baseElevation: true,
                logoUrl: true,
              },
            },
          },
          where: {
            status: 'PUBLISHED',
          },
        },
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    if (!organizer) {
      throw new Error('Organizer not found');
    }

    await cache.set(cacheKey, JSON.stringify(organizer), CACHE_TTL);
    return organizer;
  }

  /**
   * Listar organizadores con filtros y paginación
   */
  static async getAll(filters: OrganizerFilters = {}) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Filtro por búsqueda
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Filtro por país
    if (filters.country) {
      where.country = filters.country;
    }

    // Filtro por status
    if (filters.status) {
      where.status = filters.status;
    }

    // Ordenamiento
    const sortBy = filters.sortBy || 'name';
    const sortOrder = filters.sortOrder || 'asc';

    const [organizers, total] = await Promise.all([
      prisma.organizer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
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
              events: true,
            },
          },
        },
      }),
      prisma.organizer.count({ where }),
    ]);

    return {
      data: organizers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Eliminar organizador (solo ADMIN)
   */
  static async delete(id: string, userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role !== 'ADMIN') {
      throw new Error('Unauthorized: Only admin can delete organizers');
    }

    const organizer = await prisma.organizer.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    if (!organizer) {
      throw new Error('Organizer not found');
    }

    // No permitir eliminar si tiene eventos asociados
    if (organizer._count.events > 0) {
      throw new Error('Cannot delete organizer with associated events');
    }

    await prisma.organizer.delete({
      where: { id },
    });

    // Invalidar caché
    await cache.del('organizers:list');
    await cache.del(`organizer:${id}`);
    await cache.del(`organizer:slug:${organizer.slug}`);

    logger.info(`✅ Organizer deleted: ${id}`);
    return { message: 'Organizer deleted successfully' };
  }

  /**
   * Verificar disponibilidad de slug
   */
  static async checkSlug(slug: string) {
    const organizer = await prisma.organizer.findUnique({
      where: { slug },
      select: { id: true },
    });

    return {
      available: !organizer,
      slug,
    };
  }
}
