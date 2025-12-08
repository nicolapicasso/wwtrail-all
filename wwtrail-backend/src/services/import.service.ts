// src/services/import.service.ts
import { prisma } from '../config/database';
import { EventStatus, Language } from '@prisma/client';
import logger from '../utils/logger';
import { slugify } from '../utils/slugify';
import type {
  ImportOrganizer,
  ImportSeries,
  ImportEvent,
  ImportCompetition,
  ImportResult,
  FullImportResult,
} from '../schemas/import.schema';

// ============================================
// TYPES FOR NATIVE EXPORT FORMAT IMPORT
// ============================================

export type EntityType = 'events' | 'competitions' | 'editions' | 'organizers' | 'specialSeries' | 'services' | 'posts';
export type ConflictResolution = 'skip' | 'update' | 'create_new';

export interface NativeImportFile {
  exportedAt?: string;
  entity?: EntityType;
  version?: string;
  count?: number;
  data: any[];
}

export interface ConflictItem {
  index: number;
  id: string;
  slug?: string;
  name?: string;
  conflictType: 'id_exists' | 'slug_exists' | 'both_exist';
  existingRecord: {
    id: string;
    slug?: string;
    name?: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  entityType: EntityType;
  totalItems: number;
  validItems: number;
  conflicts: ConflictItem[];
  errors: string[];
  warnings: string[];
  preview: {
    toCreate: number;
    toSkip: number;
    potentialUpdates: number;
  };
}

export interface NativeImportOptions {
  conflictResolution: ConflictResolution;
  dryRun?: boolean;
  userId: string;
}

export interface NativeImportResult {
  success: boolean;
  entityType: EntityType;
  summary: {
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    errors: number;
  };
  details: {
    created: { id: string; name?: string; slug?: string }[];
    updated: { id: string; name?: string; slug?: string }[];
    skipped: { id: string; name?: string; slug?: string; reason: string }[];
    errors: { index: number; data: any; error: string }[];
  };
}

// Mapping from import terrain names to our slug format
const TERRAIN_MAPPING: Record<string, string> = {
  'Alta montaña': 'alta-montana',
  'Pista de tierra': 'pista-de-tierra',
  'Bosques y senderos': 'bosques-y-senderos',
  'Terreno muy técnico': 'terreno-muy-tecnico',
  'Selva/Jungla': 'selva-jungla',
  'Grandes lagos': 'grandes-lagos',
  'Llanuras': 'llanuras',
  'Desiertos': 'desiertos',
  'Costa y playa': 'costa-y-playa',
  'Terreno mixto': 'terreno-mixto',
};

// Language mapping from string to enum
const LANGUAGE_MAPPING: Record<string, Language> = {
  'ES': Language.ES,
  'EN': Language.EN,
  'IT': Language.IT,
  'FR': Language.FR,
  'DE': Language.DE,
  'CA': Language.CA,
};

export class ImportService {
  private adminUserId: string | null = null;

  /**
   * Get or cache the admin user ID for use as default creator
   */
  private async getAdminUserId(): Promise<string> {
    if (this.adminUserId) return this.adminUserId;

    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    if (!admin) {
      throw new Error('No admin user found. Please create an admin user first.');
    }

    this.adminUserId = admin.id;
    return admin.id;
  }

  /**
   * Ensure all required terrain types exist in the database
   */
  async ensureTerrainTypes(): Promise<ImportResult> {
    const results: ImportResult = { created: 0, skipped: 0, errors: [] };

    for (const [name, slug] of Object.entries(TERRAIN_MAPPING)) {
      try {
        const existing = await prisma.terrainType.findUnique({
          where: { slug },
        });

        if (existing) {
          results.skipped++;
          continue;
        }

        await prisma.terrainType.create({
          data: {
            name,
            slug,
            description: `Terreno tipo ${name.toLowerCase()}`,
            sortOrder: results.created + results.skipped + 1,
            isActive: true,
          },
        });
        results.created++;
      } catch (error: any) {
        results.errors.push({ identifier: slug, error: error.message });
      }
    }

    return results;
  }

  /**
   * Get terrain type ID by import name
   */
  private async getTerrainTypeId(terrainName: string | null): Promise<string | null> {
    if (!terrainName) return null;

    const slug = TERRAIN_MAPPING[terrainName];
    if (!slug) return null;

    const terrainType = await prisma.terrainType.findUnique({
      where: { slug },
      select: { id: true },
    });

    return terrainType?.id || null;
  }

  /**
   * Import organizers
   * Note: Organizer model requires country and createdById which are not in the import data
   * We use defaults: country='ES' and createdById=admin user
   */
  async importOrganizers(data: ImportOrganizer[]): Promise<ImportResult> {
    const results: ImportResult = { created: 0, skipped: 0, errors: [] };
    const adminId = await this.getAdminUserId();

    for (const org of data) {
      try {
        // Check if exists by slug or id
        const existing = await prisma.organizer.findFirst({
          where: {
            OR: [{ slug: org.slug }, { id: org.id }],
          },
        });

        if (existing) {
          results.skipped++;
          continue;
        }

        await prisma.organizer.create({
          data: {
            id: org.id,
            slug: org.slug,
            name: org.name,
            country: 'ES', // Default country
            status: EventStatus.PUBLISHED,
            createdById: adminId,
          },
        });
        results.created++;
      } catch (error: any) {
        results.errors.push({ identifier: org.slug, error: error.message });
      }
    }

    return results;
  }

  /**
   * Import special series
   * Note: SpecialSeries model requires country and createdById
   * We use defaults: country='ES' and createdById=admin user
   */
  async importSeries(data: ImportSeries[]): Promise<ImportResult> {
    const results: ImportResult = { created: 0, skipped: 0, errors: [] };
    const adminId = await this.getAdminUserId();

    for (const series of data) {
      try {
        // Check if exists by slug or id
        const existing = await prisma.specialSeries.findFirst({
          where: {
            OR: [{ slug: series.slug }, { id: series.id }],
          },
        });

        if (existing) {
          results.skipped++;
          continue;
        }

        await prisma.specialSeries.create({
          data: {
            id: series.id,
            slug: series.slug,
            name: series.name,
            country: 'ES', // Default country
            language: Language.ES,
            status: EventStatus.PUBLISHED,
            createdById: adminId,
          },
        });
        results.created++;
      } catch (error: any) {
        results.errors.push({ identifier: series.slug, error: error.message });
      }
    }

    return results;
  }

  /**
   * Import events
   * Note: Event model requires userId and firstEditionYear
   * We use defaults: userId=admin user and firstEditionYear=current year
   */
  async importEvents(data: ImportEvent[]): Promise<ImportResult> {
    const results: ImportResult = { created: 0, skipped: 0, errors: [] };
    const adminId = await this.getAdminUserId();
    const currentYear = new Date().getFullYear();

    for (const event of data) {
      try {
        // Check if exists by slug or id
        const existing = await prisma.event.findFirst({
          where: {
            OR: [{ slug: event.slug }, { id: event.id }],
          },
        });

        if (existing) {
          results.skipped++;
          continue;
        }

        // Create event (without location first)
        await prisma.event.create({
          data: {
            id: event.id,
            name: event.name,
            slug: event.slug,
            country: event.country || 'ES', // Default to ES if null
            city: event.city || '',
            website: event.website || undefined,
            phone: event.phone || undefined,
            email: event.email || undefined,
            instagramUrl: event.instagram || undefined,
            facebookUrl: event.facebook || undefined,
            typicalMonth: event.typicalMonth,
            status: event.status === 'PUBLISHED' ? EventStatus.PUBLISHED : EventStatus.DRAFT,
            userId: adminId,
            firstEditionYear: currentYear, // Default to current year
            language: Language.ES,
          },
        });

        // Update location if coordinates are provided
        if (event.latitude && event.longitude) {
          await prisma.$executeRaw`
            UPDATE events
            SET location = ST_SetSRID(ST_MakePoint(${event.longitude}, ${event.latitude}), 4326)
            WHERE id = ${event.id}
          `;
        }

        results.created++;
      } catch (error: any) {
        results.errors.push({ identifier: event.slug, error: error.message });
      }
    }

    return results;
  }

  /**
   * Import competitions
   * Note: Competition.organizerId points to User, not Organizer
   * We use the admin user as the organizer
   */
  async importCompetitions(data: ImportCompetition[]): Promise<ImportResult> {
    const results: ImportResult = { created: 0, skipped: 0, errors: [] };
    const adminId = await this.getAdminUserId();

    // Cache series slugs to IDs
    const seriesCache = new Map<string, string>();
    const allSeries = await prisma.specialSeries.findMany({
      select: { id: true, slug: true },
    });
    for (const s of allSeries) {
      seriesCache.set(s.slug, s.id);
    }

    for (const comp of data) {
      try {
        // Check if exists by slug or id
        const existing = await prisma.competition.findFirst({
          where: {
            OR: [{ slug: comp.slug }, { id: comp.id }],
          },
        });

        if (existing) {
          results.skipped++;
          continue;
        }

        // Verify the event exists
        const eventExists = await prisma.event.findUnique({
          where: { id: comp.eventId },
          select: { id: true },
        });

        if (!eventExists) {
          results.errors.push({
            identifier: comp.slug,
            error: `Event with id ${comp.eventId} not found`,
          });
          continue;
        }

        // Get terrain type ID if provided
        const terrainTypeId = await this.getTerrainTypeId(comp.terrainType);

        // Get series IDs for connection
        const seriesIds = comp.series
          .map((slug) => seriesCache.get(slug))
          .filter((id): id is string => id !== undefined);

        // Create competition
        await prisma.competition.create({
          data: {
            id: comp.id,
            eventId: comp.eventId,
            name: comp.name,
            slug: comp.slug,
            description: comp.description || undefined,
            baseDistance: comp.baseDistance,
            baseElevation: comp.baseElevation ? Math.round(comp.baseElevation) : null,
            itraPoints: comp.itraPoints,
            terrainTypeId,
            organizerId: adminId, // Use admin as organizer (Competition.organizerId -> User)
            featured: comp.featured,
            status: comp.status === 'PUBLISHED' ? EventStatus.PUBLISHED : EventStatus.DRAFT,
            language: LANGUAGE_MAPPING[comp.language] || Language.ES,
            // Connect to special series
            specialSeries: seriesIds.length > 0
              ? { connect: seriesIds.map((id) => ({ id })) }
              : undefined,
          },
        });

        results.created++;
      } catch (error: any) {
        results.errors.push({ identifier: comp.slug, error: error.message });
      }
    }

    return results;
  }

  /**
   * Full import in the correct order
   */
  async importAll(data: {
    organizers?: ImportOrganizer[];
    series?: ImportSeries[];
    events?: ImportEvent[];
    competitions?: ImportCompetition[];
  }): Promise<FullImportResult> {
    const result: FullImportResult = {};

    // First, ensure all terrain types exist
    console.log('📚 Ensuring terrain types exist...');
    result.terrainTypes = await this.ensureTerrainTypes();

    // Import in dependency order
    if (data.organizers && data.organizers.length > 0) {
      console.log(`📦 Importing ${data.organizers.length} organizers...`);
      result.organizers = await this.importOrganizers(data.organizers);
    }

    if (data.series && data.series.length > 0) {
      console.log(`🏆 Importing ${data.series.length} series...`);
      result.series = await this.importSeries(data.series);
    }

    if (data.events && data.events.length > 0) {
      console.log(`🏔️ Importing ${data.events.length} events...`);
      result.events = await this.importEvents(data.events);
    }

    if (data.competitions && data.competitions.length > 0) {
      console.log(`🏃 Importing ${data.competitions.length} competitions...`);
      result.competitions = await this.importCompetitions(data.competitions);
    }

    return result;
  }

  /**
   * Get import statistics
   */
  async getImportStats(): Promise<{
    organizers: number;
    specialSeries: number;
    events: number;
    competitions: number;
    terrainTypes: number;
  }> {
    const [organizers, specialSeries, events, competitions, terrainTypes] =
      await Promise.all([
        prisma.organizer.count(),
        prisma.specialSeries.count(),
        prisma.event.count(),
        prisma.competition.count(),
        prisma.terrainType.count(),
      ]);

    return { organizers, specialSeries, events, competitions, terrainTypes };
  }

  // ============================================
  // BULK DELETE METHODS
  // ============================================

  /**
   * Delete all competitions (and related data)
   */
  async deleteAllCompetitions(): Promise<{ deleted: number }> {
    // First delete related data
    await prisma.competitionTranslation.deleteMany({});
    await prisma.userCompetition.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.favorite.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.result.deleteMany({});
    await prisma.participant.deleteMany({});

    // Delete editions first (they depend on competitions)
    await prisma.editionRating.deleteMany({});
    await prisma.editionPodium.deleteMany({});
    await prisma.editionPhoto.deleteMany({});
    await prisma.userEdition.deleteMany({});
    await prisma.edition.deleteMany({});

    // Now delete competitions
    const result = await prisma.competition.deleteMany({});
    return { deleted: result.count };
  }

  /**
   * Delete all events (and related competitions)
   */
  async deleteAllEvents(): Promise<{ deleted: number }> {
    // Delete competitions first
    await this.deleteAllCompetitions();

    // Delete event translations
    await prisma.eventTranslation.deleteMany({});

    // Delete events
    const result = await prisma.event.deleteMany({});
    return { deleted: result.count };
  }

  /**
   * Delete all special series
   */
  async deleteAllSeries(): Promise<{ deleted: number }> {
    // Delete translations first
    await prisma.specialSeriesTranslation.deleteMany({});

    // Delete series (competitions will lose their series connections automatically)
    const result = await prisma.specialSeries.deleteMany({});
    return { deleted: result.count };
  }

  /**
   * Delete all organizers
   */
  async deleteAllOrganizers(): Promise<{ deleted: number }> {
    // Events will have their organizerId set to null due to onDelete: SetNull
    const result = await prisma.organizer.deleteMany({});
    return { deleted: result.count };
  }

  /**
   * Delete all editions
   */
  async deleteAllEditions(): Promise<{ deleted: number }> {
    // Delete related data first
    await prisma.editionRating.deleteMany({});
    await prisma.editionPodium.deleteMany({});
    await prisma.editionPhoto.deleteMany({});
    await prisma.userEdition.deleteMany({});

    const result = await prisma.edition.deleteMany({});
    return { deleted: result.count };
  }

  /**
   * Delete all imported data (full reset)
   */
  async deleteAllImportedData(): Promise<{
    competitions: number;
    events: number;
    series: number;
    organizers: number;
  }> {
    const competitions = await this.deleteAllCompetitions();
    const events = await this.deleteAllEvents();
    const series = await this.deleteAllSeries();
    const organizers = await this.deleteAllOrganizers();

    return {
      competitions: competitions.deleted,
      events: events.deleted,
      series: series.deleted,
      organizers: organizers.deleted,
    };
  }

  // ============================================
  // NATIVE EXPORT FORMAT IMPORT METHODS
  // ============================================

  /**
   * Validate import file and detect conflicts (native format)
   */
  async validateNativeImport(file: NativeImportFile, entityType?: EntityType): Promise<ValidationResult> {
    const detectedType = entityType || file.entity;

    if (!detectedType) {
      return {
        isValid: false,
        entityType: 'events',
        totalItems: 0,
        validItems: 0,
        conflicts: [],
        errors: ['No entity type specified. Please provide entityType or ensure file has entity field.'],
        warnings: [],
        preview: { toCreate: 0, toSkip: 0, potentialUpdates: 0 },
      };
    }

    if (!file.data || !Array.isArray(file.data)) {
      return {
        isValid: false,
        entityType: detectedType,
        totalItems: 0,
        validItems: 0,
        conflicts: [],
        errors: ['Invalid file format: data array is missing or invalid.'],
        warnings: [],
        preview: { toCreate: 0, toSkip: 0, potentialUpdates: 0 },
      };
    }

    const conflicts: ConflictItem[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    let validItems = 0;

    // Check each item for conflicts
    for (let i = 0; i < file.data.length; i++) {
      const item = file.data[i];

      try {
        const conflict = await this.checkNativeConflict(detectedType, item);
        if (conflict) {
          conflicts.push({ ...conflict, index: i });
        } else {
          validItems++;
        }
      } catch (err: any) {
        errors.push(`Item ${i}: ${err.message}`);
      }

      // Check for missing required fields
      const missingFields = this.checkRequiredFieldsNative(detectedType, item);
      if (missingFields.length > 0) {
        warnings.push(`Item ${i} (${item.name || item.id}): Missing fields: ${missingFields.join(', ')}`);
      }

      // Check for missing parent references
      const parentWarning = await this.checkParentExists(detectedType, item);
      if (parentWarning) {
        warnings.push(`Item ${i} (${item.name || item.id}): ${parentWarning}`);
      }
    }

    return {
      isValid: errors.length === 0,
      entityType: detectedType,
      totalItems: file.data.length,
      validItems,
      conflicts,
      errors,
      warnings,
      preview: {
        toCreate: validItems,
        toSkip: conflicts.length,
        potentialUpdates: conflicts.length,
      },
    };
  }

  /**
   * Import data from native export format
   */
  async importNativeData(
    file: NativeImportFile,
    entityType: EntityType,
    options: NativeImportOptions
  ): Promise<NativeImportResult> {
    const result: NativeImportResult = {
      success: true,
      entityType,
      summary: {
        processed: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: 0,
      },
      details: {
        created: [],
        updated: [],
        skipped: [],
        errors: [],
      },
    };

    if (!file.data || !Array.isArray(file.data)) {
      result.success = false;
      result.details.errors.push({ index: -1, data: null, error: 'Invalid file format' });
      return result;
    }

    for (let i = 0; i < file.data.length; i++) {
      const item = file.data[i];
      result.summary.processed++;

      try {
        const conflict = await this.checkNativeConflict(entityType, item);

        if (conflict) {
          switch (options.conflictResolution) {
            case 'skip':
              result.summary.skipped++;
              result.details.skipped.push({
                id: item.id,
                name: item.name,
                slug: item.slug,
                reason: `Conflict: ${conflict.conflictType}`,
              });
              break;

            case 'update':
              if (!options.dryRun) {
                const updated = await this.updateNativeEntity(entityType, item, conflict.existingRecord.id, options.userId);
                result.summary.updated++;
                result.details.updated.push({
                  id: updated.id,
                  name: updated.name,
                  slug: updated.slug,
                });
              } else {
                result.summary.updated++;
                result.details.updated.push({
                  id: conflict.existingRecord.id,
                  name: item.name,
                  slug: item.slug,
                });
              }
              break;

            case 'create_new':
              if (!options.dryRun) {
                const created = await this.createNativeEntityWithNewId(entityType, item, options.userId);
                result.summary.created++;
                result.details.created.push({
                  id: created.id,
                  name: created.name,
                  slug: created.slug,
                });
              } else {
                result.summary.created++;
                result.details.created.push({
                  id: '[NEW_ID]',
                  name: item.name,
                  slug: `${item.slug}-imported`,
                });
              }
              break;
          }
        } else {
          // No conflict - create new
          if (!options.dryRun) {
            const created = await this.createNativeEntity(entityType, item, options.userId);
            result.summary.created++;
            result.details.created.push({
              id: created.id,
              name: created.name,
              slug: created.slug,
            });
          } else {
            result.summary.created++;
            result.details.created.push({
              id: item.id || '[NEW_ID]',
              name: item.name,
              slug: item.slug,
            });
          }
        }
      } catch (err: any) {
        result.summary.errors++;
        result.details.errors.push({
          index: i,
          data: { id: item.id, name: item.name, slug: item.slug },
          error: err.message,
        });
        logger.error(`Import error for item ${i}:`, err);
      }
    }

    result.success = result.summary.errors === 0;
    return result;
  }

  // ============================================
  // NATIVE CONFLICT DETECTION
  // ============================================

  private getSelectFieldsForEntity(entityType: EntityType): Record<string, boolean> {
    switch (entityType) {
      case 'events':
      case 'competitions':
      case 'organizers':
      case 'specialSeries':
      case 'services':
        return { id: true, slug: true, name: true };
      case 'posts':
        return { id: true, slug: true, title: true };
      case 'editions':
        return { id: true, slug: true, year: true, competitionId: true };
      default:
        return { id: true };
    }
  }

  private async checkNativeConflict(entityType: EntityType, item: any): Promise<ConflictItem | null> {
    const model = this.getNativeModel(entityType);
    const selectFields = this.getSelectFieldsForEntity(entityType);

    let existingById = null;
    let existingBySlug = null;

    // Check by ID
    if (item.id) {
      try {
        existingById = await (model as any).findUnique({
          where: { id: item.id },
          select: selectFields,
        });
      } catch {
        // ID format might be invalid
      }
    }

    // Check by slug
    if (item.slug) {
      try {
        existingBySlug = await (model as any).findFirst({
          where: { slug: item.slug },
          select: selectFields,
        });
      } catch {
        // Slug might not exist in this model
      }
    }

    if (existingById && existingBySlug && existingById.id === existingBySlug.id) {
      return {
        index: 0,
        id: item.id,
        slug: item.slug,
        name: item.name || item.title,
        conflictType: 'both_exist',
        existingRecord: {
          id: existingById.id,
          slug: existingById.slug,
          name: existingById.name || existingById.title || `Year ${existingById.year}`,
        },
      };
    } else if (existingById) {
      return {
        index: 0,
        id: item.id,
        slug: item.slug,
        name: item.name || item.title,
        conflictType: 'id_exists',
        existingRecord: {
          id: existingById.id,
          slug: existingById.slug,
          name: existingById.name || existingById.title || `Year ${existingById.year}`,
        },
      };
    } else if (existingBySlug) {
      return {
        index: 0,
        id: item.id,
        slug: item.slug,
        name: item.name || item.title,
        conflictType: 'slug_exists',
        existingRecord: {
          id: existingBySlug.id,
          slug: existingBySlug.slug,
          name: existingBySlug.name || existingBySlug.title || `Year ${existingBySlug.year}`,
        },
      };
    }

    return null;
  }

  // ============================================
  // NATIVE ENTITY CREATION
  // ============================================

  private async createNativeEntity(entityType: EntityType, item: any, userId: string): Promise<any> {
    switch (entityType) {
      case 'events':
        return this.createNativeEvent(item, userId);
      case 'competitions':
        return this.createNativeCompetition(item, userId);
      case 'editions':
        return this.createNativeEdition(item, userId);
      case 'organizers':
        return this.createNativeOrganizer(item, userId);
      case 'specialSeries':
        return this.createNativeSpecialSeries(item, userId);
      case 'services':
        return this.createNativeService(item, userId);
      case 'posts':
        return this.createNativePost(item, userId);
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  }

  private async createNativeEntityWithNewId(entityType: EntityType, item: any, userId: string): Promise<any> {
    const newItem = { ...item };
    delete newItem.id;

    if (newItem.slug) {
      newItem.slug = await this.generateUniqueSlug(entityType, newItem.slug);
    }

    return this.createNativeEntity(entityType, newItem, userId);
  }

  private async generateUniqueSlug(entityType: EntityType, baseSlug: string): Promise<string> {
    const model = this.getNativeModel(entityType);
    let slug = `${baseSlug}-imported`;
    let counter = 1;

    while (true) {
      try {
        const existing = await (model as any).findFirst({
          where: { slug },
          select: { id: true },
        });

        if (!existing) {
          return slug;
        }

        slug = `${baseSlug}-imported-${counter}`;
        counter++;
      } catch {
        return slug;
      }
    }
  }

  private async createNativeEvent(item: any, userId: string): Promise<any> {
    const data: any = {
      name: item.name,
      slug: item.slug || slugify(item.name),
      description: item.description,
      city: item.city || '',
      country: item.country || 'ES',
      website: item.website,
      email: item.email,
      phone: item.phone,
      logoUrl: item.logoUrl,
      coverImage: item.coverImage,
      gallery: item.gallery || [],
      typicalMonth: item.typicalMonth,
      firstEditionYear: item.firstEditionYear || new Date().getFullYear(),
      featured: item.featured || false,
      status: item.status || 'PUBLISHED',
      userId: userId,
      language: item.language || 'ES',
      instagramUrl: item.instagramUrl,
      facebookUrl: item.facebookUrl,
      twitterUrl: item.twitterUrl,
      youtubeUrl: item.youtubeUrl,
    };

    // Handle organizer relation
    if (item.organizerId || item.organizer?.id) {
      const orgId = item.organizerId || item.organizer?.id;
      const orgExists = await prisma.organizer.findUnique({ where: { id: orgId } });
      if (orgExists) {
        data.organizerId = orgId;
      }
    }

    const event = await prisma.event.create({
      data,
      select: { id: true, name: true, slug: true },
    });

    // Set location if coordinates provided
    if (item.latitude && item.longitude) {
      await prisma.$executeRaw`
        UPDATE events
        SET location = ST_SetSRID(ST_MakePoint(${item.longitude}, ${item.latitude}), 4326)
        WHERE id = ${event.id}
      `;
    }

    logger.info(`Imported event: ${event.name} (${event.id})`);
    return event;
  }

  // Convert utmbIndex string to enum value
  private convertUtmbIndex(value: string | null | undefined): string | null {
    if (!value) return null;

    // Map common string formats to enum values
    const normalizedValue = value.toUpperCase().replace(/[^0-9KM]/g, '');
    const mappings: Record<string, string> = {
      '20K': 'INDEX_20K',
      '50K': 'INDEX_50K',
      '100K': 'INDEX_100K',
      '100M': 'INDEX_100M',
      'INDEX_20K': 'INDEX_20K',
      'INDEX_50K': 'INDEX_50K',
      'INDEX_100K': 'INDEX_100K',
      'INDEX_100M': 'INDEX_100M',
    };

    return mappings[normalizedValue] || mappings[value] || null;
  }

  private async createNativeCompetition(item: any, userId: string): Promise<any> {
    // Find event by ID or slug
    let eventId = item.eventId;
    if (!eventId && item.event) {
      const event = await prisma.event.findFirst({
        where: {
          OR: [
            { id: item.event.id },
            { slug: item.event.slug },
          ].filter(x => x.id || x.slug),
        },
        select: { id: true },
      });
      eventId = event?.id;
    }

    if (!eventId) {
      throw new Error(`Event not found for competition "${item.name}". Import the event first.`);
    }

    // Get organizer ID - prefer item.organizerId, fallback to userId
    let organizerId = item.organizerId;
    if (!organizerId) {
      // Check if there's an organizer in the event
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { organizerId: true },
      });
      organizerId = event?.organizerId || userId;
    }

    // Convert utmbIndex to proper enum value
    const utmbIndex = this.convertUtmbIndex(item.utmbIndex);

    const data: any = {
      eventId,
      name: item.name,
      slug: item.slug || slugify(item.name),
      description: item.description,
      type: item.type || item.competitionType?.toUpperCase() || 'TRAIL',
      baseDistance: item.baseDistance,
      baseElevation: item.baseElevation,
      baseMaxParticipants: item.baseMaxParticipants,
      itraPoints: item.itraPoints,
      utmbIndex,
      logoUrl: item.logoUrl || item.logo,
      coverImage: item.coverImage,
      gallery: item.gallery || [],
      featured: item.featured || false,
      status: item.status || 'PUBLISHED',
      organizerId,
      language: item.language || 'ES',
    };

    // Handle terrain type
    if (item.terrainTypeId || item.terrainType?.id) {
      const terrainId = item.terrainTypeId || item.terrainType?.id;
      const terrainExists = await prisma.terrainType.findUnique({ where: { id: terrainId } });
      if (terrainExists) {
        data.terrainTypeId = terrainId;
      }
    }

    const competition = await prisma.competition.create({
      data,
      select: { id: true, name: true, slug: true },
    });

    // Handle special series (many-to-many)
    if (item.specialSeries && Array.isArray(item.specialSeries)) {
      for (const series of item.specialSeries) {
        let seriesExists = null;

        if (typeof series === 'string') {
          // Series is a string (name) - search by name or slug
          seriesExists = await prisma.specialSeries.findFirst({
            where: {
              OR: [
                { name: { contains: series, mode: 'insensitive' } },
                { slug: series.toLowerCase().replace(/\s+/g, '-') },
              ],
            },
          });
        } else if (series && typeof series === 'object') {
          // Series is an object with id/slug/name
          const conditions = [];
          if (series.id) conditions.push({ id: series.id });
          if (series.slug) conditions.push({ slug: series.slug });
          if (series.name) conditions.push({ name: series.name });

          if (conditions.length > 0) {
            seriesExists = await prisma.specialSeries.findFirst({
              where: { OR: conditions },
            });
          }
        }

        if (seriesExists) {
          await prisma.competition.update({
            where: { id: competition.id },
            data: {
              specialSeries: {
                connect: { id: seriesExists.id },
              },
            },
          });
        }
      }
    }

    logger.info(`Imported competition: ${competition.name} (${competition.id})`);
    return competition;
  }

