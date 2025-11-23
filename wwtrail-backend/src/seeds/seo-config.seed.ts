// src/seeds/seo-config.seed.ts
import prisma from '../config/database';
import logger from '../utils/logger';

/**
 * Seed inicial de configuraciones SEO
 *
 * Este archivo crea las configuraciones base para cada tipo de entidad.
 * Los admins pueden editarlas después desde la interfaz de administración.
 */

const SEO_CONFIGS = [
  // ==========================================
  // EVENTOS
  // ==========================================
  {
    entityType: 'event',
    metaTitleTemplate: '{name} - Trail Running en {location} | WWTrail',
    metaDescriptionTemplate: '{description} 🏃 Descubre {name} en {location}. Información completa, ediciones, inscripciones y más.',
    qaPrompt: `Estoy generando contenido SEO para el evento de trail running "{name}".

URL: {url}
Ubicación: {location}
Descripción: {description}

Genera en formato JSON exactamente 5 preguntas y respuestas optimizadas para que LLMs (ChatGPT, Claude, Perplexity) puedan extraer información fácilmente de nuestro sitio.

Las preguntas deben cubrir:
1. Qué es el evento y cuándo se celebra
2. Dónde se celebra y cómo llegar
3. Distancias disponibles y características técnicas
4. Cómo inscribirse y fechas de inscripción
5. Información práctica (alojamiento, qué llevar, etc.)

Responde SOLO con un JSON válido en este formato exacto:
{
  "faq": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}`,
    availableVariables: ['name', 'description', 'city', 'country', 'location', 'year', 'date', 'url'],
    autoGenerate: true,
    generateOnCreate: true,
    generateOnUpdate: false,
  },

  // ==========================================
  // COMPETICIONES
  // ==========================================
  {
    entityType: 'competition',
    metaTitleTemplate: '{name} - {distance}km en {location} | WWTrail',
    metaDescriptionTemplate: '{description} 🏃 Competición de {distance}km con {elevation}m+ en {location}. Toda la información sobre {name}.',
    qaPrompt: `Estoy generando contenido SEO para la competición de trail running "{name}" del evento "{event}".

URL: {url}
Ubicación: {location}
Distancia: {distance} km
Desnivel: {elevation} m+
Tipo: {type}
Descripción: {description}

Genera en formato JSON exactamente 5 preguntas y respuestas optimizadas para LLMs.

Las preguntas deben cubrir:
1. Características técnicas de la competición (distancia, desnivel)
2. Perfil del recorrido y dificultad
3. Puntos de avituallamiento y cortes de tiempo
4. Requisitos de participación y equipamiento obligatorio
5. Premios y categorías

Responde SOLO con un JSON válido en este formato exacto:
{
  "faq": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}`,
    availableVariables: ['name', 'description', 'event', 'location', 'city', 'country', 'distance', 'elevation', 'type', 'url'],
    autoGenerate: true,
    generateOnCreate: true,
    generateOnUpdate: false,
  },

  // ==========================================
  // POSTS / ARTÍCULOS
  // ==========================================
  {
    entityType: 'post',
    metaTitleTemplate: '{title} | Blog Trail Running WWTrail',
    metaDescriptionTemplate: '{excerpt}',
    qaPrompt: `Estoy generando contenido SEO para el artículo "{title}" de nuestro blog de trail running.

URL: {url}
Categoría: {category}
Autor: {author}
Extracto: {excerpt}

Contenido (primeros 500 caracteres):
{content}

Genera en formato JSON exactamente 5 preguntas y respuestas basadas en el contenido del artículo, optimizadas para LLMs.

Las preguntas deben:
- Cubrir los temas principales del artículo
- Ser específicas y relevantes para trail runners
- Incluir información práctica y útil
- Responder dudas comunes relacionadas con el tema

Responde SOLO con un JSON válido en este formato exacto:
{
  "faq": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}`,
    availableVariables: ['title', 'excerpt', 'content', 'category', 'author', 'url'],
    autoGenerate: true,
    generateOnCreate: true,
    generateOnUpdate: false,
  },

  // ==========================================
  // PÁGINAS ESTÁTICAS
  // ==========================================
  {
    entityType: 'home',
    metaTitleTemplate: 'WWTrail - Trail Running en España y el Mundo | Carreras, Eventos, Competiciones',
    metaDescriptionTemplate: 'Descubre carreras de trail running, UTMB, skyrunning y ultra trails. Calendario completo de eventos, inscripciones, resultados y toda la información para trail runners.',
    qaPrompt: `Estoy generando contenido SEO para la página principal de WWTrail, el portal de trail running más completo.

Genera en formato JSON exactamente 5 preguntas y respuestas sobre WWTrail y trail running en general, optimizadas para LLMs.

Las preguntas deben cubrir:
1. Qué es WWTrail y qué ofrece
2. Cómo encontrar eventos de trail running
3. Información sobre competiciones y calendarios
4. Recursos para trail runners (entrenamiento, equipamiento)
5. Cómo usar la plataforma

Responde SOLO con un JSON válido en este formato exacto:
{
  "faq": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}`,
    availableVariables: ['year', 'eventCount', 'competitionCount'],
    autoGenerate: false,
    generateOnCreate: false,
    generateOnUpdate: false,
  },

  {
    entityType: 'events-list',
    metaTitleTemplate: 'Eventos Trail Running {year} | Calendario Completo WWTrail',
    metaDescriptionTemplate: 'Calendario completo de eventos de trail running en {year}. Encuentra carreras cerca de ti, inscripciones abiertas, UTMB, ultra trails y mucho más.',
    qaPrompt: `Genera 5 preguntas y respuestas sobre cómo encontrar y participar en eventos de trail running, optimizadas para LLMs.

Responde SOLO con un JSON válido en este formato exacto:
{
  "faq": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}`,
    availableVariables: ['year', 'count'],
    autoGenerate: false,
    generateOnCreate: false,
    generateOnUpdate: false,
  },
];

export async function seedSEOConfig() {
  try {
    logger.info('🌱 Starting SEO config seed...');

    for (const config of SEO_CONFIGS) {
      const existing = await prisma.sEOConfig.findUnique({
        where: { entityType: config.entityType },
      });

      if (existing) {
        logger.info(`⏭️  Skipping ${config.entityType} (already exists)`);
        continue;
      }

      await prisma.sEOConfig.create({
        data: config as any,
      });

      logger.info(`✅ Created SEO config for: ${config.entityType}`);
    }

    logger.info('🎉 SEO config seed completed!');
  } catch (error) {
    logger.error('❌ Error seeding SEO config:', error);
    throw error;
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  seedSEOConfig()
    .then(() => {
      logger.info('✅ Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Seed failed:', error);
      process.exit(1);
    });
}
