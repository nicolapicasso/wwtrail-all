// src/routes/email-template.routes.ts - Email Template routes

import { Router } from 'express';
import { EmailTemplateController } from '../controllers/email-template.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

// ============================================
// EMAIL TEMPLATE ROUTES
// ============================================
// All routes require ADMIN authentication
// ============================================

// Get all email templates
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  EmailTemplateController.getAll
);

// Get email template by ID
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  EmailTemplateController.getById
);

// Create new email template
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  EmailTemplateController.create
);

// Update email template
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  EmailTemplateController.update
);

// Delete email template
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  EmailTemplateController.delete
);

// Preview email template
router.post(
  '/:id/preview',
  authenticate,
  authorize('ADMIN'),
  EmailTemplateController.preview
);

export default router;

// ============================================
// 📝 RESUMEN DE RUTAS
// ============================================
/*
✅ RUTAS PROTEGIDAS (requieren ADMIN):
   GET    /email-templates           → Obtener todas las plantillas
   GET    /email-templates/:id       → Obtener plantilla por ID
   POST   /email-templates            → Crear nueva plantilla
   PUT    /email-templates/:id       → Actualizar plantilla
   DELETE /email-templates/:id       → Eliminar plantilla
   POST   /email-templates/:id/preview → Vista previa con datos de ejemplo

Tipos de plantilla disponibles:
- COUPON_REDEMPTION: Cuando un usuario canjea un cupón
- WELCOME: Email de bienvenida
- PASSWORD_RESET: Resetear contraseña
- EVENT_REMINDER: Recordatorio de evento
- COMPETITION_UPDATE: Actualización de competición

Campos requeridos para crear:
- type: EmailTemplateType (enum)
- name: string
- subject: string (puede contener variables {{variable}})
- htmlBody: string (HTML con variables {{variable}})
- textBody: string (texto plano con variables)

Campos opcionales:
- availableVariables: Record<string, string> (descripción de variables disponibles)
- isActive: boolean (default: true)

Variables en plantillas:
Se usan con la sintaxis {{variableName}}
Ejemplo: "Hola {{userName}}, tu código es {{couponCode}}"

Condicionales simples:
{{#if variable}}Contenido si existe{{/if}}
Ejemplo: "{{#if brandUrl}}Visita: {{brandUrl}}{{/if}}"

Para preview:
POST /email-templates/:id/preview
Body: {
  "sampleData": {
    "userName": "John Doe",
    "couponCode": "ABC123",
    "promotionTitle": "Descuento 20%"
  }
}
*/
