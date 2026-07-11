// Script de diagnóstico para verificar el estado de Prisma
const { PrismaClient } = require('@prisma/client');

console.log('🔍 Diagnóstico de Prisma\n');
console.log('='.repeat(50));

try {
  const prisma = new PrismaClient();

  console.log('✅ PrismaClient importado correctamente\n');

  // Verificar modelos disponibles
  console.log('📋 Modelos disponibles en Prisma:');
  const models = Object.keys(prisma).filter(key =>
    !key.startsWith('_') &&
    !key.startsWith('$') &&
    typeof prisma[key] === 'object'
  );

  models.forEach(model => {
    console.log(`   - ${model}`);
  });

  console.log(`\n📊 Total de modelos: ${models.length}`);

  // Verificar específicamente el modelo Service
  if (prisma.service) {
    console.log('\n✅ Modelo "service" ENCONTRADO en Prisma');
    console.log('   prisma.service =', typeof prisma.service);
  } else {
    console.log('\n❌ Modelo "service" NO ENCONTRADO en Prisma');
    console.log('   ⚠️  PROBLEMA: Necesitas regenerar el cliente de Prisma');
    console.log('   Ejecuta: npx prisma generate');
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n📝 Pasos recomendados si falta el modelo "service":');
  console.log('   1. Ejecuta: npx prisma generate');
  console.log('   2. Reinicia el servidor (Ctrl+C y npm run dev)');
  console.log('   3. Ejecuta de nuevo este script para verificar\n');

  prisma.$disconnect();
} catch (error) {
  console.error('\n❌ ERROR al importar PrismaClient:');
  console.error(error.message);
  console.log('\n📝 Solución:');
  console.log('   1. Ejecuta: npx prisma generate');
  console.log('   2. Asegúrate de que la base de datos esté corriendo');
  console.log('   3. Ejecuta: npx prisma migrate deploy\n');
}
