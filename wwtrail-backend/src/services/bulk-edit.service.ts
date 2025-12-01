// src/services/bulk-edit.service.ts
import { prisma } from '../config/database';
import { Prisma, EventStatus, Language, RaceType, UTMBIndex } from '@prisma/client';

// Entity types supported by bulk edit
export type BulkEditEntityType =
  | 'event'
  | 'competition'
  | 'edition'
  | 'organizer'
  | 'specialSeries'
  | 'service'
  | 'post';

// Filter operators
export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'in'
  | 'is_null'
  | 'is_not_null';

// Filter condition
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

// Query filters for each entity type
export interface BulkEditFilters {
  conditions: FilterCondition[];
  logic?: 'AND' | 'OR';
}

// Bulk edit operation
export interface BulkEditOperation {
  field: string;
  value: any;
}

// Result of bulk edit
export interface BulkEditResult {
  success: boolean;
  entityType: BulkEditEntityType;
  updatedCount: number;
  updatedIds: string[];
  errors?: string[];
}

// Preview result
export interface BulkEditPreview {
  entityType: BulkEditEntityType;
  matchingCount: number;
  matchingRecords: {
    id: string;
    displayName: string;
    currentValue: any;
    newValue: any;
  }[];
  field: string;
}

// Field metadata for UI
export interface FieldMetadata {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'date' | 'relation';
  enumValues?: string[];
  relationEntity?: string;
  filterable: boolean;
  editable: boolean;
}

// Entity metadata with fields
export interface EntityMetadata {
  name: BulkEditEntityType;
  label: string;
  fields: FieldMetadata[];
}

export class BulkEditService {
  /**
   * Get metadata for all supported entities and their editable fields
   */
  getEntitiesMetadata(): EntityMetadata[] {
    return [
      {
        name: 'competition',
        label: 'Competiciones',
        fields: [
          { name: 'name', label: 'Nombre', type: 'string', filterable: true, editable: true },
          { name: 'status', label: 'Estado', type: 'enum', enumValues: ['DRAFT', 'PUBLISHED', 'CANCELLED'], filterable: true, editable: true },
          { name: 'featured', label: 'Destacada', type: 'boolean', filterable: true, editable: true },
          { name: 'baseDistance', label: 'Distancia (km)', type: 'number', filterable: true, editable: true },
          { name: 'baseElevation', label: 'Desnivel (m+)', type: 'number', filterable: true, editable: true },
          { name: 'itraPoints', label: 'Puntos ITRA', type: 'number', filterable: true, editable: true },
          { name: 'utmbIndex', label: 'Indice UTMB', type: 'enum', enumValues: ['INDEX_20K', 'INDEX_50K', 'INDEX_100K', 'INDEX_100M'], filterable: true, editable: true },
          { name: 'raceType', label: 'Tipo de carrera', type: 'enum', enumValues: ['TRAIL', 'ULTRA', 'VERTICAL', 'SKYRUNNING', 'CANICROSS', 'OTHER'], filterable: true, editable: true },
          { name: 'language', label: 'Idioma', type: 'enum', enumValues: ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'], filterable: true, editable: true },
          { name: 'specialSeries', label: 'Special Series', type: 'relation', relationEntity: 'specialSeries', filterable: true, editable: true },
          { name: 'terrainTypeId', label: 'Tipo de terreno', type: 'relation', relationEntity: 'terrainType', filterable: true, editable: true },
          { name: 'eventId', label: 'Evento', type: 'relation', relationEntity: 'event', filterable: true, editable: false },
        ],
      },
      {
        name: 'event',
        label: 'Eventos',
        fields: [
          { name: 'name', label: 'Nombre', type: 'string', filterable: true, editable: true },
          { name: 'status', label: 'Estado', type: 'enum', enumValues: ['DRAFT', 'PUBLISHED', 'CANCELLED'], filterable: true, editable: true },
          { name: 'featured', label: 'Destacado', type: 'boolean', filterable: true, editable: true },
          { name: 'country', label: 'Pais', type: 'string', filterable: true, editable: true },
          { name: 'city', label: 'Ciudad', type: 'string', filterable: true, editable: true },
          { name: 'language', label: 'Idioma', type: 'enum', enumValues: ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'], filterable: true, editable: true },
          { name: 'typicalMonth', label: 'Mes tipico', type: 'number', filterable: true, editable: true },
          { name: 'organizerId', label: 'Organizador', type: 'relation', relationEntity: 'organizer', filterable: true, editable: true },
        ],
      },
      {
        name: 'edition',
        label: 'Ediciones',
        fields: [
          { name: 'year', label: 'Ano', type: 'number', filterable: true, editable: true },
          { name: 'status', label: 'Estado', type: 'enum', enumValues: ['UPCOMING', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'ONGOING', 'FINISHED', 'CANCELLED'], filterable: true, editable: true },
          { name: 'distance', label: 'Distancia (km)', type: 'number', filterable: true, editable: true },
          { name: 'elevation', label: 'Desnivel (m+)', type: 'number', filterable: true, editable: true },
          { name: 'maxParticipants', label: 'Max participantes', type: 'number', filterable: true, editable: true },
          { name: 'registrationStatus', label: 'Estado inscripcion', type: 'enum', enumValues: ['NOT_OPEN', 'OPEN', 'FULL', 'CLOSED'], filterable: true, editable: true },
          { name: 'competitionId', label: 'Competicion', type: 'relation', relationEntity: 'competition', filterable: true, editable: false },
        ],
      },
      {
        name: 'organizer',
        label: 'Organizadores',
        fields: [
          { name: 'name', label: 'Nombre', type: 'string', filterable: true, editable: true },
          { name: 'status', label: 'Estado', type: 'enum', enumValues: ['DRAFT', 'PUBLISHED', 'CANCELLED'], filterable: true, editable: true },
          { name: 'country', label: 'Pais', type: 'string', filterable: true, editable: true },
          { name: 'website', label: 'Web', type: 'string', filterable: true, editable: true },
        ],
      },
      {
        name: 'specialSeries',
        label: 'Special Series',
        fields: [
          { name: 'name', label: 'Nombre', type: 'string', filterable: true, editable: true },
          { name: 'status', label: 'Estado', type: 'enum', enumValues: ['DRAFT', 'PUBLISHED', 'CANCELLED'], filterable: true, editable: true },
          { name: 'country', label: 'Pais', type: 'string', filterable: true, editable: true },
          { name: 'language', label: 'Idioma', type: 'enum', enumValues: ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'], filterable: true, editable: true },
        ],
      },
      {
        name: 'service',
        label: 'Servicios',
        fields: [
          { name: 'name', label: 'Nombre', type: 'string', filterable: true, editable: true },
          { name: 'status', label: 'Estado', type: 'enum', enumValues: ['DRAFT', 'PUBLISHED', 'CANCELLED'], filterable: true, editable: true },
          { name: 'featured', label: 'Destacado', type: 'boolean', filterable: true, editable: true },
          { name: 'country', label: 'Pais', type: 'string', filterable: true, editable: true },
          { name: 'city', label: 'Ciudad', type: 'string', filterable: true, editable: true },
          { name: 'language', label: 'Idioma', type: 'enum', enumValues: ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'], filterable: true, editable: true },
          { name: 'categoryId', label: 'Categoria', type: 'relation', relationEntity: 'serviceCategory', filterable: true, editable: true },
        ],
      },
      {
        name: 'post',
        label: 'Posts',
        fields: [
          { name: 'title', label: 'Titulo', type: 'string', filterable: true, editable: true },
          { name: 'status', label: 'Estado', type: 'enum', enumValues: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], filterable: true, editable: true },
          { name: 'category', label: 'Categoria', type: 'enum', enumValues: ['GENERAL', 'TRAINING', 'NUTRITION', 'GEAR', 'DESTINATIONS', 'INTERVIEWS', 'RACE_REPORTS', 'TIPS'], filterable: true, editable: true },
          { name: 'language', label: 'Idioma', type: 'enum', enumValues: ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'], filterable: true, editable: true },
        ],
      },
    ];
  }

  /**
   * Get options for relation fields (for dropdowns in UI)
   */
  async getRelationOptions(relationEntity: string): Promise<{ id: string; name: string }[]> {
    switch (relationEntity) {
      case 'specialSeries':
        return prisma.specialSeries.findMany({
          select: { id: true, name: true },
          where: { status: 'PUBLISHED' },
          orderBy: { name: 'asc' },
        });

      case 'terrainType':
        return prisma.terrainType.findMany({
          select: { id: true, name: true },
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        });

      case 'organizer':
        return prisma.organizer.findMany({
          select: { id: true, name: true },
          where: { status: 'PUBLISHED' },
          orderBy: { name: 'asc' },
        });

      case 'event':
        return prisma.event.findMany({
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        });

      case 'competition':
        return prisma.competition.findMany({
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        });

      case 'serviceCategory':
        return prisma.serviceCategory.findMany({
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        });

      default:
        return [];
    }
  }

  // Many-to-many relation fields that need special handling
  private readonly MANY_TO_MANY_FIELDS = ['specialSeries'];

  /**
   * Build Prisma where clause from filters
   */
  private buildWhereClause(filters: BulkEditFilters): any {
    if (!filters.conditions || filters.conditions.length === 0) {
      return {};
    }

    const conditions = filters.conditions.map((condition) => {
      const { field, operator, value } = condition;

      // Handle many-to-many relations (like specialSeries)
      if (this.MANY_TO_MANY_FIELDS.includes(field)) {
        switch (operator) {
          case 'equals':
            return { [field]: { some: { id: value } } };
          case 'not_equals':
            return { [field]: { none: { id: value } } };
          case 'is_null':
            return { [field]: { none: {} } };
          case 'is_not_null':
            return { [field]: { some: {} } };
          default:
            return { [field]: { some: { id: value } } };
        }
      }

      // Standard field handling
      switch (operator) {
        case 'equals':
          return { [field]: value };
        case 'not_equals':
          return { [field]: { not: value } };
        case 'contains':
          return { [field]: { contains: value, mode: 'insensitive' } };
        case 'starts_with':
          return { [field]: { startsWith: value, mode: 'insensitive' } };
        case 'ends_with':
          return { [field]: { endsWith: value, mode: 'insensitive' } };
        case 'greater_than':
          return { [field]: { gt: value } };
        case 'less_than':
          return { [field]: { lt: value } };
        case 'in':
          return { [field]: { in: Array.isArray(value) ? value : [value] } };
        case 'is_null':
          return { [field]: null };
        case 'is_not_null':
          return { [field]: { not: null } };
        default:
          return {};
      }
    });

    if (filters.logic === 'OR') {
      return { OR: conditions };
    }

    return { AND: conditions };
  }

  /**
   * Query records with filters
   */
  async queryRecords(
    entityType: BulkEditEntityType,
    filters: BulkEditFilters,
    limit = 100
  ): Promise<{ id: string; name: string; [key: string]: any }[]> {
    const where = this.buildWhereClause(filters);

    switch (entityType) {
      case 'competition':
        return prisma.competition.findMany({
          where,
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            featured: true,
            baseDistance: true,
            baseElevation: true,
            itraPoints: true,
            utmbIndex: true,
            raceType: true,
            language: true,
            terrainTypeId: true,
            eventId: true,
            specialSeries: {
              select: { id: true, name: true },
            },
            event: {
              select: { id: true, name: true },
            },
          },
          take: limit,
          orderBy: { name: 'asc' },
        });

      case 'event':
        return prisma.event.findMany({
          where,
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            featured: true,
            country: true,
            city: true,
            language: true,
            typicalMonth: true,
            organizerId: true,
            organizer: {
              select: { id: true, name: true },
            },
          },
          take: limit,
          orderBy: { name: 'asc' },
        });

      case 'edition':
        return prisma.edition.findMany({
          where,
          select: {
            id: true,
            year: true,
            slug: true,
            status: true,
            distance: true,
            elevation: true,
            maxParticipants: true,
            registrationStatus: true,
            competitionId: true,
            competition: {
              select: { id: true, name: true },
            },
          },
          take: limit,
          orderBy: { year: 'desc' },
        }) as any;

      case 'organizer':
        return prisma.organizer.findMany({
          where,
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            country: true,
            website: true,
          },
          take: limit,
          orderBy: { name: 'asc' },
        });

      case 'specialSeries':
        return prisma.specialSeries.findMany({
          where,
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            country: true,
            language: true,
          },
          take: limit,
          orderBy: { name: 'asc' },
        });

      case 'service':
        return prisma.service.findMany({
          where,
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            featured: true,
            country: true,
            city: true,
            language: true,
            categoryId: true,
            category: {
              select: { id: true, name: true },
            },
          },
          take: limit,
          orderBy: { name: 'asc' },
        });

      case 'post':
        return prisma.post.findMany({
          where,
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            category: true,
            language: true,
          },
          take: limit,
          orderBy: { createdAt: 'desc' },
        }).then(posts => posts.map(p => ({ ...p, name: p.title })));

      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }

  /**
   * Preview bulk edit operation (shows what will change)
   */
  async previewBulkEdit(
    entityType: BulkEditEntityType,
    filters: BulkEditFilters,
    operation: BulkEditOperation
  ): Promise<BulkEditPreview> {
    const records = await this.queryRecords(entityType, filters, 100);

    const matchingRecords = records.map((record) => ({
      id: record.id,
      displayName: record.name || record.title || record.slug || record.id,
      currentValue: record[operation.field],
      newValue: operation.value,
    }));

    return {
      entityType,
      matchingCount: records.length,
      matchingRecords,
      field: operation.field,
    };
  }

  /**
   * Execute bulk edit operation
   */
  async executeBulkEdit(
    entityType: BulkEditEntityType,
    filters: BulkEditFilters,
    operation: BulkEditOperation
  ): Promise<BulkEditResult> {
    const where = this.buildWhereClause(filters);
    const { field, value } = operation;

    // Handle special case: many-to-many relations (like specialSeries on competition)
    if (field === 'specialSeries' && entityType === 'competition') {
      return this.bulkEditCompetitionSeries(filters, value);
    }

    // Standard update
    const data = { [field]: value };

    try {
      let result: { count: number };
      let updatedIds: string[] = [];

      // First get the IDs that will be updated
      const recordsToUpdate = await this.queryRecords(entityType, filters, 10000);
      updatedIds = recordsToUpdate.map((r) => r.id);

      switch (entityType) {
        case 'competition':
          result = await prisma.competition.updateMany({ where, data });
          break;
        case 'event':
          result = await prisma.event.updateMany({ where, data });
          break;
        case 'edition':
          result = await prisma.edition.updateMany({ where, data });
          break;
        case 'organizer':
          result = await prisma.organizer.updateMany({ where, data });
          break;
        case 'specialSeries':
          result = await prisma.specialSeries.updateMany({ where, data });
          break;
        case 'service':
          result = await prisma.service.updateMany({ where, data });
          break;
        case 'post':
          result = await prisma.post.updateMany({ where, data });
          break;
        default:
          throw new Error(`Unsupported entity type: ${entityType}`);
      }

      return {
        success: true,
        entityType,
        updatedCount: result.count,
        updatedIds,
      };
    } catch (error: any) {
      return {
        success: false,
        entityType,
        updatedCount: 0,
        updatedIds: [],
        errors: [error.message],
      };
    }
  }

  /**
   * Special handler for bulk editing competition special series (many-to-many)
   */
  private async bulkEditCompetitionSeries(
    filters: BulkEditFilters,
    seriesId: string
  ): Promise<BulkEditResult> {
    const where = this.buildWhereClause(filters);

    try {
      // Get all matching competitions
      const competitions = await prisma.competition.findMany({
        where,
        select: { id: true },
      });

      const competitionIds = competitions.map((c) => c.id);

      // Use transaction to connect series to all competitions
      await prisma.$transaction(
        competitionIds.map((compId) =>
          prisma.competition.update({
            where: { id: compId },
            data: {
              specialSeries: {
                connect: { id: seriesId },
              },
            },
          })
        )
      );

      return {
        success: true,
        entityType: 'competition',
        updatedCount: competitionIds.length,
        updatedIds: competitionIds,
      };
    } catch (error: any) {
      return {
        success: false,
        entityType: 'competition',
        updatedCount: 0,
        updatedIds: [],
        errors: [error.message],
      };
    }
  }

  /**
   * Disconnect special series from competitions (bulk)
   */
  async bulkDisconnectCompetitionSeries(
    filters: BulkEditFilters,
    seriesId: string
  ): Promise<BulkEditResult> {
    const where = this.buildWhereClause(filters);

    try {
      const competitions = await prisma.competition.findMany({
        where,
        select: { id: true },
      });

      const competitionIds = competitions.map((c) => c.id);

      await prisma.$transaction(
        competitionIds.map((compId) =>
          prisma.competition.update({
            where: { id: compId },
            data: {
              specialSeries: {
                disconnect: { id: seriesId },
              },
            },
          })
        )
      );

      return {
        success: true,
        entityType: 'competition',
        updatedCount: competitionIds.length,
        updatedIds: competitionIds,
      };
    } catch (error: any) {
      return {
        success: false,
        entityType: 'competition',
        updatedCount: 0,
        updatedIds: [],
        errors: [error.message],
      };
    }
  }
}

export const bulkEditService = new BulkEditService();
