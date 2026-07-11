# ✅ BLOQUE 2 COMPLETADO: CompetitionService

## 📋 Resumen de Implementación

### ✅ competition.service.ts - COMPLETADO Y MEJORADO

**Métodos CRUD Principales:**

1. **`create(data, organizerId)`** ✅
   - Genera slug único automáticamente
   - Maneja coordenadas PostGIS (Point geometry)
   - Convierte fechas a Date objects
   - Incluye información del organizador
   - Invalida caché
   - Logging de creación
   - **Retorna:** Competition completa con organizer

2. **`findAll(filters)`** ✅
   - Paginación (page, limit)
   - Filtros: search, type, status, country, startDate, endDate
   - Ordenamiento configurable (sortBy, sortOrder)
   - Búsqueda insensible a mayúsculas en: name, description, city
   - Cache inteligente con hash de parámetros
   - Incluye contador de participantes y reviews
   - **Retorna:** `{ data: [], pagination: { page, limit, total, pages } }`

3. **`findById(id)`** ✅
   - Busca por UUID
   - Cache por ID
   - Incluye: organizer, categories, translations, counts
   - Incrementa viewCount automáticamente
   - Lanza 404 si no existe
   - **Retorna:** Competition completa

4. **`findBySlug(slug)`** ✅
   - Busca por slug único
   - Similar a findById
   - Incluye todas las relaciones
   - Incrementa viewCount
   - **Retorna:** Competition completa

5. **`update(id, data, userId)`** ✅
   - Verifica existencia
   - Valida permisos (organizador o admin)
   - Actualiza campos parciales
   - Maneja conversión de fechas
   - Invalida caché múltiple
   - Logging de actualización
   - **Retorna:** Competition actualizada

6. **`delete(id, userId)`** ✅
   - Verifica existencia
   - Valida permisos (organizador o admin)
   - Eliminación permanente
   - Invalida caché
   - Logging de eliminación (warn level)
   - **Retorna:** `{ message }`

---

**Métodos de Búsqueda Avanzada:**

7. **`findNearby(lat, lon, radiusKm)`** ✅ POSTGIS
   - Búsqueda geoespacial con PostGIS
   - Usa ST_DWithin para radio
   - Calcula distancia en km (ST_Distance)
   - Radio por defecto: 50km
   - Límite: 20 resultados
   - Ordenado por distancia (cercano → lejano)
   - Logging de resultados encontrados
   - **Retorna:** Array con { id, name, city, country, startDate, distance_km }

8. **`search(query, limit)`** ⭐ NUEVO - FULL-TEXT
   - Búsqueda full-text con pg_trgm (trigram similarity)
   - Mínimo 2 caracteres
   - Busca en: name, city, country, description
   - Calcula relevancia por similitud
   - Solo competiciones PUBLISHED
   - Cache por query
   - Ordenado por relevancia + fecha
   - Logging de búsquedas
   - **Retorna:** Array con competiciones + score de relevancia

9. **`getFeatured(limit)`** ⭐ NUEVO
   - Competiciones destacadas (isHighlighted = true)
   - Solo PUBLISHED y futuras
   - Ordenado por: startDate ASC, viewCount DESC
   - Límite por defecto: 10
   - Cache de larga duración (1 hora)
   - Incluye organizer y counts
   - **Retorna:** Array de competiciones destacadas

10. **`getUpcoming(limit)`** ⭐ NUEVO
    - Próximas competiciones
    - Solo PUBLISHED y futuras (>= hoy)
    - Ordenado por fecha de inicio
    - Límite por defecto: 20
    - Cache de 5 minutos
    - Incluye organizer y counts
    - **Retorna:** Array de competiciones próximas

11. **`getByCountry(country, options)`** ⭐ NUEVO
    - Filtra por país (case insensitive)
    - Paginación opcional
    - Solo PUBLISHED
    - Ordenado por fecha de inicio
    - Cache por país y página
    - **Retorna:** `{ data: [], pagination: {} }`

12. **`getStats(id)`** ⭐ NUEVO
    - Estadísticas completas de una competición
    - Cuenta: participantes, reviews, categorías, resultados
    - Calcula rating promedio
    - **Retorna:** Objeto con todas las estadísticas

---

**Método Privado:**

13. **`generateUniqueSlug(name)`** 🔒 PRIVADO
    - Convierte nombre a slug
    - Verifica unicidad en BD
    - Añade contador si existe duplicado
    - **Retorna:** Slug único

---

## 🗺️ PostGIS - Búsqueda Geoespacial

### Funciones PostGIS Utilizadas:

- **`ST_SetSRID()`**: Establece sistema de coordenadas (SRID 4326 = WGS84)
- **`ST_MakePoint(lon, lat)`**: Crea un punto desde coordenadas
- **`ST_DWithin()`**: Verifica si dos geometrías están dentro de una distancia
- **`ST_Distance()`**: Calcula distancia entre dos geometrías
- **`::geography`**: Cast a tipo geography para cálculos en metros

### Ejemplo de Query PostGIS:

