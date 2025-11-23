// src/controllers/seo.controller.ts
import { Request, Response } from 'express';
import { SEOService } from '../services/seo.service';
import logger from '../utils/logger';

/**
 * Obtener SEO de una entidad específica
 * GET /api/v2/seo/:entityType/:entityId
 */
export async function getSEO(req: Request, res: Response) {
  try {
    const { entityType, entityId } = req.params;

    const seo = await SEOService.getSEO(entityType, entityId);

    if (!seo) {
      return res.status(404).json({
        success: false,
        message: 'SEO not found',
      });
    }

    res.json({
      success: true,
      data: seo,
    });
  } catch (error: any) {
    logger.error('Error in getSEO:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching SEO',
    });
  }
}

/**
 * Listar SEO de un tipo de entidad
 * GET /api/v2/seo/:entityType
 */
export async function listSEO(req: Request, res: Response) {
  try {
    const { entityType } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await SEOService.listSEO(entityType, page, limit);

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    logger.error('Error in listSEO:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error listing SEO',
    });
  }
}

/**
 * Generar SEO para una entidad
 * POST /api/v2/seo/generate
 * Body: { entityType, entityId?, slug?, data }
 */
export async function generateSEO(req: Request, res: Response) {
  try {
    const { entityType, entityId, slug, data } = req.body;

    if (!entityType) {
      return res.status(400).json({
        success: false,
        message: 'entityType is required',
      });
    }

    if (!entityId && !slug) {
      return res.status(400).json({
        success: false,
        message: 'Either entityId or slug is required',
      });
    }

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'data object is required',
      });
    }

    const seo = await SEOService.generateAndSave({
      entityType,
      entityId,
      slug,
      data,
    });

    res.json({
      success: true,
      data: seo,
      message: 'SEO generated successfully',
    });
  } catch (error: any) {
    logger.error('Error in generateSEO:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating SEO',
    });
  }
}

/**
 * Regenerar SEO (eliminar y crear de nuevo)
 * POST /api/v2/seo/regenerate
 * Body: { entityType, entityId?, slug?, data }
 */
export async function regenerateSEO(req: Request, res: Response) {
  try {
    const { entityType, entityId, slug, data } = req.body;

    if (!entityType) {
      return res.status(400).json({
        success: false,
        message: 'entityType is required',
      });
    }

    if (!entityId && !slug) {
      return res.status(400).json({
        success: false,
        message: 'Either entityId or slug is required',
      });
    }

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'data object is required',
      });
    }

    const seo = await SEOService.regenerateSEO({
      entityType,
      entityId,
      slug,
      data,
    });

    res.json({
      success: true,
      data: seo,
      message: 'SEO regenerated successfully',
    });
  } catch (error: any) {
    logger.error('Error in regenerateSEO:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error regenerating SEO',
    });
  }
}

/**
 * Actualizar SEO manualmente
 * PUT /api/v2/seo/:id
 * Body: { metaTitle?, metaDescription?, llmFaq? }
 */
export async function updateSEO(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { metaTitle, metaDescription, llmFaq } = req.body;

    const seo = await SEOService.updateSEO(id, {
      metaTitle,
      metaDescription,
      llmFaq,
    });

    res.json({
      success: true,
      data: seo,
      message: 'SEO updated successfully',
    });
  } catch (error: any) {
    logger.error('Error in updateSEO:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating SEO',
    });
  }
}

/**
 * Eliminar SEO
 * DELETE /api/v2/seo/:id
 */
export async function deleteSEO(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await SEOService.deleteSEO(id);

    res.json({
      success: true,
      message: 'SEO deleted successfully',
    });
  } catch (error: any) {
    logger.error('Error in deleteSEO:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting SEO',
    });
  }
}

// ==========================================
// CONFIGURACIÓN
// ==========================================

/**
 * Obtener configuración de SEO para un tipo de entidad
 * GET /api/v2/seo/config/:entityType
 */
export async function getConfig(req: Request, res: Response) {
  try {
    const { entityType } = req.params;

    const config = await SEOService.getConfig(entityType);

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Config not found',
      });
    }

    res.json({
      success: true,
      data: config,
    });
  } catch (error: any) {
    logger.error('Error in getConfig:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching config',
    });
  }
}

/**
 * Listar todas las configuraciones
 * GET /api/v2/seo/config
 */
export async function listConfigs(req: Request, res: Response) {
  try {
    const configs = await SEOService.listConfigs();

    res.json({
      success: true,
      data: configs,
    });
  } catch (error: any) {
    logger.error('Error in listConfigs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error listing configs',
    });
  }
}

/**
 * Crear o actualizar configuración
 * POST /api/v2/seo/config
 * Body: { entityType, metaTitleTemplate?, metaDescriptionTemplate?, qaPrompt?, ... }
 */
export async function upsertConfig(req: Request, res: Response) {
  try {
    const {
      entityType,
      metaTitleTemplate,
      metaDescriptionTemplate,
      qaPrompt,
      availableVariables,
      autoGenerate,
      generateOnCreate,
      generateOnUpdate,
    } = req.body;

    if (!entityType) {
      return res.status(400).json({
        success: false,
        message: 'entityType is required',
      });
    }

    const config = await SEOService.upsertConfig({
      entityType,
      metaTitleTemplate,
      metaDescriptionTemplate,
      qaPrompt,
      availableVariables,
      autoGenerate,
      generateOnCreate,
      generateOnUpdate,
    });

    res.json({
      success: true,
      data: config,
      message: 'Config saved successfully',
    });
  } catch (error: any) {
    logger.error('Error in upsertConfig:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error saving config',
    });
  }
}
