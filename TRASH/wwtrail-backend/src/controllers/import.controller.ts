// src/controllers/import.controller.ts
import { Request, Response, NextFunction } from 'express';
import { importService, EntityType, ConflictResolution, NativeImportFile } from '../services/import.service';
import {
  importOrganizerSchema,
  importSeriesSchema,
  importEventSchema,
  importCompetitionSchema,
  fullImportSchema,
} from '../schemas/import.schema';
import { z } from 'zod';

// Schema for native import options
const nativeImportOptionsSchema = z.object({
  conflictResolution: z.enum(['skip', 'update', 'create_new']).default('skip'),
  dryRun: z.boolean().optional().default(false),
});

const VALID_ENTITY_TYPES: EntityType[] = ['events', 'competitions', 'editions', 'organizers', 'specialSeries', 'services', 'posts'];

class ImportController {
  /**
   * Import organizers
   * POST /api/v2/admin/import/organizers
   */
  async importOrganizers(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const data = z.array(importOrganizerSchema).parse(req.body);

      if (data.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No organizers provided',
        });
      }

      const result = await importService.importOrganizers(data);

      return res.status(200).json({
        success: true,
        message: `Import completed: ${result.created} created, ${result.skipped} skipped`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Import special series
   * POST /api/v2/admin/import/series
   */
  async importSeries(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const data = z.array(importSeriesSchema).parse(req.body);

      if (data.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No series provided',
        });
      }

      const result = await importService.importSeries(data);

      return res.status(200).json({
        success: true,
        message: `Import completed: ${result.created} created, ${result.skipped} skipped`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Import events
   * POST /api/v2/admin/import/events
   */
  async importEvents(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const data = z.array(importEventSchema).parse(req.body);

      if (data.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No events provided',
        });
      }

      const result = await importService.importEvents(data);

      return res.status(200).json({
        success: true,
        message: `Import completed: ${result.created} created, ${result.skipped} skipped`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Import competitions
   * POST /api/v2/admin/import/competitions
   */
  async importCompetitions(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const data = z.array(importCompetitionSchema).parse(req.body);

      if (data.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No competitions provided',
        });
      }

      const result = await importService.importCompetitions(data);

      return res.status(200).json({
        success: true,
        message: `Import completed: ${result.created} created, ${result.skipped} skipped`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Full import (organizers + series + events + competitions)
   * POST /api/v2/admin/import/full
   */
  async importFull(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const data = fullImportSchema.parse(req.body);

      const totalItems =
        (data.organizers?.length || 0) +
        (data.series?.length || 0) +
        (data.events?.length || 0) +
        (data.competitions?.length || 0);

      if (totalItems === 0) {
        return res.status(400).json({
          success: false,
          message: 'No data provided for import',
        });
      }

      const result = await importService.importAll(data);

      // Calculate totals
      const totalCreated =
        (result.organizers?.created || 0) +
        (result.series?.created || 0) +
        (result.events?.created || 0) +
        (result.competitions?.created || 0);

      const totalSkipped =
        (result.organizers?.skipped || 0) +
        (result.series?.skipped || 0) +
        (result.events?.skipped || 0) +
        (result.competitions?.skipped || 0);

      const totalErrors =
        (result.organizers?.errors.length || 0) +
        (result.series?.errors.length || 0) +
        (result.events?.errors.length || 0) +
        (result.competitions?.errors.length || 0);

      return res.status(200).json({
        success: true,
        message: `Full import completed: ${totalCreated} created, ${totalSkipped} skipped, ${totalErrors} errors`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Ensure terrain types exist
   * POST /api/v2/admin/import/terrain-types
   */
  async ensureTerrainTypes(_req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const result = await importService.ensureTerrainTypes();

      return res.status(200).json({
        success: true,
        message: `Terrain types: ${result.created} created, ${result.skipped} already exist`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get import statistics
   * GET /api/v2/admin/import/stats
   */
  async getStats(_req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const stats = await importService.getImportStats();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // BULK DELETE ENDPOINTS
  // ============================================

  /**
   * Delete all competitions
   * DELETE /api/v1/admin/import/competitions
   */
  async deleteAllCompetitions(_req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const result = await importService.deleteAllCompetitions();

      return res.status(200).json({
        success: true,
        message: `${result.deleted} competitions deleted`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete all events
   * DELETE /api/v1/admin/import/events
   */
  async deleteAllEvents(_req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const result = await importService.deleteAllEvents();

      return res.status(200).json({
        success: true,
        message: `${result.deleted} events deleted`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete all series
   * DELETE /api/v1/admin/import/series
   */
  async deleteAllSeries(_req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const result = await importService.deleteAllSeries();

      return res.status(200).json({
        success: true,
        message: `${result.deleted} series deleted`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete all organizers
   * DELETE /api/v1/admin/import/organizers
   */
  async deleteAllOrganizers(_req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const result = await importService.deleteAllOrganizers();

      return res.status(200).json({
        success: true,
        message: `${result.deleted} organizers deleted`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete all editions
   * DELETE /api/v1/admin/import/editions
   */
  async deleteAllEditions(_req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const result = await importService.deleteAllEditions();

      return res.status(200).json({
        success: true,
        message: `${result.deleted} editions deleted`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete all imported data (full reset)
   * DELETE /api/v1/admin/import/all
   */
  async deleteAllImportedData(_req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const result = await importService.deleteAllImportedData();

      return res.status(200).json({
        success: true,
        message: `Deleted: ${result.competitions} competitions, ${result.events} events, ${result.series} series, ${result.organizers} organizers`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // NATIVE EXPORT FORMAT IMPORT ENDPOINTS
  // ============================================

  /**
   * Validate native export file and detect conflicts
   * POST /api/v2/admin/import/native/validate
   * Body: { entity?: EntityType, data: any[] }
   * Query: ?entityType=events|competitions|editions|...
   */
  async validateNativeImport(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const entityType = (req.query.entityType as EntityType) || req.body.entity;

      if (!entityType || !VALID_ENTITY_TYPES.includes(entityType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid or missing entityType. Valid types: ${VALID_ENTITY_TYPES.join(', ')}`,
        });
      }

      const file: NativeImportFile = req.body;

      if (!file.data || !Array.isArray(file.data)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file format: data array is required',
        });
      }

      const result = await importService.validateNativeImport(file, entityType);

      return res.status(200).json({
        success: true,
        message: result.isValid
          ? `Validation passed: ${result.validItems} items ready to import`
          : `Validation completed with ${result.conflicts.length} conflicts and ${result.errors.length} errors`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Import from native export format
   * POST /api/v2/admin/import/native
   * Body: { entity?: EntityType, data: any[], conflictResolution?: 'skip' | 'update' | 'create_new', dryRun?: boolean }
   * Query: ?entityType=events|competitions|editions|...
   */
  async importNative(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const entityType = (req.query.entityType as EntityType) || req.body.entity;

      if (!entityType || !VALID_ENTITY_TYPES.includes(entityType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid or missing entityType. Valid types: ${VALID_ENTITY_TYPES.join(', ')}`,
        });
      }

      const file: NativeImportFile = {
        exportedAt: req.body.exportedAt,
        entity: entityType,
        version: req.body.version,
        count: req.body.count,
        data: req.body.data,
      };

      if (!file.data || !Array.isArray(file.data)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file format: data array is required',
        });
      }

      // Parse options
      const optionsInput = {
        conflictResolution: req.body.conflictResolution || 'skip',
        dryRun: req.body.dryRun === true || req.body.dryRun === 'true',
      };
      const options = nativeImportOptionsSchema.parse(optionsInput);

      const userId = req.user!.id;
      const parentId = req.body.parentId;

      const result = await importService.importNativeData(file, entityType, {
        conflictResolution: options.conflictResolution as ConflictResolution,
        dryRun: options.dryRun,
        userId,
        parentId,
      });

      const statusMessage = options.dryRun
        ? `[DRY RUN] Import preview: ${result.summary.created} to create, ${result.summary.updated} to update, ${result.summary.skipped} to skip`
        : `Import completed: ${result.summary.created} created, ${result.summary.updated} updated, ${result.summary.skipped} skipped, ${result.summary.errors} errors`;

      return res.status(result.success ? 200 : 207).json({
        success: result.success,
        message: statusMessage,
        dryRun: options.dryRun,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Import editions from native export format
   * POST /api/v2/admin/import/native/editions
   * Convenience endpoint specifically for editions
   */
  async importNativeEditions(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    req.query.entityType = 'editions';
    return this.importNative(req, res, next);
  }
}

export const importController = new ImportController();