```sql
SELECT 
  id, name, city, country, "startDate",
  ST_Distance(
    location::geography,
    ST_SetSRID(ST_MakePoint(-3.7038, 40.4168), 4326)::geography
  ) / 1000 as distance_km
FROM competitions
WHERE location IS NOT NULL
AND ST_DWithin(
  location::geography,
  ST_SetSRID(ST_MakePoint(-3.7038, 40.4168), 4326)::geography,
  50000  -- 50km en metros
)
ORDER BY distance_km
LIMIT 20
```

---

## 🔍 Full-Text Search con pg_trgm

### Extensión pg_trgm (Trigram):

- Permite búsquedas de similitud de texto
- Función `similarity(text1, text2)` retorna score 0-1
- Operador `ILIKE` para búsqueda insensible a mayúsculas
- Índices GIN para rendimiento óptimo

### Ejemplo de Query:

```sql
SELECT 
  id, slug, name, city, country,
  similarity(name, 'ultra trail') + 
  similarity(COALESCE(city, ''), 'ultra trail') + 
  similarity(COALESCE(description, ''), 'ultra trail') as relevance
FROM competitions
WHERE 
  status = 'PUBLISHED'
  AND (
    name ILIKE '%ultra trail%'
    OR city ILIKE '%ultra trail%'
    OR country ILIKE '%ultra trail%'
    OR description ILIKE '%ultra trail%'
  )
ORDER BY relevance DESC, "startDate" ASC
LIMIT 20
```

---

## 💾 Sistema de Caché

### Estrategia de Cache:

- **CACHE_TTL**: 5 minutos (datos frecuentes)
- **CACHE_TTL_LONG**: 1 hora (datos estables)

### Keys de Cache:

- `competition:{id}` - Competición individual
- `competitions:list` - Lista general (invalidar en create/update/delete)
- `competitions:{params}` - Lista con filtros específicos
- `search:{query}:{limit}` - Resultados de búsqueda
- `competitions:featured:{limit}` - Destacadas
- `competitions:upcoming:{limit}` - Próximas
- `competitions:country:{country}:{page}:{limit}` - Por país

### Invalidación:

- Al **crear**: invalida `competitions:list`
- Al **actualizar**: invalida `competition:{id}` + `competitions:list`
- Al **eliminar**: invalida `competition:{id}` + `competitions:list`

---

## 🔐 Control de Permisos

### Update & Delete:

- Solo el **organizador** de la competición puede modificarla
- Los **ADMIN** pueden modificar/eliminar cualquier competición
- Verifica `user.role === 'ADMIN' || competition.organizerId === userId`
- Lanza error 403 si no tiene permisos

---

## 📊 Includes & Relaciones

### Datos incluidos en queries:

**Organizer (siempre):**
```typescript
organizer: {
  select: {
    id, username, firstName, lastName, (email solo en findById)
  }
}
```

**Counts (en listados):**
```typescript
_count: {
  select: {
    participants: true,
    reviews: true,
    (categories, results en getStats)
  }
}
```

**Relaciones completas (findById/findBySlug):**
- organizer
- categories
- translations
- _count (participants, reviews)

---

## 📝 Logging Implementado

- ✅ Creación de competiciones
- ✅ Actualización de competiciones
- ✅ Eliminación de competiciones (warn level)
- ✅ Búsquedas cercanas (con cantidad de resultados)
- ✅ Búsquedas full-text (con query y resultados)

---

## 🎯 Endpoints del Controller (próximo paso)

Los siguientes endpoints necesitan conectarse con estos servicios:

```
GET    /api/v1/competitions              → findAll()
GET    /api/v1/competitions/featured     → getFeatured()
GET    /api/v1/competitions/upcoming     → getUpcoming()
GET    /api/v1/competitions/search       → search()
GET    /api/v1/competitions/nearby       → findNearby()
GET    /api/v1/competitions/country/:country → getByCountry()
GET    /api/v1/competitions/:id          → findById()
GET    /api/v1/competitions/:id/stats    → getStats()
GET    /api/v1/competitions/slug/:slug   → findBySlug()
POST   /api/v1/competitions              → create() [AUTH]
PUT    /api/v1/competitions/:id          → update() [AUTH]
DELETE /api/v1/competitions/:id          → delete() [AUTH]
```

---

## ✅ Resumen de Mejoras Añadidas

### Nuevos métodos:
- ⭐ `search()` - Full-text search
- ⭐ `getFeatured()` - Competiciones destacadas
- ⭐ `getUpcoming()` - Próximas competiciones
- ⭐ `getByCountry()` - Por país con paginación
- ⭐ `getStats()` - Estadísticas completas

### Mejoras generales:
- ✅ Logging completo
- ✅ Cache optimizado (TTL diferenciado)
- ✅ Mejores comentarios
- ✅ Validación de permisos
- ✅ Manejo de errores

---

## 🚀 SIGUIENTE PASO

**BLOQUE 3: CompetitionController**

Necesitamos actualizar `src/controllers/competition.controller.ts` para conectar todos estos métodos con los endpoints HTTP.

¿Continuamos? 🎯
