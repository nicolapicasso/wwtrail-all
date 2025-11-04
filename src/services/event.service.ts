// src/services/event.service.ts
import prisma from '../config/database';
import { cache, CACHE_TTL, CACHE_TTL_LONG } from '../config/redis';
import logger from '../utils/logger';
import { generateUniqueSlug } from '../utils/slugify';
import { EventStatus } from '@prisma/client';

interface CreateEventInput {
  name: string;
  description?: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  websiteUrl?: string;
  email?: string;
  phone?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  logo?: string;
  coverImage?: string;
  images?: string[];
  firstEditionYear?: number;
  isHighlighted?: boolean;
  originalLanguage?: string;
  organizerId: string;
}

interface UpdateEventInput {
  name?: string;
  description?: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  websiteUrl?: string;
  email?: string;
  phone?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  logo?: string;
  coverImage?: string;
  images?: string[];
  firstEditionYear?: number;
  isHighlighted?: boolean;
  status?: EventStatus;
  isActive?: boolean;
}

interface EventFilters {
  page?: number | string;  // ✅ Puede venir como string desde query params
  limit?: number | string; // ✅ Puede venir como string desde query params
  search?: string;
  country?: string;
  isHighlighted?: boolean;
  status?: EventStatus;
  sortBy?: 'name' | 'createdAt' | 'viewCount' | 'firstEditionYear';
  sortOrder?: 'asc' | 'desc';
}

