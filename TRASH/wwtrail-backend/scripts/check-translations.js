// Script para verificar traducciones de eventos
// Ejecutar con: node scripts/check-translations.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTranslations() {
  try {
    console.log('🔍 Verificando últimos eventos creados...\n');

    // Obtener los últimos 5 eventos
    const events = await prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        language: true,
        status: true,
        createdAt: true,
        translations: {
          select: {
            id: true,
            language: true,
            name: true,
          },
        },
      },
    });

    if (events.length === 0) {
      console.log('❌ No hay eventos en la base de datos');
      return;
    }

    console.log(`📊 Encontrados ${events.length} eventos:\n`);

    events.forEach((event, index) => {
      console.log(`${index + 1}. "${event.name}"`);
      console.log(`   ID: ${event.id}`);
      console.log(`   Idioma original: ${event.language || 'NO DEFINIDO ⚠️'}`);
      console.log(`   Estado: ${event.status}`);
      console.log(`   Creado: ${event.createdAt.toLocaleString()}`);
      console.log(`   Traducciones: ${event.translations.length}`);

      if (event.translations.length > 0) {
        console.log(`   Idiomas traducidos: ${event.translations.map(t => t.language).join(', ')}`);
      } else {
        console.log(`   ⚠️  NO HAY TRADUCCIONES`);
      }
      console.log('');
    });

    // Verificar configuración
    console.log('📋 Configuración de traducciones:');
    console.log(`   AUTO_TRANSLATE_ENABLED: ${process.env.AUTO_TRANSLATE_ENABLED || 'no definido'}`);
    console.log(`   AUTO_TRANSLATE_ONLY_PUBLISHED: ${process.env.AUTO_TRANSLATE_ONLY_PUBLISHED || 'no definido'}`);
    console.log(`   AUTO_TRANSLATE_BACKGROUND: ${process.env.AUTO_TRANSLATE_BACKGROUND || 'no definido'}`);
    console.log(`   OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'Configurada ✅' : 'NO configurada ❌'}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTranslations();