  private async createNativeEdition(item: any, _userId: string): Promise<any> {
    // Find competition by ID or slug
    let competitionId = item.competitionId;
    if (!competitionId && item.competition) {
      const competition = await prisma.competition.findFirst({
        where: {
          OR: [
            { id: item.competition.id },
            { slug: item.competition.slug },
          ].filter(x => x.id || x.slug),
        },
        select: { id: true },
      });
      competitionId = competition?.id;
    }

    if (!competitionId) {
      throw new Error(`Competition not found for edition "${item.name || item.year}". Import the competition first.`);
    }

    const data: any = {
      competitionId,
      year: item.year,
      slug: item.slug || `${item.year}`,
      name: item.name,
      description: item.description,
      startDate: item.startDate ? new Date(item.startDate) : null,
      endDate: item.endDate ? new Date(item.endDate) : null,
      distance: item.distance,
      elevation: item.elevation,
      maxParticipants: item.maxParticipants,
      currentParticipants: item.currentParticipants || 0,
      registrationUrl: item.registrationUrl,
      registrationStatus: item.registrationStatus || 'NOT_OPEN',
      price: item.price,
      currency: item.currency || 'EUR',
      itra: item.itra,
      utmb: item.utmb,
      logoUrl: item.logoUrl,
      coverImage: item.coverImage,
      gallery: item.gallery || [],
      status: item.status || 'PUBLISHED',
    };

    const edition = await prisma.edition.create({
      data,
      select: { id: true, year: true, slug: true, name: true },
    });

    // Set location if coordinates provided
    if (item.latitude && item.longitude) {
      await prisma.$executeRaw`
        UPDATE editions
        SET location = ST_SetSRID(ST_MakePoint(${item.longitude}, ${item.latitude}), 4326)
        WHERE id = ${edition.id}
      `;
    }

    logger.info(`Imported edition: ${edition.name || edition.year} (${edition.id})`);
    return { ...edition, name: edition.name || `${edition.year}` };
  }