export class EventService {
  /**
   * Obtener eventos del usuario (solo los suyos)
   * ADMIN ve todos, ORGANIZER solo los suyos
   */
  static async getMyEvents(userId: string, userRole: string, filters: any = {}) {
    try {
      const { page = 1, limit = 20, status } = filters;
      const skip = (page - 1) * limit;

      // Base where clause
      const where: any = {};

      // Si es ORGANIZER, solo ve los suyos
      if (userRole !== 'ADMIN') {
        where.organizerId = userId;
      }

      // Filtro de status si se proporciona
      if (status) {
        where.status = status;
      }

      // Obtener eventos
      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            organizer: {
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
        }),
        prisma.event.count({ where }),
      ]);

      logger.info(`Retrieved ${events.length} events for user ${userId}`);

      return {
        data: events,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(`Error getting user events: ${error}`);
      throw error;
    }
  }

  /**
   * Obtener eventos pendientes de aprobación (solo ADMIN)
   */
  static async getPendingEvents(filters: any = {}) {
    try {
      const { page = 1, limit = 20 } = filters;
      const skip = (page - 1) * limit;

      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where: { status: 'DRAFT' },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            organizer: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            _count: {
              select: {
                competitions: true,
              },
            },
          },
        }),
        prisma.event.count({ where: { status: 'DRAFT' } }),
      ]);

      logger.info(`Retrieved ${events.length} pending events`);

      return {
        data: events,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(`Error getting pending events: ${error}`);
      throw error;
    }
  }

  /**
   * Aprobar evento (cambiar status a PUBLISHED)
   * Solo ADMIN
   */
  static async approveEvent(eventId: string, adminId: string) {
    try {
      const event = await prisma.event.update({
        where: { id: eventId },
        data: { 
          status: 'PUBLISHED',
          updatedAt: new Date(),
        },
        include: {
          organizer: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // Invalidar caché
      await cache.del('events:list');
      await cache.del(`event:${eventId}`);

      logger.info(`Event ${eventId} approved by admin ${adminId}`);

      return event;
    } catch (error) {
      logger.error(`Error approving event: ${error}`);
      throw error;
    }
  }

  /**
   * Rechazar evento (cambiar status a REJECTED con razón)
   * Solo ADMIN
   */
  static async rejectEvent(eventId: string, adminId: string, reason?: string) {
    try {
      const event = await prisma.event.update({
        where: { id: eventId },
        data: { 
          status: 'REJECTED',
          updatedAt: new Date(),
        },
        include: {
          organizer: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      logger.warn(`Event ${eventId} rejected by admin ${adminId}. Reason: ${reason || 'No reason provided'}`);

      return event;
    } catch (error) {
      logger.error(`Error rejecting event: ${error}`);
      throw error;
    }
  }

  /**
   * Obtener estadísticas del colaborador
   */
  static async getUserStats(userId: string, userRole: string) {
    try {
      const where: any = userRole === 'ADMIN' ? {} : { organizerId: userId };

      const [total, published, draft, rejected] = await Promise.all([
        prisma.event.count({ where }),
        prisma.event.count({ where: { ...where, status: 'PUBLISHED' } }),
        prisma.event.count({ where: { ...where, status: 'DRAFT' } }),
        prisma.event.count({ where: { ...where, status: 'REJECTED' } }),
      ]);

      const stats = {
        totalEvents: total,
        published,
        draft,
        rejected,
        approvalRate: total > 0 ? ((published / total) * 100).toFixed(1) : '0',
      };

      logger.info(`Stats retrieved for user ${userId}`);
      return stats;
    } catch (error) {
      logger.error(`Error getting user stats: ${error}`);
      throw error;
    }
  }

  // ===================================
  // CRUD BÁSICO
  // ===================================

  /**
   * Crear un nuevo evento
   */
  
  /**
   * Crear evento con lógica de roles
   * - ADMIN: crea con status PUBLISHED
   * - ORGANIZER: crea con status DRAFT (pendiente aprobación)
   */
  static async create(data: any, organizerId: string, userRole: string) {
    try {
      // Determinar status según rol
      const status = userRole === 'ADMIN' ? 'PUBLISHED' : 'DRAFT';

      // Generar slug único
      const slug = await this.generateUniqueSlug(data.name);

      // Preparar coordenadas PostGIS si existen
      let locationData = {};
      if (data.latitude && data.longitude) {
        // Crear el evento primero sin location
        locationData = {
          latitude: data.latitude,
          longitude: data.longitude,
        };
      }

      // Crear evento
      const event = await prisma.event.create({
        data: {
          ...data,
          slug,
          organizerId,
          status, // ✅ Asignar status según rol
          ...locationData,
        },
        include: {
          organizer: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Si tiene coordenadas, actualizar con PostGIS
      if (data.latitude && data.longitude) {
        await prisma.$executeRaw`
          UPDATE events
          SET location = ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)
          WHERE id = ${event.id}::uuid
        `;
      }

      // Invalidar caché
      await cache.del('events:list');

      logger.info(`Event created: ${event.id} by user ${organizerId} with status ${status}`);
      return event;
    } catch (error) {
      logger.error(`Error creating event: ${error}`);
      throw error;
    }
  }
  /**
   * Listar eventos con filtros y paginación
   */
  static async findAll(filters: EventFilters = {}) {
    // ✅ CORRECCIÓN: Convertir explícitamente a números
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const search = filters.search;
    const country = filters.country;
    const isHighlighted = filters.isHighlighted;
    const status = filters.status;
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';

    const skip = (page - 1) * limit;

    // Generar cache key
    const cacheKey = `events:list:${JSON.stringify(filters)}`;
    
    // Intentar obtener del caché
    const cached = await cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Construir where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (country) {
      where.country = country;
    }

    if (isHighlighted !== undefined) {
      where.isHighlighted = isHighlighted;
    }

    if (status) {
      where.status = status;
    }

    // Ejecutar query
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit, // ✅ Ahora es número
        orderBy: { [sortBy]: sortOrder },
        include: {
          organizer: {
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
      }),
      prisma.event.count({ where }),
    ]);

    const result = {
      data: events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    // Guardar en caché
    await cache.set(cacheKey, JSON.stringify(result), CACHE_TTL);

    return result;
  }

  /**
   * Obtener evento por ID
   */
  static async findById(id: string) {
    const cacheKey = `event:${id}`;

    // Intentar caché
    const cached = await cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        competitions: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
          include: {
            _count: {
              select: {
                editions: true,
              },
            },
          },
        },
        translations: true,
        _count: {
          select: {
            competitions: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Incrementar viewCount
    await prisma.event.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    // Guardar en caché
    await cache.set(cacheKey, JSON.stringify(event), CACHE_TTL);

    return event;
  }

  /**
   * Obtener evento por slug
   */
  static async findBySlug(slug: string) {
    const cacheKey = `event:slug:${slug}`;

    // Intentar caché
    const cached = await cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        competitions: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
          include: {
            _count: {
              select: {
                editions: true,
              },
            },
          },
        },
        translations: true,
        _count: {
          select: {
            competitions: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Incrementar viewCount
    await prisma.event.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    // Guardar en caché
    await cache.set(cacheKey, JSON.stringify(event), CACHE_TTL);

    return event;
  }

  /**
   * Actualizar evento
   */
  static async update(id: string, data: UpdateEventInput, userId: string) {
    // Verificar que el evento existe
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Verificar permisos (solo organizador o admin)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user?.role !== 'ADMIN' && event.organizerId !== userId) {
      throw new Error('Unauthorized: Only the organizer or admin can update this event');
    }

    // Actualizar
    const updated = await prisma.event.update({
      where: { id },
      data,
      include: {
        organizer: {
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
    await cache.del(`event:${id}`);
    await cache.del(`event:slug:${event.slug}`);
    await cache.del('events:list');

    logger.info(`Event updated: ${updated.name} (${updated.id})`);

    return updated;
  }

  /**
   * Eliminar evento
   */
  static async delete(id: string, userId: string) {
    // Verificar que existe
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Verificar permisos
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role !== 'ADMIN' && event.organizerId !== userId) {
      throw new Error('Unauthorized: Only the organizer or admin can delete this event');
    }

    // Eliminar (cascade eliminará competitions y editions)
    await prisma.event.delete({
      where: { id },
    });

    // Invalidar caché
    await cache.del(`event:${id}`);
    await cache.del(`event:slug:${event.slug}`);
    await cache.del('events:list');

    logger.warn(`Event deleted: ${event.name} (${event.id})`);

    return { message: 'Event deleted successfully' };
  }

  // ===================================
  // BÚSQUEDAS AVANZADAS
  // ===================================

  /**
   * Búsqueda full-text
   */
  static async search(query: string, limit: number = 20) {
    if (query.length < 2) {
      throw new Error('Search query must be at least 2 characters');
    }

    const cacheKey = `events:search:${query}:${limit}`;

    // Intentar caché
    const cached = await cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Búsqueda con pg_trgm (trigram similarity)
    const events = await prisma.$queryRaw`
      SELECT 
        id, slug, name, city, country, "coverImage",
        "isHighlighted", "viewCount",
        similarity(name, ${query}) + 
        similarity(COALESCE(city, ''), ${query}) + 
        similarity(COALESCE(description, ''), ${query}) as relevance
      FROM events
      WHERE 
        status = 'PUBLISHED'
        AND (
          name ILIKE ${'%' + query + '%'}
          OR city ILIKE ${'%' + query + '%'}
          OR country ILIKE ${'%' + query + '%'}
          OR description ILIKE ${'%' + query + '%'}
        )
      ORDER BY relevance DESC, "viewCount" DESC
      LIMIT ${limit}
    `;

    // Guardar en caché
    await cache.set(cacheKey, JSON.stringify(events), CACHE_TTL);

    logger.info(`Event search: "${query}" - ${(events as any[]).length} results`);

    return events;
  }

  /**
   * Búsqueda geoespacial (eventos cercanos)
   */
  static async findNearby(lat: number, lon: number, radiusKm: number = 50) {
    const radiusMeters = radiusKm * 1000;

    // Query PostGIS
    const events = await prisma.$queryRaw`
      SELECT 
        id, name, slug, city, country, latitude, longitude,
        ST_Distance(
          location::geography,
          ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography
        ) / 1000 as distance_km
      FROM events
      WHERE 
        location IS NOT NULL
        AND status = 'PUBLISHED'
        AND ST_DWithin(
          location::geography,
          ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography,
          ${radiusMeters}
        )
      ORDER BY distance_km
      LIMIT 20
    `;

    logger.info(
      `Events nearby (${lat}, ${lon}) within ${radiusKm}km: ${(events as any[]).length} found`
    );

    return events;
  }

  /**
   * Eventos destacados
   */
  static async getFeatured(limit: number = 10) {
    const cacheKey = `events:featured:${limit}`;

    // Intentar caché
    const cached = await cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const events = await prisma.event.findMany({
      where: {
        isHighlighted: true,
        status: EventStatus.PUBLISHED,
        isActive: true,
      },
      take: limit,
      orderBy: [
        { viewCount: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            competitions: true,
          },
        },
      },
    });

    // Guardar en caché (1 hora)
    await cache.set(cacheKey, JSON.stringify(events), CACHE_TTL_LONG);

    return events;
  }

  /**
   * Eventos por país
   */
  static async getByCountry(country: string, options: { page?: number | string; limit?: number | string } = {}) {
    // ✅ CORRECCIÓN: Convertir explícitamente a números
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 20;
    const skip = (page - 1) * limit;

    const cacheKey = `events:country:${country}:${page}:${limit}`;

    // Intentar caché
    const cached = await cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: {
          country: { equals: country, mode: 'insensitive' },
          status: EventStatus.PUBLISHED,
        },
        skip,
        take: limit, // ✅ Ahora es número
        orderBy: { viewCount: 'desc' },
        include: {
          organizer: {
            select: {
              id: true,
              username: true,
            },
          },
          _count: {
            select: {
              competitions: true,
            },
          },
        },
      }),
      prisma.event.count({
        where: {
          country: { equals: country, mode: 'insensitive' },
          status: EventStatus.PUBLISHED,
        },
      }),
    ]);

    const result = {
      data: events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    // Guardar en caché
    await cache.set(cacheKey, JSON.stringify(result), CACHE_TTL);

    return result;
  }

  /**
   * Estadísticas del evento
   */
  static async getStats(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            competitions: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Contar ediciones totales
    const totalEditions = await prisma.edition.count({
      where: {
        competition: {
          eventId: id,
        },
      },
    });

    // Contar participantes totales (suma de todas las ediciones)
    const participants = await prisma.$queryRaw<[{ total: bigint }]>`
      SELECT COALESCE(SUM(e."currentParticipants"), 0) as total
      FROM editions e
      JOIN competitions c ON e."competitionId" = c.id
      WHERE c."eventId" = ${id}
    `;

    return {
      id: event.id,
      name: event.name,
      totalCompetitions: event._count.competitions,
      totalEditions,
      totalParticipants: Number(participants[0]?.total || 0),
      viewCount: event.viewCount,
      firstEditionYear: event.firstEditionYear,
      isHighlighted: event.isHighlighted,
      status: event.status,
    };
  }
}