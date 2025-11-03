import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { CreateCompetitionInput, UpdateCompetitionInput } from '../schemas/competition.schema';
import slugify from '../utils/slugify';
import { cacheService } from '../config/redis';
import logger from '../utils/logger';

const CACHE_TTL = 300; // 5 minutos
const CACHE_TTL_LONG = 3600; // 1 hora para datos que cambian poco

export class CompetitionService {
  // ==========================================
  // CRUD BÁSICO
  // ==========================================

  static async create(data: CreateCompetitionInput, organizerId: string) {
    // Generar slug único
    const slug = await this.generateUniqueSlug(data.name);

    // Preparar datos de ubicación
    let locationData = null;
    if (data.latitude && data.longitude) {
      // PostGIS: crear Point geometry
      locationData = Prisma.sql`ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)`;
    }

    // Crear competición
    const competition = await prisma.competition.create({
      data: {
        slug,
        name: data.name,
        description: data.description,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        country: data.country,
        region: data.region,
        city: data.city,
        location: locationData as any,
        distance: data.distance,
        elevation: data.elevation,
        website: data.website,
        email: data.email,
        phone: data.phone,
        registrationUrl: data.registrationUrl,
        registrationStart: data.registrationStart ? new Date(data.registrationStart) : null,
        registrationEnd: data.registrationEnd ? new Date(data.registrationEnd) : null,
        maxParticipants: data.maxParticipants,
        organizerId,
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

    logger.info(`Competition created: ${competition.name} (${competition.slug}) by organizer ${organizerId}`);

    // Invalidar caché
    await cacheService.del('competitions:list');

    return competition;
  }

  static async findAll(filters: any = {}, userId?: string, userRole?: string) {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      status,
      country,
      startDate,
      endDate,
      sortBy = 'startDate',
      sortOrder = 'asc',
    } = filters;

    // Convertir a números (vienen como strings desde query params)
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;

    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    // Filtro por status según rol del usuario
    if (!userId || userRole === 'ATHLETE' || userRole === 'VIEWER') {
      where.status = 'PUBLISHED';
    } else if (userRole === 'ORGANIZER') {
      where.OR = [
        { status: 'PUBLISHED' },
        { organizerId: userId },
      ];
    }
    // ADMIN: no se añade filtro de status (ve todas)

    // Búsqueda por texto
    if (search) {
      where.OR = [
        ...(where.OR || []),
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filtro por tipo
    if (type) {
      where.type = type;
    }

    // Filtro por status (si se especifica explícitamente)
    if (status) {
      where.status = status;
    }

    // Filtro por país
    if (country) {
      where.country = { equals: country, mode: 'insensitive' };
    }

    // Filtro por rango de fechas
    if (startDate) {
      where.startDate = { ...where.startDate, gte: new Date(startDate) };
    }
    if (endDate) {
      where.startDate = { ...where.startDate, lte: new Date(endDate) };
    }

    // Hash de parámetros para cache
    const cacheKey = `competitions:${JSON.stringify({ where, sortBy, sortOrder, page: pageNum, limit: limitNum })}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Consulta a BD
    const [competitions, total] = await Promise.all([
      prisma.competition.findMany({
        where,
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
              participants: true,
              reviews: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limitNum,
      }),
      prisma.competition.count({ where }),
    ]);

    const result = {
      data: competitions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };

    // Guardar en cache
    await cacheService.set(cacheKey, JSON.stringify(result), CACHE_TTL);

    return result;
  }

  static async findById(id: string) {
    const cacheKey = `competition:${id}`;
    const cached = await cacheService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const competition = await prisma.competition.findUnique({
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
        categories: true,
        translations: true,
        _count: {
          select: {
            participants: true,
            reviews: true,
          },
        },
      },
    });

    if (!competition) {
      throw new AppError('Competition not found', 404);
    }

    // Incrementar viewCount
    await prisma.competition.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    // Guardar en cache
    await cacheService.set(cacheKey, JSON.stringify(competition), CACHE_TTL);

    return competition;
  }

  static async findBySlug(slug: string) {
    const competition = await prisma.competition.findUnique({
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
        categories: true,
        translations: true,
        _count: {
          select: {
            participants: true,
            reviews: true,
          },
        },
      },
    });

    if (!competition) {
      throw new AppError('Competition not found', 404);
    }

    // Incrementar viewCount
    await prisma.competition.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return competition;
  }

  static async update(id: string, data: UpdateCompetitionInput, userId: string) {
    // Verificar que la competición existe
    const competition = await prisma.competition.findUnique({
      where: { id },
      select: { id: true, organizerId: true },
    });

    if (!competition) {
      throw new AppError('Competition not found', 404);
    }

    // Obtener rol del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Verificar permisos: solo el organizador o admin pueden actualizar
    if (user?.role !== 'ADMIN' && competition.organizerId !== userId) {
      throw new AppError('You do not have permission to update this competition', 403);
    }

    // Preparar datos de ubicación si se actualizan coordenadas
    let locationData = undefined;
    if (data.latitude !== undefined && data.longitude !== undefined) {
      if (data.latitude && data.longitude) {
        locationData = Prisma.sql`ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)` as any;
      } else {
        locationData = null;
      }
    }

    // Preparar datos de actualización
    const updateData: any = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      registrationStart: data.registrationStart ? new Date(data.registrationStart) : undefined,
      registrationEnd: data.registrationEnd ? new Date(data.registrationEnd) : undefined,
    };

    if (locationData !== undefined) {
      updateData.location = locationData;
    }

    // Actualizar competición
    const updated = await prisma.competition.update({
      where: { id },
      data: updateData,
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

    logger.info(`Competition updated: ${updated.name} (${updated.id}) by user ${userId}`);

    // Invalidar caché
    await cacheService.del(`competition:${id}`);
    await cacheService.del('competitions:list');

    return updated;
  }

  static async delete(id: string, userId: string) {
    // Verificar que la competición existe
    const competition = await prisma.competition.findUnique({
      where: { id },
      select: { id: true, name: true, organizerId: true },
    });

    if (!competition) {
      throw new AppError('Competition not found', 404);
    }

    // Obtener rol del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Verificar permisos: solo el organizador o admin pueden eliminar
    if (user?.role !== 'ADMIN' && competition.organizerId !== userId) {
      throw new AppError('You do not have permission to delete this competition', 403);
    }

    // Eliminar competición
    await prisma.competition.delete({
      where: { id },
    });

    logger.warn(`Competition deleted: ${competition.name} (${id}) by user ${userId}`);

    // Invalidar caché
    await cacheService.del(`competition:${id}`);
    await cacheService.del('competitions:list');

    return { message: 'Competition deleted successfully' };
  }

  // ==========================================
  // BÚSQUEDAS AVANZADAS
  // ==========================================

  static async findNearby(latitude: number, longitude: number, radiusKm: number = 50) {
    const radiusMeters = radiusKm * 1000;

    const competitions = await prisma.$queryRaw<any[]>`
      SELECT 
        id,
        slug,
        name,
        city,
        country,
        "startDate",
        ST_Distance(
          location::geography,
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
        ) / 1000 as distance_km
      FROM competitions
      WHERE 
        location IS NOT NULL
        AND status = 'PUBLISHED'
        AND ST_DWithin(
          location::geography,
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
          ${radiusMeters}
        )
      ORDER BY distance_km ASC
      LIMIT 20
    `;

    logger.info(`Found ${competitions.length} competitions within ${radiusKm}km of (${latitude}, ${longitude})`);

    return competitions;
  }

  static async search(query: string, limit: number = 20) {
    if (query.length < 2) {
      throw new AppError('Search query must be at least 2 characters', 400);
    }

    const cacheKey = `search:${query}:${limit}`;
    const cached = await cacheService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const competitions = await prisma.$queryRaw<any[]>`
      SELECT 
        id,
        slug,
        name,
        city,
        country,
        "startDate",
        type,
        distance,
        elevation,
        similarity(name, ${query}) + 
        similarity(COALESCE(city, ''), ${query}) + 
        similarity(COALESCE(description, ''), ${query}) as relevance
      FROM competitions
      WHERE 
        status = 'PUBLISHED'
        AND (
          name ILIKE ${`%${query}%`}
          OR city ILIKE ${`%${query}%`}
          OR country ILIKE ${`%${query}%`}
          OR description ILIKE ${`%${query}%`}
        )
      ORDER BY relevance DESC, "startDate" ASC
      LIMIT ${limit}
    `;

    logger.info(`Search for "${query}" returned ${competitions.length} results`);

    // Guardar en cache
    await cacheService.set(cacheKey, JSON.stringify(competitions), CACHE_TTL);

    return competitions;
  }

  static async getFeatured(limit: number = 10) {
    const cacheKey = `competitions:featured:${limit}`;
    const cached = await cacheService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const competitions = await prisma.competition.findMany({
      where: {
        status: 'PUBLISHED',
        isHighlighted: true,
        startDate: {
          gte: new Date(),
        },
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
        _count: {
          select: {
            participants: true,
            reviews: true,
          },
        },
      },
      orderBy: [
        { startDate: 'asc' },
        { viewCount: 'desc' },
      ],
      take: limit,
    });

    // Guardar en cache (larga duración)
    await cacheService.set(cacheKey, JSON.stringify(competitions), CACHE_TTL_LONG);

    return competitions;
  }

  static async getUpcoming(limit: number = 20) {
    const cacheKey = `competitions:upcoming:${limit}`;
    const cached = await cacheService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const competitions = await prisma.competition.findMany({
      where: {
        status: 'PUBLISHED',
        startDate: {
          gte: new Date(),
        },
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
        _count: {
          select: {
            participants: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: limit,
    });

    // Guardar en cache
    await cacheService.set(cacheKey, JSON.stringify(competitions), CACHE_TTL);

    return competitions;
  }

  static async getByCountry(country: string, options: { page?: number; limit?: number } = {}) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    
    // Convertir a números si vienen como strings
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    
    const skip = (pageNum - 1) * limitNum;

    const cacheKey = `competitions:country:${country}:${pageNum}:${limitNum}`;
    const cached = await cacheService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const where = {
      status: 'PUBLISHED' as const,
      country: {
        equals: country,
        mode: 'insensitive' as const,
      },
    };

    const [competitions, total] = await Promise.all([
      prisma.competition.findMany({
        where,
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
              participants: true,
              reviews: true,
            },
          },
        },
        orderBy: {
          startDate: 'asc',
        },
        skip,
        take: limitNum,
      }),
      prisma.competition.count({ where }),
    ]);

    const result = {
      data: competitions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };

    // Guardar en cache
    await cacheService.set(cacheKey, JSON.stringify(result), CACHE_TTL);

    return result;
  }

  static async getStats(id: string) {
    const competition = await prisma.competition.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        viewCount: true,
        maxParticipants: true,
        currentParticipants: true,
        registrationStatus: true,
        _count: {
          select: {
            participants: true,
            reviews: true,
            categories: true,
            results: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!competition) {
      throw new AppError('Competition not found', 404);
    }

    // Calcular rating promedio
    const averageRating =
      competition.reviews.length > 0
        ? competition.reviews.reduce((sum, r) => sum + r.rating, 0) / competition.reviews.length
        : 0;

    return {
      id: competition.id,
      name: competition.name,
      totalParticipants: competition._count.participants,
      totalReviews: competition._count.reviews,
      totalCategories: competition._count.categories,
      totalResults: competition._count.results,
      averageRating: parseFloat(averageRating.toFixed(2)),
      viewCount: competition.viewCount,
      currentParticipants: competition.currentParticipants,
      maxParticipants: competition.maxParticipants,
      registrationStatus: competition.registrationStatus,
    };
  }

  // ==========================================
  // MÉTODOS PRIVADOS
  // ==========================================

  private static async generateUniqueSlug(name: string): Promise<string> {
    let slug = slugify(name);
    let counter = 1;

    while (await prisma.competition.findUnique({ where: { slug } })) {
      slug = `${slugify(name)}-${counter}`;
      counter++;
    }

    return slug;
  }
}