  private async createNativeOrganizer(item: any, userId: string): Promise<any> {
    const data: any = {
      name: item.name,
      slug: item.slug || slugify(item.name),
      description: item.description,
      email: item.email,
      phone: item.phone,
      website: item.website,
      logoUrl: item.logoUrl,
      coverImage: item.coverImage,
      city: item.city,
      country: item.country || 'ES',
      verified: item.verified || false,
      featured: item.featured || false,
      createdById: userId,
      instagramUrl: item.instagramUrl,
      facebookUrl: item.facebookUrl,
      twitterUrl: item.twitterUrl,
      youtubeUrl: item.youtubeUrl,
    };

    const organizer = await prisma.organizer.create({
      data,
      select: { id: true, name: true, slug: true },
    });

    logger.info(`Imported organizer: ${organizer.name} (${organizer.id})`);
    return organizer;
  }

  private async createNativeSpecialSeries(item: any, userId: string): Promise<any> {
    const data: any = {
      name: item.name,
      slug: item.slug || slugify(item.name),
      description: item.description,
      logoUrl: item.logoUrl,
      website: item.website,
      country: item.country || 'ES',
      language: item.language || 'ES',
      createdById: userId,
    };

    const series = await prisma.specialSeries.create({
      data,
      select: { id: true, name: true, slug: true },
    });

    logger.info(`Imported special series: ${series.name} (${series.id})`);
    return series;
  }

  private async createNativeService(item: any, userId: string): Promise<any> {
    const data: any = {
      name: item.name,
      slug: item.slug || slugify(item.name),
      description: item.description,
      shortDescription: item.shortDescription,
      email: item.email,
      phone: item.phone,
      website: item.website,
      logoUrl: item.logoUrl,
      coverImage: item.coverImage,
      gallery: item.gallery || [],
      city: item.city,
      country: item.country || 'ES',
      address: item.address,
      featured: item.featured || false,
      verified: item.verified || false,
      status: item.status || 'PUBLISHED',
      organizerId: userId,
    };

    // Handle category
    if (item.categoryId || item.category?.id) {
      const catId = item.categoryId || item.category?.id;
      const catExists = await prisma.serviceCategory.findUnique({ where: { id: catId } });
      if (catExists) {
        data.categoryId = catId;
      }
    }

    const service = await prisma.service.create({
      data,
      select: { id: true, name: true, slug: true },
    });

    // Set location if coordinates provided
    if (item.latitude && item.longitude) {
      await prisma.$executeRaw`
        UPDATE services
        SET location = ST_SetSRID(ST_MakePoint(${item.longitude}, ${item.latitude}), 4326)
        WHERE id = ${service.id}
      `;
    }

    logger.info(`Imported service: ${service.name} (${service.id})`);
    return service;
  }

