# WWTRAIL - Instrucciones de Importación (Fase 1)

## Resumen

Primera fase de importación: **Organizadores, Series, Events y Competitions**.

Los datos ya han sido extraídos de WordPress y transformados con las siguientes correcciones:
- ITRA points mapeados de IDs a valores reales (0-6)
- Terreno mapeado a un único valor de lista predefinida
- Instagram URLs construidas correctamente
- Descripciones en texto plano (HTML eliminado)
- Idioma detectado automáticamente (ES, IT, EN, FR, DE)
- Códigos de país ISO (ES, IT, FR, etc.)

## Archivos Disponibles

| Archivo | Registros | Descripción |
|---------|-----------|-------------|
| `organizers.json` | 45 | Organizadores de eventos |
| `series.json` | 25 | Series especiales (UTMB, ITRA, etc.) |
| `events.json` | 359 | Eventos (agrupación de competiciones) |
| `competitions.json` | 464 | Competiciones individuales |
| `id_maps.json` | - | Mapeo IDs WordPress → UUIDs |
| `summary.json` | - | Resumen de la exportación |

---

## Orden de Importación

1. **Organizers** (sin dependencias)
2. **Series** (sin dependencias)
3. **Events** (sin dependencias)
4. **Competitions** (depende de Events, referencia Organizers y Series)

---

## Estructura de los Datos

### 1. Organizers (`organizers.json`)

```typescript
interface ImportOrganizer {
  id: string;      // UUID generado
  slug: string;    // Slug único (ej: "a-s-d-doppiaw")
  name: string;    // Nombre completo (ej: "A.S.D. DoppiaW")
}
```

**Mapeo a Prisma:**
```prisma
model Organizer {
  id   String @id @default(uuid())
  slug String @unique
  name String
}
```

### 2. Series (`series.json`)

```typescript
interface ImportSeries {
  id: string;      // UUID generado
  slug: string;    // Slug único (ej: "utmb-index-100k")
  name: string;    // Nombre completo (ej: "UTMB Index 100K")
}
```

**Mapeo a Prisma:**
```prisma
model SpecialSeries {
  id   String @id @default(uuid())
  slug String @unique
  name String
}
```

### 3. Events (`events.json`)

```typescript
interface ImportEvent {
  id: string;              // UUID generado
  wp_grupo?: string;       // Slug del grupo WordPress (si existe)
  wp_id?: number;          // ID WordPress (si no hay grupo)
  name: string;            // Nombre del evento
  slug: string;            // Slug URL
  country: string | null;  // Código ISO: ES, IT, FR, DE, etc.
  city: string;            // Ciudad
  latitude: number | null;
  longitude: number | null;
  website: string;         // URL completa
  phone: string;
  email: string;
  instagram: string;       // URL completa: https://www.instagram.com/usuario
  facebook: string;        // URL completa
  typicalMonth: number | null;  // 1-12
  status: 'PUBLISHED' | 'DRAFT';
}
```

**Notas:**
- Si `latitude` y `longitude` no son null → crear punto PostGIS
- `country` ya es código ISO (ES, IT, FR, etc.)
- `instagram` ya es URL completa

### 4. Competitions (`competitions.json`)

```typescript
interface ImportCompetition {
  id: string;              // UUID generado
  wp_id: number;           // ID WordPress original
  eventId: string;         // UUID del Event padre
  name: string;            // Nombre
  slug: string;            // Slug URL
  description: string;     // Texto plano (sin HTML)
  baseDistance: number | null;    // km
  baseElevation: number | null;   // m+
  itraPoints: number | null;      // 0-6 (ya mapeado)
  terrainType: string | null;     // Valor de lista predefinida
  series: string[];               // Array de slugs de series
  organizerSlug: string | null;   // Slug del organizador
  featured: boolean;
  status: 'PUBLISHED' | 'DRAFT';
  language: string;               // ES, IT, EN, FR, DE
}
```

