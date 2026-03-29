/**
 * Export script to dump all data from a local PostgreSQL database.
 *
 * Usage:
 *   DATABASE_URL="postgresql://user:pass@localhost:5432/dbname" npx tsx scripts/export-local.ts
 *
 * Or if you have a .env file with DATABASE_URL:
 *   npx tsx scripts/export-local.ts
 *
 * Output: wwtrail-export-YYYY-MM-DD.json in the current directory
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function getCoordinates(table: string, id: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const result = await prisma.$queryRawUnsafe<{ lat: number; lng: number }[]>(
      `SELECT ST_Y(location::geometry) as lat, ST_X(location::geometry) as lng FROM "${table}" WHERE id = $1 AND location IS NOT NULL`,
      id
    );
    if (result.length > 0) {
      return { latitude: result[0].lat, longitude: result[0].lng };
    }
    return null;
  } catch {
    return null;
  }
}

async function exportAll() {
  console.log('==> Starting full database export...');
  console.log(`    Database: ${process.env.DATABASE_URL?.replace(/\/\/.*@/, '//*****@')}`);

  // Users (without passwords)
  console.log('  Exporting users...');
  const users = await prisma.user.findMany({
    select: {
      id: true, email: true, username: true, firstName: true, lastName: true,
      role: true, isActive: true, avatar: true, bio: true, phone: true,
      city: true, country: true, language: true, gender: true, birthDate: true,
      isPublic: true, isInsider: true,
      instagramUrl: true, facebookUrl: true, twitterUrl: true, youtubeUrl: true,
      createdAt: true, updatedAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });
  console.log(`    Found ${users.length} users`);

  // Organizers
  console.log('  Exporting organizers...');
  const organizers = await prisma.organizer.findMany({
    include: {
      events: { select: { id: true, name: true, slug: true } },
      createdBy: { select: { id: true, email: true, username: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
  console.log(`    Found ${organizers.length} organizers`);

  // Special Series
  console.log('  Exporting special series...');
  const specialSeries = await prisma.specialSeries.findMany({
    include: {
      competitions: { select: { id: true, name: true, slug: true } },
      createdBy: { select: { id: true, email: true, username: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
  console.log(`    Found ${specialSeries.length} special series`);

  // Terrain Types
  console.log('  Exporting terrain types...');
  const terrainTypes = await prisma.terrainType.findMany({
    orderBy: { name: 'asc' },
  });
  console.log(`    Found ${terrainTypes.length} terrain types`);

  // Events
  console.log('  Exporting events...');
  const events = await prisma.event.findMany({
    include: {
      organizer: { select: { id: true, name: true, slug: true } },
      competitions: { select: { id: true, name: true, slug: true } },
      user: { select: { id: true, email: true, username: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
  const eventsWithCoords = await Promise.all(
    events.map(async (event) => {
      const coords = await getCoordinates('events', event.id);
      return { ...event, location: undefined, latitude: coords?.latitude || null, longitude: coords?.longitude || null };
    })
  );
  console.log(`    Found ${events.length} events`);

  // Competitions
  console.log('  Exporting competitions...');
  const competitions = await prisma.competition.findMany({
    include: {
      event: { select: { id: true, name: true, slug: true } },
      specialSeries: { select: { id: true, name: true, slug: true } },
      terrainType: { select: { id: true, name: true, slug: true } },
      organizer: { select: { id: true, email: true, username: true } },
      editions: { select: { id: true, year: true, slug: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
  console.log(`    Found ${competitions.length} competitions`);

  // Editions
  console.log('  Exporting editions...');
  const editions = await prisma.edition.findMany({
    include: {
      competition: {
        select: {
          id: true, name: true, slug: true,
          event: { select: { id: true, name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
  const editionsWithCoords = await Promise.all(
    editions.map(async (edition) => {
      const coords = await getCoordinates('editions', edition.id);
      return { ...edition, location: undefined, latitude: coords?.latitude || null, longitude: coords?.longitude || null };
    })
  );
  console.log(`    Found ${editions.length} editions`);

  // Services
  console.log('  Exporting services...');
  let services: any[] = [];
  try {
    services = await prisma.service.findMany({
      orderBy: { createdAt: 'asc' },
    });
    const servicesWithCoords = await Promise.all(
      services.map(async (service: any) => {
        const coords = await getCoordinates('services', service.id);
        return { ...service, location: undefined, latitude: coords?.latitude || null, longitude: coords?.longitude || null };
      })
    );
    services = servicesWithCoords;
  } catch {
    console.log('    (services table not available, skipping)');
  }
  console.log(`    Found ${services.length} services`);

  // Posts
  console.log('  Exporting posts...');
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, email: true, username: true } },
        tags: { select: { id: true, name: true, slug: true } },
        images: true,
        event: { select: { id: true, name: true, slug: true } },
        competition: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  } catch {
    console.log('    (posts table not available, skipping)');
  }
  console.log(`    Found ${posts.length} posts`);

  // Home configuration
  console.log('  Exporting home configuration...');
  let homeConfig: any = null;
  try {
    homeConfig = await prisma.homeConfiguration.findFirst({
      where: { isActive: true },
      include: { blocks: { orderBy: { order: 'asc' } } },
    });
  } catch {
    console.log('    (home configuration table not available, skipping)');
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    counts: {
      users: users.length,
      organizers: organizers.length,
      specialSeries: specialSeries.length,
      terrainTypes: terrainTypes.length,
      events: eventsWithCoords.length,
      competitions: competitions.length,
      editions: editionsWithCoords.length,
      services: services.length,
      posts: posts.length,
    },
    data: {
      users,
      organizers,
      specialSeries,
      terrainTypes,
      events: eventsWithCoords,
      competitions,
      editions: editionsWithCoords,
      services,
      posts,
      homeConfig,
    },
  };

  const filename = `wwtrail-export-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));

  console.log('\n==> Export complete!');
  console.log(`    File: ${filename}`);
  console.log(`    Size: ${(fs.statSync(filename).size / 1024).toFixed(1)} KB`);
  console.log('\n    Counts:');
  Object.entries(exportData.counts).forEach(([key, value]) => {
    console.log(`      ${key}: ${value}`);
  });
}

exportAll()
  .catch((error) => {
    console.error('Export failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