  private async createNativePost(item: any, userId: string): Promise<any> {
    const data: any = {
      title: item.title,
      slug: item.slug || slugify(item.title),
      content: item.content,
      excerpt: item.excerpt,
      coverImage: item.coverImage,
      status: item.status || 'PUBLISHED',
      featured: item.featured || false,
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      authorId: userId,
    };

    // Handle event relation
    if (item.eventId || item.event?.id) {
      const evtId = item.eventId || item.event?.id;
      const evtExists = await prisma.event.findUnique({ where: { id: evtId } });
      if (evtExists) {
        data.eventId = evtId;
      }
    }

    // Handle competition relation
    if (item.competitionId || item.competition?.id) {
      const compId = item.competitionId || item.competition?.id;
      const compExists = await prisma.competition.findUnique({ where: { id: compId } });
      if (compExists) {
        data.competitionId = compId;
      }
    }

    const post = await prisma.post.create({
      data,
      select: { id: true, title: true, slug: true },
    });

    logger.info(`Imported post: ${post.title} (${post.id})`);
    return { ...post, name: post.title };
  }

  // ============================================
  // NATIVE ENTITY UPDATE
  // ============================================

  private async updateNativeEntity(entityType: EntityType, item: any, existingId: string, _userId: string): Promise<any> {
    const model = this.getNativeModel(entityType);

    // Remove fields that shouldn't be updated
    const updateData = { ...item };
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.user;
    delete updateData.organizer;
    delete updateData.event;
    delete updateData.competition;
    delete updateData.competitions;
    delete updateData.editions;
    delete updateData.specialSeries;
    delete updateData.terrainType;
    delete updateData.category;
    delete updateData.author;
    delete updateData.tags;
    delete updateData.images;
    delete updateData._count;
    delete updateData.latitude;
    delete updateData.longitude;
    delete updateData.location;
    delete updateData.translations;
    delete updateData.createdBy;

    // Handle date fields
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    if (updateData.publishedAt) updateData.publishedAt = new Date(updateData.publishedAt);

    const updated = await (model as any).update({
      where: { id: existingId },
      data: updateData,
      select: { id: true, slug: true, name: true, title: true, year: true },
    });

    // Update location if coordinates provided
    if (item.latitude && item.longitude) {
      const table = entityType === 'events' ? 'events' : entityType === 'editions' ? 'editions' : entityType === 'services' ? 'services' : null;
      if (table) {
        await prisma.$executeRawUnsafe(`
          UPDATE ${table}
          SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)
          WHERE id = $3
        `, item.longitude, item.latitude, existingId);
      }
    }

    logger.info(`Updated ${entityType}: ${existingId}`);
    return { ...updated, name: updated.name || updated.title || `Year ${updated.year}` };
  }

  // ============================================
  // NATIVE HELPERS
  // ============================================

  private getNativeModel(entityType: EntityType): any {
    switch (entityType) {
      case 'events':
        return prisma.event;
      case 'competitions':
        return prisma.competition;
      case 'editions':
        return prisma.edition;
      case 'organizers':
        return prisma.organizer;
      case 'specialSeries':
        return prisma.specialSeries;
      case 'services':
        return prisma.service;
      case 'posts':
        return prisma.post;
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  }

  private checkRequiredFieldsNative(entityType: EntityType, item: any): string[] {
    const missing: string[] = [];

    switch (entityType) {
      case 'events':
        if (!item.name) missing.push('name');
        if (!item.city && !item.country) missing.push('city or country');
        break;
      case 'competitions':
        if (!item.name) missing.push('name');
        if (!item.eventId && !item.event) missing.push('event (eventId or event object)');
        break;
      case 'editions':
        if (!item.year) missing.push('year');
        if (!item.competitionId && !item.competition) missing.push('competition (competitionId or competition object)');
        break;
      case 'organizers':
        if (!item.name) missing.push('name');
        break;
      case 'specialSeries':
        if (!item.name) missing.push('name');
        break;
      case 'services':
        if (!item.name) missing.push('name');
        break;
      case 'posts':
        if (!item.title) missing.push('title');
        if (!item.content) missing.push('content');
        break;
    }

    return missing;
  }

  private async checkParentExists(entityType: EntityType, item: any): Promise<string | null> {
    switch (entityType) {
      case 'competitions':
        const eventId = item.eventId || item.event?.id;
        if (eventId) {
          const event = await prisma.event.findUnique({ where: { id: eventId } });
          if (!event) {
            return `Parent event (${eventId}) not found. Import it first.`;
          }
        }
        break;
      case 'editions':
        const compId = item.competitionId || item.competition?.id;
        if (compId) {
          const comp = await prisma.competition.findUnique({ where: { id: compId } });
          if (!comp) {
            return `Parent competition (${compId}) not found. Import it first.`;
          }
        }
        break;
    }
    return null;
  }
}

export const importService = new ImportService();
