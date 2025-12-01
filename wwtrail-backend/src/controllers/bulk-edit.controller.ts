// src/controllers/bulk-edit.controller.ts
import { Request, Response, NextFunction } from 'express';
import { bulkEditService, BulkEditEntityType, BulkEditFilters, BulkEditOperation } from '../services/bulk-edit.service';
import { z } from 'zod';

// Validation schemas
const filterConditionSchema = z.object({
  field: z.string().min(1),
  operator: z.enum([
    'equals',
    'not_equals',
    'contains',
    'starts_with',
    'ends_with',
    'greater_than',
    'less_than',
    'in',
    'is_null',
    'is_not_null',
  ]),
  value: z.any(),
});

const filtersSchema = z.object({
  conditions: z.array(filterConditionSchema),
  logic: z.enum(['AND', 'OR']).optional(),
});

const bulkEditOperationSchema = z.object({
  field: z.string().min(1),
  value: z.any(),
});

const entityTypeSchema = z.enum([
  'event',
  'competition',
  'edition',
  'organizer',
  'specialSeries',
  'service',
  'post',
]);

class BulkEditController {
  /**
   * Get metadata for all entities (fields, types, etc.)
   * GET /api/v2/admin/bulk-edit/metadata
   */
  async getMetadata(_req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const metadata = bulkEditService.getEntitiesMetadata();

      return res.status(200).json({
        success: true,
        data: metadata,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get options for a relation field
   * GET /api/v2/admin/bulk-edit/relations/:relationEntity
   */
  async getRelationOptions(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { relationEntity } = req.params;
      const options = await bulkEditService.getRelationOptions(relationEntity);

      return res.status(200).json({
        success: true,
        data: options,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Query records with filters (for preview)
   * POST /api/v2/admin/bulk-edit/query
   */
  async queryRecords(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { entityType, filters, limit } = req.body;

      // Validate
      const validatedEntityType = entityTypeSchema.parse(entityType);
      const validatedFilters = filtersSchema.parse(filters || { conditions: [] });

      const records = await bulkEditService.queryRecords(
        validatedEntityType as BulkEditEntityType,
        validatedFilters as BulkEditFilters,
        limit || 100
      );

      return res.status(200).json({
        success: true,
        count: records.length,
        data: records,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      next(error);
    }
  }

  /**
   * Preview bulk edit operation (shows what will change)
   * POST /api/v2/admin/bulk-edit/preview
   */
  async preview(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { entityType, filters, operation } = req.body;

      // Validate
      const validatedEntityType = entityTypeSchema.parse(entityType);
      const validatedFilters = filtersSchema.parse(filters || { conditions: [] });
      const validatedOperation = bulkEditOperationSchema.parse(operation);

      const preview = await bulkEditService.previewBulkEdit(
        validatedEntityType as BulkEditEntityType,
        validatedFilters as BulkEditFilters,
        validatedOperation as BulkEditOperation
      );

      return res.status(200).json({
        success: true,
        data: preview,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      next(error);
    }
  }

  /**
   * Execute bulk edit operation
   * POST /api/v2/admin/bulk-edit/execute
   */
  async execute(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { entityType, filters, operation } = req.body;

      // Validate
      const validatedEntityType = entityTypeSchema.parse(entityType);
      const validatedFilters = filtersSchema.parse(filters || { conditions: [] });
      const validatedOperation = bulkEditOperationSchema.parse(operation);

      // Check that there are filters (prevent accidental mass updates)
      if (!validatedFilters.conditions || validatedFilters.conditions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one filter condition is required to prevent accidental mass updates',
        });
      }

      const result = await bulkEditService.executeBulkEdit(
        validatedEntityType as BulkEditEntityType,
        validatedFilters as BulkEditFilters,
        validatedOperation as BulkEditOperation
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Bulk edit failed',
          errors: result.errors,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Successfully updated ${result.updatedCount} ${validatedEntityType}(s)`,
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      next(error);
    }
  }

  /**
   * Disconnect special series from competitions (special endpoint for many-to-many)
   * POST /api/v2/admin/bulk-edit/disconnect-series
   */
  async disconnectSeries(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const { filters, seriesId } = req.body;

      // Validate
      const validatedFilters = filtersSchema.parse(filters || { conditions: [] });

      if (!seriesId) {
        return res.status(400).json({
          success: false,
          message: 'seriesId is required',
        });
      }

      const result = await bulkEditService.bulkDisconnectCompetitionSeries(
        validatedFilters as BulkEditFilters,
        seriesId
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Disconnect series failed',
          errors: result.errors,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Successfully disconnected series from ${result.updatedCount} competition(s)`,
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      next(error);
    }
  }
}

export const bulkEditController = new BulkEditController();
