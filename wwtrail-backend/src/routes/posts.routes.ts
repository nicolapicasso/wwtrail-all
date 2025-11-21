// src/routes/posts.routes.ts - Posts/Articles routes

import { Router } from 'express';
import { PostsController } from '../controllers/posts.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

// ============================================
// POSTS ROUTES (Magazine/Blog Articles)
// ============================================
// Sistema de artículos tipo magazine/blog
// - ADMIN: puede crear/editar/publicar posts
// - ORGANIZER: puede crear posts (quedan en DRAFT)
// ============================================

// ===================================
// RUTAS PÚBLICAS ESPECÍFICAS
// ===================================

// Check slug availability (público)
router.get('/check-slug/:slug', PostsController.checkSlug);

// Get post by slug (público para PUBLISHED)
router.get('/slug/:slug', PostsController.getBySlug);

// ===================================
// RUTAS CON ID + ACCIONES
// ===================================

// Publish post (solo ADMIN)
router.post(
  '/:id/publish',
  authenticate,
  authorize('ADMIN'),
  PostsController.publish
);

// Update post (autor o ADMIN)
router.patch(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  PostsController.update
);

router.put(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  PostsController.update
);

// Delete post (solo ADMIN)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  PostsController.delete
);

// Get post by ID (público para PUBLISHED)
router.get('/:id', PostsController.getById);

// ===================================
// RUTA RAÍZ - AL FINAL
// ===================================

// GET / - Lista de posts
router.get('/', PostsController.getAll);

// POST / - Crear post (ORGANIZER/ADMIN)
router.post(
  '/',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  PostsController.create
);

export default router;

// ============================================
// 📝 RESUMEN DE RUTAS
// ============================================
/*
✅ RUTAS PÚBLICAS (sin login requerido):
   GET  /posts                     → Lista (solo PUBLISHED)
   GET  /posts/check-slug/:slug    → Verificar slug
   GET  /posts/slug/:slug          → Post por slug (PUBLISHED)
   GET  /posts/:id                 → Post por ID (PUBLISHED)

✅ RUTAS PROTEGIDAS (requieren login):
   POST   /posts                   → Crear (ORGANIZER/ADMIN)
   PUT    /posts/:id               → Actualizar (autor/ADMIN)
   PATCH  /posts/:id               → Actualizar parcial (autor/ADMIN)
   DELETE /posts/:id               → Eliminar (ADMIN)
   POST   /posts/:id/publish       → Publicar/Aprobar (ADMIN)

Permisos:
- ADMIN: puede ver DRAFT, crear, editar, publicar, eliminar
- ORGANIZER: puede crear (status DRAFT), editar propios
- Público: puede ver solo PUBLISHED

Filtros disponibles (query params):
- search: búsqueda en título, excerpt, contenido
- category: filtrar por categoría (PostCategory)
- language: filtrar por idioma
- status: filtrar por estado (solo ADMIN puede ver DRAFT)
- authorId: filtrar por autor
- eventId: filtrar por evento relacionado
- competitionId: filtrar por competición relacionada
- editionId: filtrar por edición relacionada
- sortBy: ordenar por publishedAt, createdAt, viewCount, title
- sortOrder: asc o desc
- page: número de página
- limit: posts por página
*/
