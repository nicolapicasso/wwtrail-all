// src/services/service.service.ts
import prisma from '../config/database';
import { cache, CACHE_TTL, CACHE_TTL_LONG } from '../config/redis';
import logger from '../utils/logger';
import { generateUniqueSlug } from '../utils/slugify';
import { EventStatus } from '@prisma/client';
import { TranslationService } from './translation.service';
import { isAutoTranslateEnabled, getTargetLanguages, shouldTranslateByStatus, TranslationConfig } from '../config/translation.config';

interface CreateServiceInput {
  name: string;
  description?: string;
  categoryId?: string; // Ahora es ID de categoría (opcional)
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  coverImage?: string;
  gallery?: string[];
  organizerId: string;
  featured?: boolean;
}

interface UpdateServiceInput {
  name?: string;
  description?: string;
  categoryId?: string; // Ahora es ID de categoría
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  coverImage?: string;
  gallery?: string[];
  featured?: boolean;
  status?: EventStatus;
}

interface ServiceFilters {
  page?: number | string;
  limit?: number | string;
  search?: string;
  country?: string;
  city?: string;
  categoryId?: string; // Ahora es ID de categoría
  featured?: boolean;
  status?: EventStatus;
  sortBy?: 'name' | 'createdAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

export class ServiceService {
  /**
   * Disparar traducciones automáticas en background (no bloqueante)
   */
  private static triggerAutoTranslation(serviceId: string, status: EventStatus) {
    if (!isAutoTranslateEnabled() || !shouldTranslateByStatus(status)) {
      return;
    }

    const sourceLanguage = TranslationConfig.DEFAULT_LANGUAGE;
    const targetLanguages = getTargetLanguages(sourceLanguage);

    if (targetLanguages.length === 0) {
      logger.info(`No target languages for service ${serviceId}`);
      return;
    }

    logger.info(`Triggering auto-translation for service ${serviceId} to: ${targetLanguages.join(', ')}`);

    if (TranslationConfig.BACKGROUND_MODE) {
      setImmediate(() => {
        TranslationService.autoTranslateService(serviceId, targetLanguages, TranslationConfig.OVERWRITE_EXISTING)
          .then((translations) => {
            logger.info(`Auto-translation completed for service ${serviceId}: ${translations.length} translations created`);
          })
          .catch((error) => {
            logger.error(`Auto-translation failed for service ${serviceId}:`, error.message);
          });
      });
    } else {
      return TranslationService.autoTranslateService(serviceId, targetLanguages, TranslationConfig.OVERWRITE_EXISTING);
    }
  }

  /**
   * Helper: Extraer coordenadas de PostGIS para uno o varios servicios
   */
  private static async enrichWithCoordinates(services: any | any[]): Promise<any> {
    const isArray = Array.isArray(services);
    const serviceList = isArray ? services : [services];

    if (serviceList.length === 0) {
      return services;
    }

    try {
      const serviceIds = serviceList.map(s => s.id);

      const coordinates = await prisma.$queryRawUnsafe<Array<{ id: string; lat: number; lon: number }>>(
        `SELECT id::text, ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon
         FROM services
         WHERE id::text = ANY($1)
         AND location IS NOT NULL`,
        serviceIds
      );

      const coordMap = new Map(coordinates.map(c => [c.id, { lat: c.lat, lon: c.lon }]));

      serviceList.forEach(service => {
        const coords = coordMap.get(service.id);
        if (coords) {
          service.latitude = coords.lat;
          service.longitude = coords.lon;
        }
      });

    } catch (error) {
      logger.error('Error extracting coordinates for services:', error);
    }

    return services;
  }

  /**
   * Crear un nuevo servicio
   */
  static async create(data: CreateServiceInput) {
    try {
      const slug = await generateUniqueSlug(data.name, 'service');

      // Build the SQL query dynamically based on whether location is provided
      let query: string;
      let params: any[];

      if (data.latitude && data.longitude) {
        query = `
          INSERT INTO services (
            id, name, slug, description, "categoryId", country, city, location,
            "logoUrl", "coverImage", gallery, "organizerId", status, featured, "createdAt", "updatedAt"
          )
          VALUES (
            gen_random_uuid()::text,
            $1, $2, $3, $4, $5, $6,
            ST_SetSRID(ST_MakePoint($7, $8), 4326),
            $9, $10, $11, $12, 'DRAFT', $13, NOW(), NOW()
          )
        `;
        params = [
          data.name,
          slug,
          data.description || null,
          data.categoryId || null,
          data.country,
          data.city,
          data.longitude,
          data.latitude,
          data.logoUrl || null,
          data.coverImage || null,
          data.gallery || [],
          data.organizerId,
          data.featured || false,
        ];
      } else {
        query = `
          INSERT INTO services (
            id, name, slug, description, "categoryId", country, city, location,
            "logoUrl", "coverImage", gallery, "organizerId", status, featured, "createdAt", "updatedAt"
          )
          VALUES (
            gen_random_uuid()::text,
            $1, $2, $3, $4, $5, $6, NULL,
            $7, $8, $9, $10, 'DRAFT', $11, NOW(), NOW()
          )
        `;
        params = [
          data.name,
          slug,
          data.description || null,
          data.categoryId || null,
          data.country,
          data.city,
          data.logoUrl || null,
          data.coverImage || null,
          data.gallery || [],
          data.organizerId,
          data.featured || false,
        ];
      }

      await prisma.$queryRawUnsafe(query, ...params);

      // Obtener el servicio creado
      const createdService = await prisma.service.findUnique({
        where: { slug },
        include: {
          organizer: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
      });

      await cache.del('services:all');
      await cache.del(`services:organizer:${data.organizerId}`);
      await cache.del('services:categories'); // Invalidar caché de categorías
      await cache.del('services:categories:count'); // Invalidar caché de categorías con conteo

      logger.info(`Service created: ${slug} by user ${data.organizerId}`);

      // Disparar traducciones automáticas (normalmente no se dispara porque status es DRAFT)
      if (createdService) {
        this.triggerAutoTranslation(createdService.id, createdService.status);
      }

      return await this.enrichWithCoordinates(createdService);
    } catch (error) {
      logger.error('Error creating service:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los servicios con filtros
   */
  static async getAll(filters: ServiceFilters = {}) {
    try {
      const page = parseInt(filters.page as string) || 1;
      const limit = parseInt(filters.limit as string) || 50;
      const skip = (page - 1) * limit;
      const sortBy = filters.sortBy || 'createdAt';
      const sortOrder = filters.sortOrder || 'desc';

      const where: any = {};

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { city: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      if (filters.country) {
        where.country = filters.country;
      }

      if (filters.city) {
        where.city = { contains: filters.city, mode: 'insensitive' };
      }

      if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }

      if (filters.featured !== undefined) {
        where.featured = filters.featured;
      }

      if (filters.status) {
        where.status = filters.status;
      }

      const [services, total] = await Promise.all([
        prisma.service.findMany({
          where,
          skip,
          take: limit,
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
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
              },
            },
          },
        }),
        prisma.service.count({ where }),
      ]);

      const enrichedServices = await this.enrichWithCoordinates(services);

      return {
        services: enrichedServices,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('Error fetching services:', error);
      throw error;
    }
  }

  /**
   * Obtener un servicio por slug
   */
  static async getBySlug(slug: string) {
    try {
      const cacheKey = `service:${slug}`;
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const service = await prisma.service.findUnique({
        where: { slug },
        include: {
          organizer: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
      });

      if (!service) {
        return null;
      }

      // Incrementar contador de vistas
      await prisma.service.update({
        where: { id: service.id },
        data: { viewCount: { increment: 1 } },
      });

      const enrichedService = await this.enrichWithCoordinates(service);

      await cache.set(cacheKey, JSON.stringify(enrichedService), CACHE_TTL);

      return enrichedService;
    } catch (error) {
      logger.error(`Error fetching service by slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Obtener un servicio por ID
   */
  static async getById(id: string) {
    try {
      const service = await prisma.service.findUnique({
        where: { id },
        include: {
          organizer: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
      });

      if (!service) {
        return null;
      }

      return await this.enrichWithCoordinates(service);
    } catch (error) {
      logger.error(`Error fetching service by id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar un servicio
   */
  static async update(id: string, data: UpdateServiceInput) {
    try {
      let slug: string | undefined;
      if (data.name) {
        const currentService = await prisma.service.findUnique({
          where: { id },
          select: { slug: true },
        });
        if (currentService) {
          slug = await generateUniqueSlug(data.name, 'service', currentService.slug);
        }
      }

      // Si hay coordenadas nuevas, actualizarlas
      if (data.latitude !== undefined && data.longitude !== undefined) {
        await prisma.$executeRawUnsafe(
          `UPDATE services
           SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326),
               "updatedAt" = NOW()
           WHERE id = $3`,
          data.longitude,
          data.latitude,
          id
        );
      }

      const service = await prisma.service.update({
        where: { id },
        data: {
          name: data.name,
          slug,
          description: data.description,
          categoryId: data.categoryId,
          country: data.country,
          city: data.city,
          logoUrl: data.logoUrl,
          coverImage: data.coverImage,
          gallery: data.gallery,
          featured: data.featured,
          status: data.status,
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
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
      });

      await cache.del(`service:${service.slug}`);
      await cache.del('services:all');
      await cache.del('services:categories'); // Invalidar caché de categorías
      await cache.del('services:categories:count'); // Invalidar caché de categorías con conteo

      logger.info(`Service updated: ${id}`);

      return await this.enrichWithCoordinates(service);
    } catch (error) {
      logger.error(`Error updating service ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un servicio
   */
  static async delete(id: string) {
    try {
      const service = await prisma.service.findUnique({
        where: { id },
        select: { slug: true },
      });

      await prisma.service.delete({
        where: { id },
      });

      if (service) {
        await cache.del(`service:${service.slug}`);
      }
      await cache.del('services:all');
      await cache.del('services:categories'); // Invalidar caché de categorías
      await cache.del('services:categories:count'); // Invalidar caché de categorías con conteo

      logger.info(`Service deleted: ${id}`);

      return { success: true };
    } catch (error) {
      logger.error(`Error deleting service ${id}:`, error);
      throw error;
    }
  }

  /**
   * Toggle featured status
   */
  static async toggleFeatured(id: string) {
    try {
      const currentService = await prisma.service.findUnique({
        where: { id },
        select: { featured: true, slug: true },
      });

      if (!currentService) {
        throw new Error('Service not found');
      }

      const service = await prisma.service.update({
        where: { id },
        data: { featured: !currentService.featured },
        include: {
          organizer: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
      });

      await cache.del(`service:${service.slug}`);
      await cache.del('services:all');

      logger.info(`Service featured status toggled: ${id} → ${service.featured}`);

      return await this.enrichWithCoordinates(service);
    } catch (error) {
      logger.error(`Error toggling featured for service ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener servicios por organizador
   */
  static async getByOrganizer(organizerId: string) {
    try {
      const services = await prisma.service.findMany({
        where: { organizerId },
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
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
      });

      return await this.enrichWithCoordinates(services);
    } catch (error) {
      logger.error(`Error fetching services for organizer ${organizerId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener servicios cercanos por coordenadas
   */
  static async findNearby(lat: number, lon: number, radiusKm: number = 50) {
    const radiusMeters = radiusKm * 1000;

    // Query PostGIS
    const services = await prisma.$queryRaw`
      SELECT
        s.id, s.name, s.slug, s.city, s.country, s."categoryId",
        sc.name as category_name, sc.icon as category_icon,
        ST_X(s.location::geometry) as longitude,
        ST_Y(s.location::geometry) as latitude,
        ST_Distance(
          s.location::geography,
          ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography
        ) / 1000 as distance_km
      FROM services s
      LEFT JOIN service_categories sc ON s."categoryId" = sc.id
      WHERE
        s.location IS NOT NULL
        AND s.status = 'PUBLISHED'
        AND ST_DWithin(
          s.location::geography,
          ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography,
          ${radiusMeters}
        )
      ORDER BY distance_km
      LIMIT 20
    `;

    logger.info(
      `Services nearby (${lat}, ${lon}) within ${radiusKm}km: ${(services as any[]).length} found`
    );

    return services;
  }
}
