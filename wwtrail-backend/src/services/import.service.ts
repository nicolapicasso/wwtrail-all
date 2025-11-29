// src/services/import.service.ts
import { prisma } from '../config/database';
import { EventStatus, Language } from '@prisma/client';
import type {
  ImportOrganizer,
  ImportSeries,
  ImportEvent,
  ImportCompetition,
  ImportResult,
  FullImportResult,
} from '../schemas/import.schema';

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
}

export const importService = new ImportService();
