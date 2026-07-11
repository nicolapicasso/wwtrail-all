// src/services/export.service.ts
import { prisma } from '../config/database';

export interface ExportOptions {
  includeRelations?: boolean;
  format?: 'json';
}

export interface ExportResult {
  exportedAt: string;
  version: string;
  counts: {
    events: number;
    competitions: number;
    editions: number;
    organizers: number;
    specialSeries: number;
    services: number;
    posts: number;
    users: number;
  };
  data: {
    events?: any[];
    competitions?: any[];
    editions?: any[];
    organizers?: any[];
    specialSeries?: any[];
    services?: any[];
    posts?: any[];
    users?: any[];
  };
}

export class ExportService {
  private readonly EXPORT_VERSION = '1.0.0';

  /**
   * Export all events with optional relations
   */
  async exportEvents(includeRelations = true): Promise<any[]> {
    const events = await prisma.event.findMany({
      include: includeRelations ? {
        organizer: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        competitions: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    // Convert PostGIS geometry to lat/lng
    const eventsWithCoords = await Promise.all(
      events.map(async (event) => {
        const coords = await this.getEventCoordinates(event.id);
        return {
          ...event,
          location: undefined, // Remove the raw geometry
          latitude: coords?.latitude || null,
          longitude: coords?.longitude || null,
        };
      })
    );

    return eventsWithCoords;
  }

  /**
   * Export all competitions with optional relations
   */
  async exportCompetitions(includeRelations = true): Promise<any[]> {
    const competitions = await prisma.competition.findMany({
      include: includeRelations ? {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        specialSeries: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        terrainType: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        organizer: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        editions: {
          select: {
            id: true,
            year: true,
            slug: true,
          },
        },
      } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return competitions;
  }

  /**
   * Export all editions with optional relations
   */
  async exportEditions(includeRelations = true): Promise<any[]> {
    const editions = await prisma.edition.findMany({
      include: includeRelations ? {
        competition: {
          select: {
            id: true,
            name: true,
            slug: true,
            event: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    // Convert PostGIS geometry to lat/lng
    const editionsWithCoords = await Promise.all(
      editions.map(async (edition) => {
        const coords = await this.getEditionCoordinates(edition.id);
        return {
          ...edition,
          location: undefined,
          latitude: coords?.latitude || null,
          longitude: coords?.longitude || null,
        };
      })
    );

    return editionsWithCoords;
  }

  /**
   * Export all organizers
   */
  async exportOrganizers(includeRelations = true): Promise<any[]> {
    const organizers = await prisma.organizer.findMany({
      include: includeRelations ? {
        events: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return organizers;
  }

  /**
   * Export all special series
   */
  async exportSpecialSeries(includeRelations = true): Promise<any[]> {
    const series = await prisma.specialSeries.findMany({
      include: includeRelations ? {
        competitions: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return series;
  }

  /**
   * Export all services
   */
  async exportServices(includeRelations = true): Promise<any[]> {
    const services = await prisma.service.findMany({
      include: includeRelations ? {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        organizer: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    // Convert PostGIS geometry to lat/lng
    const servicesWithCoords = await Promise.all(
      services.map(async (service) => {
        const coords = await this.getServiceCoordinates(service.id);
        return {
          ...service,
          location: undefined,
          latitude: coords?.latitude || null,
          longitude: coords?.longitude || null,
        };
      })
    );

    return servicesWithCoords;
  }

  /**
   * Export all posts
   */
  async exportPosts(includeRelations = true): Promise<any[]> {
    const posts = await prisma.post.findMany({
      include: includeRelations ? {
        author: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: true,
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        competition: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return posts;
  }

  /**
   * Export all users (excluding sensitive data like passwords)
   */
  async exportUsers(): Promise<any[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        avatar: true,
        bio: true,
        phone: true,
        city: true,
        country: true,
        language: true,
        gender: true,
        birthDate: true,
        isPublic: true,
        isInsider: true,
        instagramUrl: true,
        facebookUrl: true,
        twitterUrl: true,
        youtubeUrl: true,
        createdAt: true,
        updatedAt: true,
        // Exclude: password, refreshTokens, lastLoginAt
      },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }

  /**
   * Export a single entity type
   */
  async exportEntity(
    entityType: 'events' | 'competitions' | 'editions' | 'organizers' | 'specialSeries' | 'services' | 'posts' | 'users',
    includeRelations = true
  ): Promise<any[]> {
    switch (entityType) {
      case 'events':
        return this.exportEvents(includeRelations);
      case 'competitions':
        return this.exportCompetitions(includeRelations);
      case 'editions':
        return this.exportEditions(includeRelations);
      case 'organizers':
        return this.exportOrganizers(includeRelations);
      case 'specialSeries':
        return this.exportSpecialSeries(includeRelations);
      case 'services':
        return this.exportServices(includeRelations);
      case 'posts':
        return this.exportPosts(includeRelations);
      case 'users':
        return this.exportUsers();
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  }

  /**
   * Full export - all data for backup
   */
  async exportAll(includeRelations = true): Promise<ExportResult> {
    const [events, competitions, editions, organizers, specialSeries, services, posts, users] =
      await Promise.all([
        this.exportEvents(includeRelations),
        this.exportCompetitions(includeRelations),
        this.exportEditions(includeRelations),
        this.exportOrganizers(includeRelations),
        this.exportSpecialSeries(includeRelations),
        this.exportServices(includeRelations),
        this.exportPosts(includeRelations),
        this.exportUsers(),
      ]);

    return {
      exportedAt: new Date().toISOString(),
      version: this.EXPORT_VERSION,
      counts: {
        events: events.length,
        competitions: competitions.length,
        editions: editions.length,
        organizers: organizers.length,
        specialSeries: specialSeries.length,
        services: services.length,
        posts: posts.length,
        users: users.length,
      },
      data: {
        events,
        competitions,
        editions,
        organizers,
        specialSeries,
        services,
        posts,
        users,
      },
    };
  }

  /**
   * Get export statistics (counts only, no data)
   */
  async getExportStats(): Promise<ExportResult['counts']> {
    const [events, competitions, editions, organizers, specialSeries, services, posts, users] =
      await Promise.all([
        prisma.event.count(),
        prisma.competition.count(),
        prisma.edition.count(),
        prisma.organizer.count(),
        prisma.specialSeries.count(),
        prisma.service.count(),
        prisma.post.count(),
        prisma.user.count(),
      ]);

    return {
      events,
      competitions,
      editions,
      organizers,
      specialSeries,
      services,
      posts,
      users,
    };
  }

  // ============================================
  // HELPER METHODS - PostGIS coordinate extraction
  // ============================================

  private async getEventCoordinates(eventId: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const result = await prisma.$queryRaw<{ lat: number; lng: number }[]>`
        SELECT
          ST_Y(location::geometry) as lat,
          ST_X(location::geometry) as lng
        FROM events
        WHERE id = ${eventId} AND location IS NOT NULL
      `;

      if (result.length > 0) {
        return { latitude: result[0].lat, longitude: result[0].lng };
      }
      return null;
    } catch {
      return null;
    }
  }

  private async getEditionCoordinates(editionId: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const result = await prisma.$queryRaw<{ lat: number; lng: number }[]>`
        SELECT
          ST_Y(location::geometry) as lat,
          ST_X(location::geometry) as lng
        FROM editions
        WHERE id = ${editionId} AND location IS NOT NULL
      `;

      if (result.length > 0) {
        return { latitude: result[0].lat, longitude: result[0].lng };
      }
      return null;
    } catch {
      return null;
    }
  }

  private async getServiceCoordinates(serviceId: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const result = await prisma.$queryRaw<{ lat: number; lng: number }[]>`
        SELECT
          ST_Y(location::geometry) as lat,
          ST_X(location::geometry) as lng
        FROM services
        WHERE id = ${serviceId} AND location IS NOT NULL
      `;

      if (result.length > 0) {
        return { latitude: result[0].lat, longitude: result[0].lng };
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const exportService = new ExportService();
