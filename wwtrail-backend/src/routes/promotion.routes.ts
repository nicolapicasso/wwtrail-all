// src/routes/promotion.routes.ts - Promotions routes (Cupones y Contenido Exclusivo)

import { Router } from 'express';
import { PromotionController } from '../controllers/promotion.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

// ============================================
// PROMOTION ROUTES (Cupones y Contenido Exclusivo)
// ============================================
// Sistema unificado de promociones:
// - COUPON: Cupones con pool de códigos únicos
// - EXCLUSIVE_CONTENT: Contenido solo para usuarios registrados
// ============================================

// ===================================
// RUTAS PÚBLICAS ESPECÍFICAS
// ===================================

// Redeem coupon (público - requiere nombre + email)
router.post('/:id/redeem', PromotionController.redeemCoupon);

// Get promotion by ID or slug (público para PUBLISHED, requiere login para ver contenido exclusivo)
router.get('/:idOrSlug', PromotionController.getByIdOrSlug);

// ===================================
// RUTAS CON AUTENTICACIÓN
// ===================================

// Get coupon analytics (solo ADMIN)
router.get(
  '/analytics/coupons',
  authenticate,
  authorize('ADMIN'),
  PromotionController.getCouponAnalytics
);

// Add coupon codes to existing promotion (solo ADMIN)
router.post(
  '/:id/codes',
  authenticate,
  authorize('ADMIN'),
  PromotionController.addCouponCodes
);

// Update promotion (solo ADMIN)
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  PromotionController.update
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  PromotionController.update
);

// Delete promotion (solo ADMIN)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  PromotionController.delete
);

// ===================================
// RUTA RAÍZ - AL FINAL
// ===================================

// GET / - Lista de promociones (autenticación opcional para detectar ADMIN)
router.get('/', optionalAuthenticate, PromotionController.getAll);

// POST / - Crear promoción (solo ADMIN)
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  PromotionController.create
);

export default router;

// ============================================
// 📝 RESUMEN DE RUTAS
// ============================================
/*
✅ RUTAS PÚBLICAS (sin login requerido):
   GET  /promotions                      → Lista (solo PUBLISHED si no es admin)
   GET  /promotions/:idOrSlug            → Promoción por ID o slug
                                           - COUPON: muestra info sin códigos
                                           - EXCLUSIVE_CONTENT: requiere login para ver contenido
   POST /promotions/:id/redeem           → Canjear cupón (requiere nombre + email)

✅ RUTAS PROTEGIDAS (requieren login):
   POST   /promotions                    → Crear (ADMIN)
   PUT    /promotions/:id                → Actualizar (ADMIN)
   PATCH  /promotions/:id                → Actualizar parcial (ADMIN)
   DELETE /promotions/:id                → Eliminar (ADMIN)
   POST   /promotions/:id/codes          → Agregar códigos (ADMIN)
   GET    /promotions/analytics/coupons  → Analítica de cupones (ADMIN)

Permisos:
- ADMIN: puede crear, editar, eliminar, ver analíticas, ver DRAFT
- Usuario registrado: puede ver contenido exclusivo de promociones PUBLISHED
- Público: puede ver promociones PUBLISHED (pero no contenido exclusivo), canjear cupones

Filtros disponibles (query params):
- search: búsqueda en título, descripción
- type: EXCLUSIVE_CONTENT o COUPON
- categoryId: filtrar por categoría
- language: filtrar por idioma
- country: filtrar por país (incluye GLOBAL automáticamente)
- isGlobal: true/false
- featured: true/false
- status: DRAFT, PUBLISHED, ARCHIVED (solo ADMIN puede ver no PUBLISHED)
- sortBy: title, createdAt, viewCount
- sortOrder: asc o desc
- page: número de página
- limit: items por página

Campos requeridos para crear:
- type: EXCLUSIVE_CONTENT | COUPON
- title: string
- description: string
- language: Language enum
- isGlobal: boolean
- countries: string[] (si isGlobal = false)
- exclusiveContent: string (si type = EXCLUSIVE_CONTENT)
- couponCodes: string[] (si type = COUPON)

Campos opcionales:
- coverImage: string (URL)
- gallery: string[] (URLs)
- brandUrl: string (URL)
- categoryId: string (UUID)
- featured: boolean

Para canjear un cupón:
POST /promotions/:id/redeem
Body: { userName: string, userEmail: string }

Para agregar más códigos:
POST /promotions/:id/codes
Body: { codes: string[] }

Analítica:
GET /promotions/analytics/coupons?promotionId=uuid (opcional)
Devuelve estadísticas de todos los cupones o de uno específico
*/
