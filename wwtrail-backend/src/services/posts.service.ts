// src/services/posts.service.ts
import prisma from '../config/database';
import { cache, CACHE_TTL } from '../config/redis';
import logger from '../utils/logger';
import { generateUniqueSlug } from '../utils/slugify';
import { PostStatus, PostCategory, Language } from '@prisma/client';

interface CreatePostInput {
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  category: PostCategory;
  language: Language;
  eventId?: string;
  competitionId?: string;
  editionId?: string;
  authorId: string;
  publishedAt?: Date;
  scheduledPublishAt?: Date;
  images?: Array<{
    imageUrl: string;
    caption?: string;
    sortOrder: number;
  }>;
}

interface UpdatePostInput {
  title?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  category?: PostCategory;
  language?: Language;
  eventId?: string;
  competitionId?: string;
  editionId?: string;
  status?: PostStatus;
  publishedAt?: Date;
  scheduledPublishAt?: Date;
  images?: Array<{
    imageUrl: string;
    caption?: string;
    sortOrder: number;
  }>;
}

interface PostFilters {
  page?: number | string;
  limit?: number | string;
  search?: string;
  category?: PostCategory;
  language?: Language;
  status?: PostStatus;
  authorId?: string;
  editionId?: string;
  sortBy?: 'publishedAt' | 'createdAt' | 'viewCount' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export class PostsService {
  /**
   * Crear un nuevo post/artículo
   * - Si el usuario es ADMIN → puede publicar directamente (status PUBLISHED)
   * - Si el usuario es ORGANIZER → queda en borrador (status DRAFT)
   */
  static async create(data: CreatePostInput, userRole: string) {
    try {
      // Determinar status según rol
      let status: PostStatus = userRole === 'ADMIN' ? 'PUBLISHED' : 'DRAFT';

      // Si se especifica publishedAt y es ADMIN, publicar
      if (userRole === 'ADMIN' && data.publishedAt) {
        status = 'PUBLISHED';
      }

      // Generar slug único
      const slug = await generateUniqueSlug(data.title, prisma.post);

      // Preparar datos del post
      const postData: any = {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || data.excerpt,
        category: data.category,
        language: data.language,
        status,
        authorId: data.authorId,
        publishedAt: status === 'PUBLISHED' && !data.publishedAt ? new Date() : data.publishedAt,
        scheduledPublishAt: data.scheduledPublishAt,
      };

      // Añadir relaciones opcionales
      if (data.eventId) postData.eventId = data.eventId;
      if (data.competitionId) postData.competitionId = data.competitionId;
      if (data.editionId) postData.editionId = data.editionId;

      // Crear post con imágenes de galería si existen
      const post = await prisma.post.create({
        data: {
          ...postData,
          images: data.images?.length ? {
            create: data.images,
          } : undefined,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          edition: {
            select: {
              id: true,
              year: true,
              slug: true,
            },
          },
          images: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
          tags: true,
        },
      });

      logger.info(`Post created: ${post.id} by user ${data.authorId}`);
      return post;
    } catch (error: any) {
      logger.error('Error creating post:', error);
      throw new Error(error.message || 'Error creating post');
    }
  }

  /**
   * Obtener todos los posts (con filtros)
   */
  static async getAll(filters: PostFilters = {}) {
    try {
      const page = Math.max(1, Number(filters.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
      const skip = (page - 1) * limit;

      // Construir filtros de búsqueda
      const where: any = {};

      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { excerpt: { contains: filters.search, mode: 'insensitive' } },
          { content: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      if (filters.category) where.category = filters.category;
      if (filters.language) where.language = filters.language;
      if (filters.status) where.status = filters.status;
      if (filters.authorId) where.authorId = filters.authorId;
      if (filters.editionId) where.editionId = filters.editionId;

      // Ordenamiento
      const sortBy = filters.sortBy || 'publishedAt';
      const sortOrder = filters.sortOrder || 'desc';
      const orderBy: any = { [sortBy]: sortOrder };

      // Ejecutar consultas en paralelo
      const [posts, totalCount] = await Promise.all([
        prisma.post.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
            event: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            competition: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            edition: {
              select: {
                id: true,
                year: true,
                slug: true,
              },
            },
            tags: true,
            images: true,
          },
        }),
        prisma.post.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: posts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasMore: page < totalPages,
        },
      };
    } catch (error: any) {
      logger.error('Error getting posts:', error);
      throw new Error(error.message || 'Error getting posts');
    }
  }

  /**
   * Obtener post por ID
   */
  static async getById(id: string) {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          edition: {
            select: {
              id: true,
              year: true,
              slug: true,
            },
          },
          images: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
          tags: true,
        },
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // Incrementar contador de vistas
      await prisma.post.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });

      return post;
    } catch (error: any) {
      logger.error(`Error getting post ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener post por slug
   */
  static async getBySlug(slug: string) {
    try {
      const cacheKey = `post:slug:${slug}`;

      // Intentar obtener del cache
      const cached = await cache.get(cacheKey);
      if (cached) {
        logger.info(`Cache hit for post slug: ${slug}`);
        return JSON.parse(cached);
      }

      const post = await prisma.post.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          competition: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          edition: {
            select: {
              id: true,
              year: true,
              slug: true,
              startDate: true,
            },
          },
          images: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
          tags: true,
        },
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // Guardar en cache
      await cache.set(cacheKey, JSON.stringify(post), 'EX', CACHE_TTL.MEDIUM);

      // Incrementar contador de vistas
      await prisma.post.update({
        where: { slug },
        data: { viewCount: { increment: 1 } },
      });

      return post;
    } catch (error: any) {
      logger.error(`Error getting post by slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Verificar si un slug está disponible
   */
  static async checkSlug(slug: string) {
    try {
      const existing = await prisma.post.findUnique({
        where: { slug },
        select: { id: true },
      });

      return {
        available: !existing,
        slug,
      };
    } catch (error: any) {
      logger.error('Error checking slug:', error);
      throw new Error('Error checking slug availability');
    }
  }

  /**
   * Actualizar un post
   */
  static async update(id: string, data: UpdatePostInput, userId: string, userRole: string) {
    try {
      // Verificar que el post existe
      const existingPost = await prisma.post.findUnique({
        where: { id },
        select: { authorId: true, status: true },
      });

      if (!existingPost) {
        throw new Error('Post not found');
      }

      // Verificar permisos
      if (userRole !== 'ADMIN' && existingPost.authorId !== userId) {
        throw new Error('Unauthorized to update this post');
      }

      // Preparar datos de actualización - solo campos válidos del schema
      const updateData: any = {};

      // Campos opcionales que SÍ existen en el schema
      if (data.title !== undefined) updateData.title = data.title;
      if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage;
      if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
      if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.language !== undefined) updateData.language = data.language;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.eventId !== undefined) updateData.eventId = data.eventId;
      if (data.competitionId !== undefined) updateData.competitionId = data.competitionId;
      if (data.editionId !== undefined) updateData.editionId = data.editionId;
      if (data.publishedAt !== undefined) updateData.publishedAt = data.publishedAt;
      if (data.scheduledPublishAt !== undefined) updateData.scheduledPublishAt = data.scheduledPublishAt;

      // Si se cambia el título, regenerar slug
      if (data.title) {
        updateData.slug = await generateUniqueSlug(data.title, prisma.post, id);
      }

      // Si hay imágenes, borrar las existentes y crear las nuevas
      if (data.images !== undefined) {
        // Borrar imágenes existentes
        await prisma.postImage.deleteMany({
          where: { postId: id },
        });
      }

      const post = await prisma.post.update({
        where: { id },
        data: {
          ...updateData,
          images: data.images?.length ? {
            create: data.images,
          } : undefined,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          event: true,
          competition: true,
          edition: true,
          images: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      });

      // Limpiar cache
      if (post.slug) {
        await cache.del(`post:slug:${post.slug}`);
      }

      logger.info(`Post updated: ${id} by user ${userId}`);
      return post;
    } catch (error: any) {
      logger.error(`Error updating post ${id}:`, error);
      throw error;
    }
  }

  /**
   * Publicar un post (aprobar si es ADMIN)
   */
  static async publish(id: string, userId: string) {
    try {
      const post = await prisma.post.update({
        where: { id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
        include: {
          author: true,
        },
      });

      logger.info(`Post published: ${id} by user ${userId}`);
      return post;
    } catch (error: any) {
      logger.error(`Error publishing post ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un post (solo ADMIN)
   */
  static async delete(id: string, userId: string) {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        select: { slug: true },
      });

      await prisma.post.delete({
        where: { id },
      });

      // Limpiar cache
      if (post?.slug) {
        await cache.del(`post:slug:${post.slug}`);
      }

      logger.info(`Post deleted: ${id} by user ${userId}`);
    } catch (error: any) {
      logger.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  }

  /**
   * Procesar posts programados para publicación
   * Esta función debe ser llamada por un cron job
   */
  static async processScheduledPosts() {
    try {
      const now = new Date();

      const scheduledPosts = await prisma.post.findMany({
        where: {
          status: 'DRAFT',
          scheduledPublishAt: {
            lte: now,
          },
        },
      });

      for (const post of scheduledPosts) {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            status: 'PUBLISHED',
            publishedAt: now,
            scheduledPublishAt: null,
          },
        });

        logger.info(`Auto-published scheduled post: ${post.id}`);
      }

      return scheduledPosts.length;
    } catch (error: any) {
      logger.error('Error processing scheduled posts:', error);
      throw error;
    }
  }
}
