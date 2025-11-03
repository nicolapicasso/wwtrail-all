import { PrismaClient, UserRole, CompetitionType, Language, CompetitionStatus, RegistrationStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Crear usuarios de prueba
  console.log('📝 Creating users...');

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wwtrail.com' },
    update: {},
    create: {
      email: 'admin@wwtrail.com',
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'WWTRAIL',
      role: UserRole.ADMIN,
      language: Language.ES,
      country: 'ES',
      city: 'Madrid',
      isActive: true,
      isVerified: true,
    },
  });

  const organizerPassword = await bcrypt.hash('Organizer123!', 10);
  const organizer1 = await prisma.user.upsert({
    where: { email: 'maria@trailrunning.es' },
    update: {},
    create: {
      email: 'maria@trailrunning.es',
      username: 'maria_trails',
      password: organizerPassword,
      firstName: 'María',
      lastName: 'González',
      role: UserRole.ORGANIZER,
      language: Language.ES,
      country: 'ES',
      city: 'Barcelona',
      isActive: true,
      isVerified: true,
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
      lastName: 'Dupont',
      role: UserRole.ORGANIZER,
      language: Language.FR,
      country: 'FR',
      city: 'Chamonix',
      isActive: true,
      isVerified: true,
    },
  });

  const athletePassword = await bcrypt.hash('Athlete123!', 10);
  const athletes = await Promise.all([
    prisma.user.upsert({
      where: { email: 'carlos@runner.com' },
      update: {},
      create: {
        email: 'carlos@runner.com',
        username: 'carlos_runner',
        password: athletePassword,
        firstName: 'Carlos',
        lastName: 'Martínez',
        role: UserRole.ATHLETE,
        language: Language.ES,
        country: 'ES',
        city: 'Valencia',
        isActive: true,
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'laura@trail.com' },
      update: {},
      create: {
        email: 'laura@trail.com',
        username: 'laura_trail',
        password: athletePassword,
        firstName: 'Laura',
        lastName: 'Rodríguez',
        role: UserRole.ATHLETE,
        language: Language.ES,
        country: 'ES',
        city: 'Zaragoza',
        isActive: true,
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'marco@runner.it' },
      update: {},
      create: {
        email: 'marco@runner.it',
        username: 'marco_rossi',
        password: athletePassword,
        firstName: 'Marco',
        lastName: 'Rossi',
        role: UserRole.ATHLETE,
        language: Language.IT,
        country: 'IT',
        city: 'Milano',
        isActive: true,
        isVerified: true,
      },
    }),
  ]);

  console.log(`✅ ${3 + athletes.length} users created`);

  // 2. Crear competiciones de prueba
  console.log('🏃 Creating competitions...');

  const competitions = await Promise.all([
    // Ultra Trail Mont Blanc
    prisma.competition.create({
      data: {
        slug: 'ultra-trail-mont-blanc-2025',
        name: 'Ultra Trail Mont Blanc 2025',
        description: 'La carrera de ultra trail más prestigiosa del mundo. Un recorrido épico alrededor del macizo del Mont Blanc atravesando Francia, Italia y Suiza.',
        type: CompetitionType.ULTRA,
        status: CompetitionStatus.PUBLISHED,
        startDate: new Date('2025-08-29'),
        endDate: new Date('2025-09-03'),
        country: 'FR',
        region: 'Haute-Savoie',
        city: 'Chamonix',
        distance: 171,
        elevation: 10000,
        website: 'https://utmbmontblanc.com',
        email: 'info@utmb.com',
        registrationStatus: RegistrationStatus.OPEN,
        registrationUrl: 'https://utmbmontblanc.com/register',
        registrationStart: new Date('2024-12-15'),
        registrationEnd: new Date('2025-02-28'),
        maxParticipants: 2500,
        currentParticipants: 1850,
        organizerId: organizer2.id,
        isHighlighted: true,
        viewCount: 15420,
      },
    }),
    // Transgrancanaria
    prisma.competition.create({
      data: {
        slug: 'transgrancanaria-2025',
        name: 'Transgrancanaria 2025',
        description: 'Una travesía única por la isla de Gran Canaria. Trail running en estado puro con paisajes volcánicos increíbles.',
        type: CompetitionType.TRAIL,
        status: CompetitionStatus.PUBLISHED,
        startDate: new Date('2025-02-28'),
        endDate: new Date('2025-03-02'),
        country: 'ES',
        region: 'Canarias',
        city: 'Las Palmas de Gran Canaria',
        distance: 125,
        elevation: 7500,
        website: 'https://transgrancanaria.net',
        email: 'info@transgrancanaria.net',
        registrationStatus: RegistrationStatus.FULL,
        maxParticipants: 1800,
        currentParticipants: 1800,
        organizerId: organizer1.id,
        isHighlighted: true,
        viewCount: 8930,
      },
    }),
    // Dolomites Skyrace
    prisma.competition.create({
      data: {
        slug: 'dolomites-skyrace-2025',
        name: 'Dolomites Skyrace 2025',
        description: 'Carrera vertical extrema en los Dolomitas italianos. Un desafío para corredores experimentados con vistas impresionantes.',
        type: CompetitionType.VERTICAL,
        status: CompetitionStatus.PUBLISHED,
        startDate: new Date('2025-07-15'),
        country: 'IT',
        region: 'Trentino-Alto Adige',
        city: 'Canazei',
        distance: 22,
        elevation: 4200,
        website: 'https://dolomitesskyrace.com',
        registrationStatus: RegistrationStatus.COMING_SOON,
        registrationStart: new Date('2025-03-01'),
        maxParticipants: 500,
        organizerId: organizer1.id,
        isHighlighted: true,
        viewCount: 5620,
      },
    }),
    // Trail Barcelona
    prisma.competition.create({
      data: {
        slug: 'trail-barcelona-collserola-2025',
        name: 'Trail Barcelona Collserola 2025',
        description: 'Trail urbano por el Parque Natural de Collserola con vistas espectaculares a Barcelona y el Mediterráneo.',
        type: CompetitionType.TRAIL,
        status: CompetitionStatus.PUBLISHED,
        startDate: new Date('2025-04-20'),
        country: 'ES',
        region: 'Cataluña',
        city: 'Barcelona',
        distance: 28,
        elevation: 1200,
        website: 'https://trailbarcelona.com',
        registrationStatus: RegistrationStatus.OPEN,
        registrationUrl: 'https://trailbarcelona.com/inscripciones',
        registrationStart: new Date('2025-01-10'),
        registrationEnd: new Date('2025-04-15'),
        maxParticipants: 800,
        currentParticipants: 456,
        organizerId: organizer1.id,
        viewCount: 3240,
      },
    }),
    // Picos de Europa
    prisma.competition.create({
      data: {
        slug: 'picos-de-europa-trail-2025',
        name: 'Picos de Europa Trail 2025',
        description: 'Trail running en el corazón de los Picos de Europa. Naturaleza salvaje y montañas impresionantes.',
        type: CompetitionType.TRAIL,
        status: CompetitionStatus.DRAFT,
        startDate: new Date('2025-09-14'),
        country: 'ES',
        region: 'Asturias',
        city: 'Cangas de Onís',
        distance: 42,
        elevation: 2800,
        registrationStatus: RegistrationStatus.COMING_SOON,
        maxParticipants: 600,
        organizerId: organizer1.id,
        viewCount: 890,
      },
    }),
    // Pirineos Trail
    prisma.competition.create({
      data: {
        slug: 'pirineos-trail-ordesa-2025',
        name: 'Pirineos Trail Ordesa 2025',
        description: 'Carrera por el Parque Nacional de Ordesa y Monte Perdido. Uno de los escenarios más bellos de Europa.',
        type: CompetitionType.TRAIL,
        status: CompetitionStatus.PUBLISHED,
        startDate: new Date('2025-06-08'),
        country: 'ES',
        region: 'Aragón',
        city: 'Torla',
        distance: 35,
        elevation: 2100,
        registrationStatus: RegistrationStatus.OPEN,
        registrationUrl: 'https://pirinesairstrail.com',
        maxParticipants: 400,
        currentParticipants: 287,
        organizerId: organizer1.id,
        viewCount: 2145,
      },
    }),
    // Camino de Santiago Trail
    prisma.competition.create({
      data: {
        slug: 'camino-santiago-trail-2025',
        name: 'Camino de Santiago Trail 2025',
        description: 'Trail inspirado en el Camino de Santiago. Historia, cultura y naturaleza en cada kilómetro.',
        type: CompetitionType.TRAIL,
        status: CompetitionStatus.PUBLISHED,
        startDate: new Date('2025-05-18'),
        country: 'ES',
        region: 'Galicia',
        city: 'Santiago de Compostela',
        distance: 50,
        elevation: 1800,
        website: 'https://caminotrail.com',
        registrationStatus: RegistrationStatus.OPEN,
        maxParticipants: 1000,
        currentParticipants: 654,
        organizerId: organizer1.id,
        isHighlighted: false,
        viewCount: 4567,
      },
    }),
    // Skyrunning Catalonia
    prisma.competition.create({
      data: {
        slug: 'skyrunning-catalonia-2025',
        name: 'Skyrunning Catalonia 2025',
        description: 'Carrera de skyrunning técnica en los Pirineos catalanes. Para corredores experimentados.',
        type: CompetitionType.SKYRUNNING,
        status: CompetitionStatus.PUBLISHED,
        startDate: new Date('2025-07-26'),
        country: 'ES',
        region: 'Cataluña',
        city: 'La Cerdanya',
        distance: 32,
        elevation: 3200,
        registrationStatus: RegistrationStatus.OPEN,
        maxParticipants: 350,
        currentParticipants: 198,
        organizerId: organizer1.id,
        viewCount: 1876,
      },
    }),
  ]);

  console.log(`✅ ${competitions.length} competitions created`);

  // 3. Crear traducciones
  console.log('🌍 Creating translations...');

  const translations = [
    // UTMB translations
    {
      competitionId: competitions[0].id,
      language: Language.EN,
      name: 'Ultra Trail Mont Blanc 2025',
      description: 'The most prestigious ultra trail race in the world. An epic route around the Mont Blanc massif crossing France, Italy and Switzerland.',
      status: 'APPROVED' as any,
    },
    {
      competitionId: competitions[0].id,
      language: Language.IT,
      name: 'Ultra Trail Mont Blanc 2025',
      description: 'La gara di ultra trail più prestigiosa al mondo. Un percorso epico intorno al massiccio del Monte Bianco attraversando Francia, Italia e Svizzera.',
      status: 'APPROVED' as any,
    },
    // Transgrancanaria translations
    {
      competitionId: competitions[1].id,
      language: Language.EN,
      name: 'Transgrancanaria 2025',
      description: 'A unique crossing of Gran Canaria island. Pure trail running with incredible volcanic landscapes.',
      status: 'APPROVED' as any,
    },
    {
      competitionId: competitions[1].id,
      language: Language.DE,
      name: 'Transgrancanaria 2025',
      description: 'Eine einzigartige Durchquerung der Insel Gran Canaria. Pures Trailrunning mit unglaublichen vulkanischen Landschaften.',
      status: 'PENDING' as any,
    },
    // Barcelona translation
    {
      competitionId: competitions[3].id,
      language: Language.EN,
      name: 'Trail Barcelona Collserola 2025',
      description: 'Urban trail through Collserola Natural Park with spectacular views of Barcelona and the Mediterranean.',
      status: 'APPROVED' as any,
    },
    {
      competitionId: competitions[3].id,
      language: Language.CA,
      name: 'Trail Barcelona Collserola 2025',
      description: 'Trail urbà pel Parc Natural de Collserola amb vistes espectaculars a Barcelona i la Mediterrània.',
      status: 'APPROVED' as any,
    },
  ];

  await prisma.competitionTranslation.createMany({ data: translations });
  console.log(`✅ ${translations.length} translations created`);

  // 4. Crear categorías
  console.log('📂 Creating categories...');

  const categories = await Promise.all([
    // UTMB categories
    prisma.category.create({
      data: {
        competitionId: competitions[0].id,
        name: 'UTMB (171km)',
        distance: 171,
        elevation: 10000,
        price: 350,
        maxParticipants: 2500,
      },
    }),
    prisma.category.create({
      data: {
        competitionId: competitions[0].id,
        name: 'CCC (101km)',
        distance: 101,
        elevation: 6100,
        price: 250,
        maxParticipants: 1500,
      },
    }),
    prisma.category.create({
      data: {
        competitionId: competitions[0].id,
        name: 'OCC (56km)',
        distance: 56,
        elevation: 3500,
        price: 150,
        maxParticipants: 1000,
      },
    }),
    // Transgrancanaria categories
    prisma.category.create({
      data: {
        competitionId: competitions[1].id,
        name: 'Transgrancanaria 125km',
        distance: 125,
        elevation: 7500,
        price: 180,
        maxParticipants: 1200,
      },
    }),
    prisma.category.create({
      data: {
        competitionId: competitions[1].id,
        name: 'Transgrancanaria 64km',
        distance: 64,
        elevation: 3800,
        price: 120,
        maxParticipants: 600,
      },
    }),
  ]);

  console.log(`✅ ${categories.length} categories created`);

  // 5. Crear reviews
  console.log('⭐ Creating reviews...');

  await prisma.review.createMany({
    data: [
      {
        competitionId: competitions[0].id,
        userId: athletes[0].id,
        rating: 5,
        comment: '¡Increíble experiencia! La organización fue impecable y el recorrido espectacular.',
      },
      {
        competitionId: competitions[0].id,
        userId: athletes[1].id,
        rating: 5,
        comment: 'Sin duda la mejor carrera en la que he participado. Volveré el año que viene.',
      },
      {
        competitionId: competitions[1].id,
        userId: athletes[0].id,
        rating: 4,
        comment: 'Muy buena carrera, paisajes increíbles. Solo mejoraría algunos avituallamientos.',
      },
      {
        competitionId: competitions[3].id,
        userId: athletes[2].id,
        rating: 5,
        comment: 'Perfetto! Great organization and beautiful views of Barcelona.',
      },
    ],
  });

  console.log('✅ 4 reviews created');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 SUMMARY:');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✅ Users: ${3 + athletes.length}`);
  console.log(`✅ Competitions: ${competitions.length}`);
  console.log(`✅ Translations: ${translations.length}`);
  console.log(`✅ Categories: ${categories.length}`);
  console.log(`✅ Reviews: 4`);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('👤 TEST USERS:');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔑 ADMIN:');
  console.log('   Email:    admin@wwtrail.com');
  console.log('   Password: Admin123!');
  console.log('');
  console.log('🔑 ORGANIZER 1 (España):');
  console.log('   Email:    maria@trailrunning.es');
  console.log('   Password: Organizer123!');
  console.log('');
  console.log('🔑 ORGANIZER 2 (France):');
  console.log('   Email:    jean@montblanc.fr');
  console.log('   Password: Organizer123!');
  console.log('');
  console.log('🔑 ATHLETE 1:');
  console.log('   Email:    carlos@runner.com');
  console.log('   Password: Athlete123!');
  console.log('');
  console.log('🔑 ATHLETE 2:');
  console.log('   Email:    laura@trail.com');
  console.log('   Password: Athlete123!');
  console.log('');
  console.log('🔑 ATHLETE 3 (Italy):');
  console.log('   Email:    marco@runner.it');
  console.log('   Password: Athlete123!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('🚀 You can now start the API with: npm run dev');
  console.log('📖 API Docs: http://localhost:3001/api/v1');
  console.log('💚 Health: http://localhost:3001/health');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
