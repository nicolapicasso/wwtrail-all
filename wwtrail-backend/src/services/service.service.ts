// src/services/service.service.ts
import prisma from '../config/database';
import { cache, CACHE_TTL, CACHE_TTL_LONG } from '../config/redis';
import logger from '../utils/logger';
import { generateUniqueSlug } from '../utils/slugify';
import { EventStatus } from '@prisma/client';

interface CreateServiceInput {
  name: string;
  description?: string;
  category: string;
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
  category?: string;
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
  category?: string;
  featured?: boolean;
  status?: EventStatus;
  sortBy?: 'name' | 'createdAt' | 'viewCount' | 'category';
  sortOrder?: 'asc' | 'desc';
}

export class ServiceService {

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
            id, name, slug, description, category, country, city, location,
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
          data.category,
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
            id, name, slug, description, category, country, city, location,
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
          data.category,
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
        },
      });

      await cache.del('services:all');
      await cache.del(`services:organizer:${data.organizerId}`);
      await cache.del('services:categories'); // Invalidar caché de categorías
      await cache.del('services:categories:count'); // Invalidar caché de categorías con conteo

      logger.info(`Service created: ${slug} by user ${data.organizerId}`);

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

      if (filters.category) {
        where.category = { contains: filters.category, mode: 'insensitive' };
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
          category: data.category,
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
        },
      });

      return await this.enrichWithCoordinates(services);
    } catch (error) {
      logger.error(`Error fetching services for organizer ${organizerId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener categorías únicas
   */
  static async getCategories() {
    try {
      const cacheKey = 'services:categories';
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const categories = await prisma.service.findMany({
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
      });

      const categoryList = categories.map(c => c.category);

      await cache.set(cacheKey, JSON.stringify(categoryList), CACHE_TTL_LONG);

      return categoryList;
    } catch (error) {
      logger.error('Error fetching service categories:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías con conteo de servicios
   */
  static async getCategoriesWithCount() {
    try {
      const cacheKey = 'services:categories:count';
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const result = await prisma.service.groupBy({
        by: ['category'],
        _count: {
          category: true,
        },
        orderBy: {
          category: 'asc',
        },
      });

      const categoriesWithCount = result.map(r => ({
        name: r.category,
        count: r._count.category,
      }));

      await cache.set(cacheKey, JSON.stringify(categoriesWithCount), CACHE_TTL_LONG);

      return categoriesWithCount;
    } catch (error) {
      logger.error('Error fetching service categories with count:', error);
      throw error;
    }
  }

  /**
   * Eliminar una categoría (actualiza todos los servicios con esa categoría a null)
   */
  static async deleteCategory(category: string) {
    try {
      // Actualizar todos los servicios con esta categoría a null
      const result = await prisma.service.updateMany({
        where: { category },
        data: { category: 'Sin categoría' },
      });

      // Invalidar cachés
      await cache.del('services:categories');
      await cache.del('services:categories:count');
      await cache.del('services:all');

      logger.info(`Category deleted: ${category} (${result.count} services updated)`);

      return { success: true, updatedCount: result.count };
    } catch (error) {
      logger.error(`Error deleting category ${category}:`, error);
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
        id, name, slug, city, country, category,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude,
        ST_Distance(
          location::geography,
          ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography
        ) / 1000 as distance_km
      FROM services
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
      `Services nearby (${lat}, ${lon}) within ${radiusKm}km: ${(services as any[]).length} found`
    );

    return services;
  }
}