**Valores válidos de `terrainType`:**
- `Alta montaña`
- `Pista de tierra`
- `Bosques y senderos`
- `Terreno muy técnico`
- `Selva/Jungla`
- `Grandes lagos`
- `Llanuras`
- `Desiertos`
- `Costa y playa`
- `Terreno mixto`

**Distribución de terrenos en datos:**
- Alta montaña: 193
- Bosques y senderos: 44
- Terreno muy técnico: 12
- Costa y playa: 4
- Grandes lagos: 3
- Sin asignar: 208

**Distribución de idiomas:**
- ES: 319
- EN: 83
- IT: 53
- FR: 7
- DE: 2

---

## Implementación del Importador

### Estructura Sugerida

```
src/
├── import/
│   ├── importService.ts       # Servicio principal
│   ├── importController.ts    # Endpoints API
│   └── schemas/
│       ├── organizerSchema.ts
│       ├── seriesSchema.ts
│       ├── eventSchema.ts
│       └── competitionSchema.ts
├── routes/
│   └── v2/
│       └── admin/
│           └── import.routes.ts
```

### Endpoints Sugeridos

```typescript
// POST /api/v2/admin/import/organizers
// Body: ImportOrganizer[]

// POST /api/v2/admin/import/series
// Body: ImportSeries[]

// POST /api/v2/admin/import/events
// Body: ImportEvent[]

// POST /api/v2/admin/import/competitions
// Body: ImportCompetition[]

// POST /api/v2/admin/import/full
// Body: { organizers, series, events, competitions }
// Importa todo en orden correcto
```

### Validación con Zod

```typescript
import { z } from 'zod';

export const importOrganizerSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1)
});

export const importSeriesSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1)
});

export const importEventSchema = z.object({
  id: z.string().uuid(),
  wp_grupo: z.string().optional(),
  wp_id: z.number().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  country: z.string().length(2).nullable(),
  city: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  website: z.string(),
  phone: z.string(),
  email: z.string(),
  instagram: z.string(),
  facebook: z.string(),
  typicalMonth: z.number().min(1).max(12).nullable(),
  status: z.enum(['PUBLISHED', 'DRAFT'])
});

export const importCompetitionSchema = z.object({
  id: z.string().uuid(),
  wp_id: z.number(),
  eventId: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  baseDistance: z.number().nullable(),
  baseElevation: z.number().nullable(),
  itraPoints: z.number().min(0).max(6).nullable(),
  terrainType: z.string().nullable(),
  series: z.array(z.string()),
  organizerSlug: z.string().nullable(),
  featured: z.boolean(),
  status: z.enum(['PUBLISHED', 'DRAFT']),
  language: z.enum(['ES', 'IT', 'EN', 'FR', 'DE', 'CA'])
});
```

### Ejemplo de Servicio de Importación

```typescript
// src/import/importService.ts
import { prisma } from '../lib/prisma';

export class ImportService {
  
  async importOrganizers(data: ImportOrganizer[]) {
    const results = { created: 0, skipped: 0, errors: [] };
    
    for (const org of data) {
      try {
        // Verificar si existe
        const existing = await prisma.organizer.findUnique({
          where: { slug: org.slug }
        });
        
        if (existing) {
          results.skipped++;
          continue;
        }
        
        await prisma.organizer.create({
          data: {
            id: org.id,
            slug: org.slug,
            name: org.name
          }
        });
        results.created++;
      } catch (error) {
        results.errors.push({ slug: org.slug, error: error.message });
      }
    }
    
    return results;
  }
  
  async importEvents(data: ImportEvent[]) {
    const results = { created: 0, skipped: 0, errors: [] };
    
    for (const event of data) {
      try {
        const existing = await prisma.event.findUnique({
          where: { slug: event.slug }
        });
        
        if (existing) {
          results.skipped++;
          continue;
        }
        
        // Crear punto PostGIS si hay coordenadas
        let locationQuery = null;
        if (event.latitude && event.longitude) {
          locationQuery = prisma.$queryRaw`
            ST_SetSRID(ST_MakePoint(${event.longitude}, ${event.latitude}), 4326)
          `;
        }
        
        await prisma.event.create({
          data: {
            id: event.id,
            name: event.name,
            slug: event.slug,
            country: event.country,
            city: event.city,
            website: event.website,
            phone: event.phone,
            email: event.email,
            instagram: event.instagram,
            facebook: event.facebook,
            typicalMonth: event.typicalMonth,
            status: event.status,
            // location se maneja por separado con raw query
          }
        });
        
        // Actualizar location si hay coordenadas
        if (event.latitude && event.longitude) {
          await prisma.$executeRaw`
            UPDATE "Event" 
            SET location = ST_SetSRID(ST_MakePoint(${event.longitude}, ${event.latitude}), 4326)
            WHERE id = ${event.id}
          `;
        }
        
        results.created++;
      } catch (error) {
        results.errors.push({ slug: event.slug, error: error.message });
      }
    }
    
    return results;
  }
  
  async importCompetitions(data: ImportCompetition[]) {
    const results = { created: 0, skipped: 0, errors: [] };
    
    for (const comp of data) {
      try {
        const existing = await prisma.competition.findFirst({
          where: { 
            OR: [
              { slug: comp.slug },
              { id: comp.id }
            ]
          }
        });
        
        if (existing) {
          results.skipped++;
          continue;
        }
        
        // Buscar organizador por slug
        let organizerId = null;
        if (comp.organizerSlug) {
          const org = await prisma.organizer.findUnique({
            where: { slug: comp.organizerSlug }
          });
          organizerId = org?.id;
        }
        
        // Crear competición
        await prisma.competition.create({
          data: {
            id: comp.id,
            eventId: comp.eventId,
            name: comp.name,
            slug: comp.slug,
            description: comp.description,
            baseDistance: comp.baseDistance,
            baseElevation: comp.baseElevation,
            itraPoints: comp.itraPoints,
            terrainType: comp.terrainType,
            organizerId: organizerId,
            featured: comp.featured,
            status: comp.status,
            language: comp.language
          }
        });
        
        // Conectar series
        if (comp.series && comp.series.length > 0) {
          for (const seriesSlug of comp.series) {
            const series = await prisma.specialSeries.findUnique({
              where: { slug: seriesSlug }
            });
            if (series) {
              await prisma.competitionSeries.create({
                data: {
                  competitionId: comp.id,
                  seriesId: series.id
                }
              });
            }
          }
        }
        
        results.created++;
      } catch (error) {
        results.errors.push({ slug: comp.slug, error: error.message });
      }
    }
    
    return results;
  }
}
```

---

## Consideraciones Técnicas

1. **Transacciones**: Usar transacciones de Prisma para cada batch
2. **Batch Size**: Procesar en lotes de 50-100 registros
3. **Duplicados**: Verificar por slug antes de crear
4. **PostGIS**: Usar raw queries para ST_MakePoint
5. **Relaciones Series**: Crear después de importar competitions

---

## Checklist de Implementación

- [ ] Crear modelos Prisma si no existen (Organizer, SpecialSeries)
- [ ] Implementar schemas Zod de validación
- [ ] Crear servicio de importación
- [ ] Crear controller de importación
- [ ] Crear rutas en v2/admin/import
- [ ] Implementar importación de Organizers
- [ ] Implementar importación de Series
- [ ] Implementar importación de Events (con PostGIS)
- [ ] Implementar importación de Competitions
- [ ] Crear endpoint de importación completa
- [ ] Añadir logging y manejo de errores
- [ ] Probar con subset de datos

---

## Datos de Prueba

Para testing rápido, usar los primeros registros de cada archivo:
- 5 primeros organizers
- 5 primeras series
- Event "salomon-ultra-pirineu" y sus competitions relacionadas
