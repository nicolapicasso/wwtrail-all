// Script para verificar el estado de las migraciones
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificación de Migraciones\n');
console.log('='.repeat(60));

// 1. Verificar archivos de migración
const migrationsDir = path.join(__dirname, 'prisma', 'migrations');
console.log('\n📁 Migraciones en el sistema de archivos:');

try {
  const migrations = fs.readdirSync(migrationsDir)
    .filter(f => f !== 'migration_lock.toml')
    .sort();

  migrations.forEach(migration => {
    const migrationPath = path.join(migrationsDir, migration);
    const sqlFile = path.join(migrationPath, 'migration.sql');
    const exists = fs.existsSync(sqlFile);
    const icon = exists ? '✅' : '❌';
    console.log(`   ${icon} ${migration}`);
  });

  const servicesMigration = migrations.find(m => m.includes('services'));
  if (servicesMigration) {
    console.log(`\n✅ Migración de services encontrada: ${servicesMigration}`);
  } else {
    console.log('\n❌ NO se encontró migración de services');
  }
} catch (error) {
  console.error('   Error leyendo directorio de migraciones:', error.message);
}

// 2. Verificar tabla en la base de datos
console.log('\n' + '='.repeat(60));
console.log('\n🗄️  Verificación de tabla en la base de datos:\n');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    // Intentar contar registros en la tabla services
    const count = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'services'
    `;

    if (count[0].count > 0) {
      console.log('   ✅ Tabla "services" EXISTE en la base de datos');

      // Ver cuántos registros hay
      const serviceCount = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM services
      `;
      console.log(`   📊 Registros en la tabla: ${serviceCount[0].count}`);
    } else {
      console.log('   ❌ Tabla "services" NO EXISTE en la base de datos');
      console.log('\n   📝 Solución:');
      console.log('      Ejecuta: npx prisma migrate deploy');
    }
  } catch (error) {
    console.error('   ❌ Error consultando la base de datos:', error.message);
    console.log('\n   📝 Posibles causas:');
    console.log('      - La base de datos no está corriendo');
    console.log('      - La tabla "services" no existe (ejecuta: npx prisma migrate deploy)');
    console.log('      - Hay un problema con las credenciales de conexión');
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase().then(() => {
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Verificación completa\n');
});
