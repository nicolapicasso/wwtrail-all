// src/services/serviceCategory.service.ts
import prisma from '../config/database';
import { cache, CACHE_TTL_LONG } from '../config/redis';
import logger from '../utils/logger';
import { generateUniqueSlug } from '../utils/slugify';

interface CreateServiceCategoryInput {
  name: string;
  icon: string;
}

interface UpdateServiceCategoryInput {
  name?: string;
  icon?: string;
}

export class ServiceCategoryService {
  /**
   * Crear una nueva categoría de servicio
   */
  static async create(data: CreateServiceCategoryInput) {
    try {
      const slug = await generateUniqueSlug(data.name, 'service-category');

      const category = await prisma.serviceCategory.create({
        data: {
          name: data.name,
          slug,
          icon: data.icon,
        },
      });

      // Invalidar cachés
      await cache.del('service-categories:all');

      logger.info(`Service category created: ${slug}`);

      return category;
    } catch (error) {
      logger.error('Error creating service category:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las categorías
   */
  static async getAll() {
    try {
      const cacheKey = 'service-categories:all';
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const categories = await prisma.serviceCategory.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { services: true },
          },
        },
      });

      await cache.set(cacheKey, JSON.stringify(categories), CACHE_TTL_LONG);

      return categories;
    } catch (error) {
      logger.error('Error fetching service categories:', error);
      throw error;
    }
  }

  /**
   * Obtener una categoría por ID
   */
  static async getById(id: string) {
    try {
      const category = await prisma.serviceCategory.findUnique({
        where: { id },
        include: {
          _count: {
            select: { services: true },
          },
        },
      });

      return category;
    } catch (error) {
      logger.error(`Error fetching service category by id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener una categoría por slug
   */
  static async getBySlug(slug: string) {
    try {
      const category = await prisma.serviceCategory.findUnique({
        where: { slug },
        include: {
          _count: {
            select: { services: true },
          },
        },
      });

      return category;
    } catch (error) {
      logger.error(`Error fetching service category by slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar una categoría
   */
  static async update(id: string, data: UpdateServiceCategoryInput) {
    try {
      let slug: string | undefined;
      if (data.name) {
        const currentCategory = await prisma.serviceCategory.findUnique({
          where: { id },
          select: { slug: true },
        });
        if (currentCategory) {
          slug = await generateUniqueSlug(data.name, 'service-category', currentCategory.slug);
        }
      }

      const category = await prisma.serviceCategory.update({
        where: { id },
        data: {
          name: data.name,
          slug,
          icon: data.icon,
        },
        include: {
          _count: {
            select: { services: true },
          },
        },
      });

      // Invalidar cachés
      await cache.del('service-categories:all');
      await cache.del('services:all');
      await cache.del('services:categories');
      await cache.del('services:categories:count');

      logger.info(`Service category updated: ${id}`);

      return category;
    } catch (error) {
      logger.error(`Error updating service category ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar una categoría
   */
  static async delete(id: string) {
    try {
      // Verificar cuántos servicios tienen esta categoría
      const servicesCount = await prisma.service.count({
        where: { categoryId: id },
      });

      if (servicesCount > 0) {
        throw new Error(
          `Cannot delete category with ${servicesCount} associated services. Please reassign or delete the services first.`
        );
      }

      await prisma.serviceCategory.delete({
        where: { id },
      });

      // Invalidar cachés
      await cache.del('service-categories:all');
      await cache.del('services:categories');
      await cache.del('services:categories:count');

      logger.info(`Service category deleted: ${id}`);

      return { success: true };
    } catch (error) {
      logger.error(`Error deleting service category ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener categorías con conteo de servicios (para listado simple)
   */
  static async getCategoriesWithCount() {
    try {
      const cacheKey = 'service-categories:with-count';
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const categories = await prisma.serviceCategory.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { services: true },
          },
        },
      });

      const result = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        count: cat._count.services,
      }));

      await cache.set(cacheKey, JSON.stringify(result), CACHE_TTL_LONG);

      return result;
    } catch (error) {
      logger.error('Error fetching service categories with count:', error);
      throw error;
    }
  }
}
