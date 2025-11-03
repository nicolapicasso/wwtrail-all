// prisma/seed.ts
import { PrismaClient, Language, UserRole, RaceType, EventStatus, EditionStatus, RegistrationStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed v2...\n');

  console.log('👤 Creating users...');

  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const organizerPassword = await bcrypt.hash('Organizer123!', 10);
  const athletePassword = await bcrypt.hash('Athlete123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@wwtrail.com' },
    update: {},
    create: {
      email: 'admin@wwtrail.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'WWTRAIL',
      role: UserRole.ADMIN,
      country: 'ES',
      city: 'Madrid',
      language: Language.ES,
      isActive: true,
    },
  });

  const organizer1 = await prisma.user.upsert({
    where: { email: 'maria@trailrunning.es' },
    update: {},
    create: {
      email: 'maria@trailrunning.es',
      username: 'maria_trails',
      password: organizerPassword,
      firstName: 'María',
      lastName: 'García',
      role: UserRole.ORGANIZER,
      country: 'ES',
      city: 'Barcelona',
      language: Language.ES,
      isActive: true,
    },
  });

  const organizer2 = await prisma.user.upsert({
    where: { email: 'jean@montblanc.fr' },
    update: {},
    create: {
      email: 'jean@montblanc.fr',
      username: 'jean_ultra',
      password: organizerPassword,
      firstName: 'Jean',
      lastName: 'Dubois',
      role: UserRole.ORGANIZER,
      country: 'FR',
      city: 'Chamonix',
      language: Language.FR,
      isActive: true,
    },
  });

  const athlete1 = await prisma.user.upsert({
    where: { email: 'carlos@runner.com' },
    update: {},
    create: {
      email: 'carlos@runner.com',
      username: 'carlos_runner',
      password: athletePassword,
      firstName: 'Carlos',
      lastName: 'Martínez',
      role: UserRole.ATHLETE,
      country: 'ES',
      city: 'Valencia',
      language: Language.ES,
      isActive: true,
    },
  });

  console.log('✅ 4 users created\n');

  console.log('🎯 Creating events...\n');

  const utmbEvent = await prisma.event.create({
    data: {
      name: 'UTMB Mont Blanc',
      slug: 'utmb-mont-blanc',
      description: 'El trail running más prestigioso del mundo.',
      country: 'FR',
      city: 'Chamonix',
      latitude: 45.9237,
      longitude: 6.8694,
      websiteUrl: 'https://utmb.world',
      firstEditionYear: 2003,
      isActive: true,
      isHighlighted: true,
      status: EventStatus.PUBLISHED,
      organizerId: organizer2.id,
    },
  });
  console.log(`  ✅ Event: ${utmbEvent.name}`);

  const transgrancEvent = await prisma.event.create({
    data: {
      name: 'Transgrancanaria',
      slug: 'transgrancanaria',
      description: 'La travesía épica de Gran Canaria.',
      country: 'ES',
      city: 'Las Palmas',
      latitude: 28.1248,
      longitude: -15.4302,
      firstEditionYear: 2003,
      isActive: true,
      isHighlighted: true,
      status: EventStatus.PUBLISHED,
      organizerId: organizer1.id,
    },
  });
  console.log(`  ✅ Event: ${transgrancEvent.name}\n`);

  console.log('🏃 Creating competitions...\n');

  const utmb171 = await prisma.competition.create({
    data: {
      eventId: utmbEvent.id,
      name: 'UTMB 171K',
      shortName: 'UTMB',
      slug: 'utmb-171k',
      type: RaceType.ULTRA,
      baseDistance: 171,
      baseElevation: 10000,
      baseMaxParticipants: 2500,
      displayOrder: 1,
      isActive: true,
    },
  });
  console.log(`    ✅ Competition: ${utmb171.name}`);

  const ccc101 = await prisma.competition.create({
    data: {
      eventId: utmbEvent.id,
      name: 'CCC 101K',
      shortName: 'CCC',
      slug: 'ccc-101k',
      type: RaceType.ULTRA,
      baseDistance: 101,
      baseElevation: 6100,
      displayOrder: 2,
      isActive: true,
    },
  });
  console.log(`    ✅ Competition: ${ccc101.name}\n`);

  const tg125 = await prisma.competition.create({
    data: {
      eventId: transgrancEvent.id,
      name: 'Transgrancanaria 125K',
      slug: 'transgrancanaria-125k',
      type: RaceType.ULTRA,
      baseDistance: 125,
      baseElevation: 7500,
      displayOrder: 1,
      isActive: true,
    },
  });
  console.log(`    ✅ Competition: ${tg125.name}\n`);

  console.log('📅 Creating editions...\n');

  const utmb2025 = await prisma.edition.create({
    data: {
      competitionId: utmb171.id,
      year: 2025,
      slug: 'utmb-171k-2025',
      startDate: new Date('2025-08-29T17:00:00Z'),
      price: 350,
      registrationStatus: RegistrationStatus.OPEN,
      status: EditionStatus.UPCOMING,
      maxParticipants: 2500,
      currentParticipants: 1850,
    },
  });
  console.log(`      ✅ Edition: UTMB 171K 2025`);

  const utmb2023 = await prisma.edition.create({
    data: {
      competitionId: utmb171.id,
      year: 2023,
      slug: 'utmb-171k-2023',
      startDate: new Date('2023-08-28T17:00:00Z'),
      status: EditionStatus.FINISHED,
      distance: 171,
      elevation: 10000,
      finishers: 1987,
      winnerTime: '19:37:43',
    },
  });
  console.log(`      ✅ Edition: UTMB 171K 2023 (histórica)\n`);

  await prisma.edition.create({
    data: {
      competitionId: ccc101.id,
      year: 2025,
      slug: 'ccc-101k-2025',
      startDate: new Date('2025-08-30T06:00:00Z'),
      status: EditionStatus.UPCOMING,
    },
  });
  console.log(`      ✅ Edition: CCC 101K 2025\n`);

  await prisma.edition.create({
    data: {
      competitionId: tg125.id,
      year: 2025,
      slug: 'transgrancanaria-125k-2025',
      startDate: new Date('2025-02-28T22:00:00Z'),
      status: EditionStatus.REGISTRATION_CLOSED,
    },
  });
  console.log(`      ✅ Edition: TG 125K 2025\n`);

  console.log('⭐ Creating user tracking...\n');

  await prisma.userEdition.create({
    data: {
      userId: athlete1.id,
      editionId: utmb2023.id,
      status: 'COMPLETED',
      position: 487,
      time: '32:15:43',
      notes: '¡Increíble experiencia!',
      rating: 5,
    },
  });
  console.log(`    ✅ Carlos completed UTMB 2023\n`);

  console.log('💬 Creating reviews...\n');

  await prisma.review.create({
    data: {
      editionId: utmb2023.id,
      userId: athlete1.id,
      rating: 5,
      comment: '¡Increíble experiencia! La mejor carrera.',
      isVerified: true,
    },
  });
  console.log(`    ✅ Review for UTMB 2023\n`);

  console.log('\n🎉 SEED COMPLETED!\n');
  console.log('Users: 4');
  console.log('Events: 2');
  console.log('Competitions: 3');
  console.log('Editions: 4');
  console.log('User tracking: 1');
  console.log('Reviews: 1\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });