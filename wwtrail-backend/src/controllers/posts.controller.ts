import { Request, Response, NextFunction } from 'express';
import { PostsService } from '../services/posts.service';
import logger from '../utils/logger';

/**
 * PostsController - Maneja peticiones HTTP para Posts/Artículos
 *
 * Sistema de artículos tipo blog/magazine:
 * - ADMIN: puede crear y publicar artículos directamente (status PUBLISHED)
 * - ORGANIZER: puede crear artículos en borrador (status DRAFT), requieren aprobación de ADMIN
 */
export class PostsController {
  /**
   * POST /api/v2/posts
   * Crear un nuevo post/artículo
   * @auth Required (ORGANIZER o ADMIN)
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      logger.info(`Creating post: ${data.title} by user ${userId} (${userRole})`);

      // Agregar authorId
      data.authorId = userId;

      const post = await PostsService.create(data, userRole);

      // Mensaje diferente según el status
      const message = userRole === 'ADMIN'
        ? 'Post created and published successfully'
        : 'Post created successfully. Pending approval by administrator.';

      res.status(201).json({
        status: 'success',
        message,
        data: post,
      });
    } catch (error) {
      logger.error(`Error creating post: ${error}`);
      next(error);
    }
  }

  /**
   * GET /api/v2/posts/check-slug/:slug
   * Verificar si un slug está disponible
   * @auth No requerida
   */
  static async checkSlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const result = await PostsService.checkSlug(slug);

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/posts
   * Listar posts con filtros
   * @auth No requerida para ver PUBLISHED, pero si se incluyen DRAFT requiere ADMIN
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: any = req.query;

      // Si no es admin, forzar filtro status=PUBLISHED
      if (!req.user || req.user.role !== 'ADMIN') {
        filters.status = 'PUBLISHED';
      }

      const result = await PostsService.getAll(filters);

      res.json({
        status: 'success',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Error getting posts:', error);
      next(error);
    }
  }

  /**
   * GET /api/v2/posts/:id
   * Obtener post por ID
   * @auth No requerida para PUBLISHED, requerida para DRAFT
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const post = await PostsService.getById(id);

      // Si es DRAFT, solo el autor o ADMIN pueden verlo
      if (post.status === 'DRAFT') {
        if (!req.user || (req.user.role !== 'ADMIN' && req.user.id !== post.authorId)) {
          return res.status(403).json({
            status: 'error',
            message: 'Access denied',
          });
        }
      }

      res.json({
        status: 'success',
        data: post,
      });
    } catch (error) {
      logger.error(`Error getting post ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * GET /api/v2/posts/slug/:slug
   * Obtener post por slug
   * @auth No requerida para PUBLISHED
   */
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const post = await PostsService.getBySlug(slug);

      // Si es DRAFT, solo el autor o ADMIN pueden verlo
      if (post.status === 'DRAFT') {
        if (!req.user || (req.user.role !== 'ADMIN' && req.user.id !== post.authorId)) {
          return res.status(403).json({
            status: 'error',
            message: 'Access denied',
          });
        }
      }

      res.json({
        status: 'success',
        data: post,
      });
    } catch (error) {
      logger.error(`Error getting post by slug ${req.params.slug}:`, error);
      next(error);
    }
  }

  /**
   * PATCH /api/v2/posts/:id
   * Actualizar post
   * @auth Required (autor o ADMIN)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const updated = await PostsService.update(id, data, userId, userRole);

      res.json({
        status: 'success',
        message: 'Post updated successfully',
        data: updated,
      });
    } catch (error) {
      logger.error(`Error updating post ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * POST /api/v2/posts/:id/publish
   * Publicar post (aprobar si es ADMIN)
   * @auth Required (ADMIN only)
   */
  static async publish(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const updated = await PostsService.publish(id, userId);

      res.json({
        status: 'success',
        message: 'Post published successfully',
        data: updated,
      });
    } catch (error) {
      logger.error(`Error publishing post ${req.params.id}:`, error);
      next(error);
    }
  }

  /**
   * DELETE /api/v2/posts/:id
   * Eliminar post
   * @auth Required (ADMIN only)
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await PostsService.delete(id, userId);

      res.json({
        status: 'success',
        message: 'Post deleted successfully',
      });
    } catch (error) {
      logger.error(`Error deleting post ${req.params.id}:`, error);
      next(error);
    }
  }
}

export default PostsController;
