import { PrismaClient, EventStatus, Language } from '@prisma/client';
import logger from '../utils/logger';
import { slugify } from '../utils/slugify';
import { TranslationService } from './translation.service';
import {
  isAutoTranslateEnabled,
  getTargetLanguages,
  shouldTranslateByStatus,
  TranslationConfig,
} from '../config/translation.config';

const prisma = new PrismaClient();

/**
 * CompetitionService v2
 *
 * Maneja las COMPETICIONES (distancias/carreras) dentro de un evento.
 * Ejemplo: UTMB 171K, CCC 101K, OCC 56K son competitions del evento UTMB Mont Blanc
 *
 * Competition tiene datos BASE que heredan las Editions:
 * - baseDistance, baseElevation, baseMaxParticipants
 */
export class CompetitionService {
  /**
   * Disparar traducciones automáticas en background (no bloqueante)
   */
  private static triggerAutoTranslation(competitionId: string, status: EventStatus) {
    // Verificar si está habilitado y si debe traducirse según el status
    if (!isAutoTranslateEnabled() || !shouldTranslateByStatus(status)) {
      return;
    }

    // Usar idioma por defecto ya que Competition no tiene campo language
    const sourceLanguage = TranslationConfig.DEFAULT_LANGUAGE;
    const targetLanguages = getTargetLanguages(sourceLanguage);

    if (targetLanguages.length === 0) {
      logger.info(`No target languages for competition ${competitionId} (source: ${sourceLanguage})`);
      return;
    }

    logger.info(`Triggering auto-translation for competition ${competitionId} to: ${targetLanguages.join(', ')}`);

    // Ejecutar traducción en background (no bloqueante)
    if (TranslationConfig.BACKGROUND_MODE) {
      setImmediate(() => {
        TranslationService.autoTranslateCompetition(competitionId, targetLanguages, TranslationConfig.OVERWRITE_EXISTING)
          .then((translations) => {
            logger.info(`Auto-translation completed for competition ${competitionId}: ${translations.length} translations created`);
          })
          .catch((error) => {
            logger.error(`Auto-translation failed for competition ${competitionId}:`, error.message);
          });
      });
    } else {
      return TranslationService.autoTranslateCompetition(competitionId, targetLanguages, TranslationConfig.OVERWRITE_EXISTING);
    }
  }
  /**
   * Listar todas las competiciones
   */
  static async findAll(options: any = {}) {
    const {
      limit = 50,
      sortBy = 'name',
      isFeatured,
      search,
      type,
      country,
      minDistance,
      maxDistance,
      minElevation,
      maxElevation,
      specialSeriesId,
    } = options;

    // Build dynamic where clause
    const where: any = {};

    if (isFeatured) {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (country) {
      where.event = {
        ...where.event,
        country,
      };
    }

    if (minDistance !== undefined || maxDistance !== undefined) {
      where.baseDistance = {};
      if (minDistance !== undefined) {
        where.baseDistance.gte = minDistance;
      }
      if (maxDistance !== undefined) {
        where.baseDistance.lte = maxDistance;
      }
    }

    if (minElevation !== undefined || maxElevation !== undefined) {
      where.baseElevation = {};
      if (minElevation !== undefined) {
        where.baseElevation.gte = minElevation;
      }
      if (maxElevation !== undefined) {
        where.baseElevation.lte = maxElevation;
      }
    }

    if (specialSeriesId) {
      where.specialSeriesId = specialSeriesId;
    }

    const competitions = await prisma.competition.findMany({
      take: limit,
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
            city: true,
            typicalMonth: true,
          },
        },
        terrainType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        specialSeries: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        _count: {
          select: {
            editions: true,
          },
        },
      },
    });

    // Extract coordinates from events using PostGIS
    if (competitions.length > 0) {
      try {
        const eventIds = competitions.map(c => c.event.id);
        const coordinates = await prisma.$queryRawUnsafe<Array<{ id: string; lat: number; lon: number }>>(
          `SELECT id::text, ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon
           FROM events
           WHERE id::text = ANY($1)
           AND location IS NOT NULL`,
          eventIds
        );

        const coordMap = new Map(coordinates.map(c => [c.id, { lat: c.lat, lon: c.lon }]));

        competitions.forEach(comp => {
          const coords = coordMap.get(comp.event.id);
          if (coords) {
            (comp.event as any).latitude = coords.lat;
            (comp.event as any).longitude = coords.lon;
          }
        });
      } catch (error) {
        logger.error('Error extracting coordinates for competitions:', error);
      }
    }

    // Ordenar según el campo
    if (sortBy === 'startDate' || sortBy === 'typicalMonth') {
      // Ordenar por mes del evento
      competitions.sort((a, b) => {
        const monthA = a.event.typicalMonth || 99;
        const monthB = b.event.typicalMonth || 99;
        return monthA - monthB;
      });
    } else if (sortBy === 'name') {
      // Ordenar por nombre
      competitions.sort((a, b) => a.name.localeCompare(b.name));
    }

    return competitions;
  }

  /**
   * Crear una nueva competición dentro de un evento
   */
  static async create(eventId: string, data: any, userId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, organizerId: true, slug: true },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && event.organizerId !== userId) {
      throw new Error('Unauthorized: Only event organizer or admin can create competitions');
    }

    const baseSlug = `${event.slug}-${slugify(data.name)}`;
    const slug = await this.generateUniqueSlug(baseSlug);

    const competition = await prisma.competition.create({
      data: {
        eventId,
        name: data.name,
        slug,
        description: data.description,
        type: data.type,
        baseDistance: data.baseDistance,
        baseElevation: data.baseElevation,
        baseMaxParticipants: data.baseMaxParticipants,
        terrainTypeId: data.terrainTypeId,
        specialSeriesId: data.specialSeriesId,
        itraPoints: data.itraPoints,
        utmbIndex: data.utmbIndex,
        organizerId: userId,
        status: EventStatus.PUBLISHED,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
            city: true,
          },
        },
        terrainType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        specialSeries: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        _count: {
          select: {
            editions: true,
          },
        },
      },
    });

    logger.info(`Competition created: ${competition.id} - ${competition.name}`);

    // Disparar traducciones automáticas
    this.triggerAutoTranslation(competition.id, EventStatus.PUBLISHED);

    return competition;
  }

  /**
   * Obtener todas las competiciones de un evento
   */
  static async findByEvent(eventId: string) {
    const competitions = await prisma.competition.findMany({
      where: {
        eventId,
        status: EventStatus.PUBLISHED,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        terrainType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        specialSeries: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        _count: {
          select: {
            editions: true,
          },
        },
      },
      orderBy: {
        baseDistance: 'asc',
      },
    });

    return competitions;
  }

  /**
   * Obtener una competición por ID
   */
  static async findById(id: string) {
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
            city: true,
            organizerId: true,
            logoUrl: true,
          },
        },
        terrainType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        specialSeries: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        editions: {
          orderBy: { year: 'desc' },
          take: 10,
          select: {
            id: true,
            year: true,
            slug: true,
            startDate: true,
            status: true,
            registrationStatus: true,
          },
        },
        _count: {
          select: {
            editions: true,
          },
        },
      },
    });

    if (!competition) {
      throw new Error('Competition not found');
    }

    // Extraer coordenadas PostGIS del Event
    try {
      const coordinates = await prisma.$queryRawUnsafe<Array<{ lat: number; lon: number }>>(
        `SELECT ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon
         FROM events
         WHERE id::text = $1 AND location IS NOT NULL`,
        competition.event.id
      );

      if (coordinates.length > 0) {
        // Añadir coordenadas al objeto event
        (competition.event as any).latitude = coordinates[0].lat;
        (competition.event as any).longitude = coordinates[0].lon;
      } else {
        logger.warn(`No coordinates found for event ${competition.event.id} (${competition.event.name})`);
      }
    } catch (error) {
      logger.error(`Error extracting coordinates for event ${competition.event.id}:`, error);
      // Si falla, continuar sin coordenadas
    }

    return competition;
  }

  /**
   * Obtener una competición por slug
   */
  static async findBySlug(slug: string) {
    const competition = await prisma.competition.findFirst({
      where: { slug },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
            city: true,
            organizerId: true,
            logoUrl: true,
          },
        },
        terrainType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        specialSeries: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        editions: {
          orderBy: { year: 'desc' },
          take: 10,
          select: {
            id: true,
            year: true,
            slug: true,
            startDate: true,
            status: true,
            registrationStatus: true,
          },
        },
        translations: true,  // ✅ Include translations
        _count: {
          select: {
            editions: true,
          },
        },
      },
    });

    if (!competition) {
      throw new Error('Competition not found');
    }

    // Extraer coordenadas PostGIS del Event
    try {
      const coordinates = await prisma.$queryRawUnsafe<Array<{ lat: number; lon: number }>>(
        `SELECT ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon
         FROM events
         WHERE id::text = $1 AND location IS NOT NULL`,
        competition.event.id
      );

      if (coordinates.length > 0) {
        // Añadir coordenadas al objeto event
        (competition.event as any).latitude = coordinates[0].lat;
        (competition.event as any).longitude = coordinates[0].lon;
      } else {
        logger.warn(`No coordinates found for event ${competition.event.id} (${competition.event.name})`);
      }
    } catch (error) {
      logger.error(`Error extracting coordinates for event ${competition.event.id}:`, error);
      // Si falla, continuar sin coordenadas
    }

    return competition;
  }

  /**
   * Actualizar una competición
   */
  static async update(id: string, data: any, userId: string) {
    const existing = await prisma.competition.findUnique({
      where: { id },
      include: {
        event: {
          select: { organizerId: true },
        },
      },
    });

    if (!existing) {
      throw new Error('Competition not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && existing.event.organizerId !== userId) {
      throw new Error('Unauthorized');
    }

    const competition = await prisma.competition.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        baseDistance: data.baseDistance,
        baseElevation: data.baseElevation,
        baseMaxParticipants: data.baseMaxParticipants,
        terrainTypeId: data.terrainTypeId,
        specialSeriesId: data.specialSeriesId,
        itraPoints: data.itraPoints,
        utmbIndex: data.utmbIndex,
        // Image fields
        logoUrl: data.logoUrl,
        coverImage: data.coverImage,
        gallery: data.gallery,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        terrainType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        specialSeries: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        _count: {
          select: {
            editions: true,
          },
        },
      },
    });

    logger.info(`Competition updated: ${id}`);
    return competition;
  }

  /**
   * Eliminar una competición
   */
  static async delete(id: string, userId: string) {
    const existing = await prisma.competition.findUnique({
      where: { id },
      include: {
        event: {
          select: { organizerId: true },
        },
        _count: {
          select: {
            editions: true,
          },
        },
      },
    });

    if (!existing) {
      throw new Error('Competition not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && existing.event.organizerId !== userId) {
      throw new Error('Unauthorized');
    }

    if (existing._count.editions > 0) {
      logger.warn(`Deleting competition ${id} with ${existing._count.editions} editions`);
    }

    await prisma.competition.delete({
      where: { id },
    });

    logger.warn(`Competition deleted: ${id}`);
    return { message: 'Competition deleted successfully' };
  }

  /**
   * Generar slug único
   */
  private static async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.competition.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
}