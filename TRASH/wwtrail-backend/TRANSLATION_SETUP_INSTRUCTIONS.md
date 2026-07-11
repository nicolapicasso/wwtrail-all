# Instrucciones de Configuración - Sistema de Traducciones

## 📋 Resumen

Se ha implementado un sistema completo de traducciones automáticas mediante IA (OpenAI ChatGPT) para el proyecto WWTRAIL.

### ✅ Cambios Implementados

1. **Schema de Prisma Actualizado**
   - Nuevos modelos de traducción:
     - `EventTranslation`
     - `ServiceTranslation`
     - `SpecialSeriesTranslation`
   - Relaciones agregadas a los modelos originales

2. **Backend - Servicio de Traducción**
   - `TranslationService` con integración a OpenAI GPT-4o-mini
   - Traducciones automáticas para: Competition, Post, Event, Service, SpecialSeries
   - Optimización: traduce múltiples campos en una sola llamada a la API

3. **Backend - Controller y Rutas**
   - `TranslationController` con endpoints REST
   - Rutas públicas y protegidas
   - Autenticación requerida para ORGANIZER y ADMIN

4. **Configuración**
   - Variable de entorno `OPENAI_API_KEY` ya configurada
   - Endpoints disponibles en `/api/v2/translations`

---

## 🚀 Pasos para Activar el Sistema

### 1. Aplicar Migraciones de Base de Datos

Ejecuta el siguiente comando para crear las nuevas tablas:

```bash
cd wwtrail-backend
npm run prisma:migrate
```

Cuando te pregunte el nombre de la migración, usa: `add_translation_models`

Esto creará las siguientes tablas:
- `event_translations`
- `service_translations`
- `special_series_translations`

### 2. Verificar API Key de OpenAI

Asegúrate de que tu archivo `.env` tenga la siguiente variable:

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

**IMPORTANTE**: Reemplaza `your-openai-api-key-here` con tu API key real de OpenAI.

### 3. Reiniciar el Servidor Backend

```bash
npm run dev
```

---

## 📡 Endpoints Disponibles

### **Rutas Públicas** (No requieren autenticación)

#### Obtener traducciones de una competición
```http
GET /api/v2/translations/competition/:competitionId
```

Query params opcionales:
- `language`: ES | EN | IT | CA | FR | DE

Ejemplo:
```bash
curl http://localhost:3001/api/v2/translations/competition/123?language=EN
```

#### Obtener traducciones de un post
```http
GET /api/v2/translations/post/:postId
```

---

### **Rutas Protegidas** (Requieren autenticación: ORGANIZER o ADMIN)

#### Auto-traducir una competición
```http
POST /api/v2/translations/competition/:competitionId
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetLanguages": ["EN", "IT", "FR"],
  "overwrite": false
}
```

Ejemplo con curl:
```bash
curl -X POST http://localhost:3001/api/v2/translations/competition/123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetLanguages": ["EN", "IT", "FR", "DE", "CA"],
    "overwrite": false
  }'
```

#### Auto-traducir un post
```http
POST /api/v2/translations/post/:postId
```

#### Auto-traducir un evento
```http
POST /api/v2/translations/event/:eventId
```

#### Auto-traducir un servicio
```http
POST /api/v2/translations/service/:serviceId
```

#### Auto-traducir una serie especial
```http
POST /api/v2/translations/special-series/:specialSeriesId
```

#### Endpoint genérico de traducción
```http
POST /api/v2/translations/auto-translate
Content-Type: application/json

{
  "entityType": "competition" | "post" | "event" | "service" | "specialSeries",
  "entityId": "uuid-here",
  "targetLanguages": ["EN", "IT", "FR"],
  "overwrite": false
}
```

---

## 🎯 Flujo de Trabajo Recomendado

### Caso 1: Usuario crea un Post en Español

1. **Usuario ORGANIZER crea post** en español mediante formulario:
   ```json
   POST /api/v2/posts
   {
     "title": "Mi primera ultra trail",
     "content": "Contenido en español...",
     "language": "ES"
   }
   ```

2. **Sistema guarda el post** con `language=ES`

3. **Llamada automática para traducir** (implementar en el futuro):
   ```json
   POST /api/v2/translations/post/{postId}
   {
     "targetLanguages": ["EN", "IT", "FR", "DE", "CA"],
     "overwrite": false
   }
   ```

4. **GPT traduce automáticamente** a los 5 idiomas

5. **Las traducciones se guardan** en `post_translations`

6. **Usuario frontend** con `language=EN` verá la traducción automática en inglés

---

## ✅ Integración Automática Implementada

Las traducciones se disparan **automáticamente** cuando se crea o publica contenido con status PUBLISHED:

### Servicios con Auto-Traducción Integrada

1. **PostsService** ✅
   - Al crear con status PUBLISHED (ADMIN)
   - Al publicar (método `publish()`)
   - Al actualizar de DRAFT a PUBLISHED

2. **CompetitionService** ✅
   - Al crear (siempre se crea con status PUBLISHED)

3. **EventService** ✅
   - Al crear con status PUBLISHED (ADMIN)

4. **ServiceService** ✅
   - Al crear (normalmente DRAFT, se traduce al publicar)

### Configuración de Auto-Traducción

Controla el comportamiento mediante variables de entorno:

```bash
# Habilitar/deshabilitar traducciones automáticas
AUTO_TRANSLATE_ENABLED=true

# Idiomas objetivo (separados por coma)
AUTO_TRANSLATE_LANGUAGES=EN,IT,CA,FR,DE

# Idioma por defecto/fuente
DEFAULT_LANGUAGE=ES

# Sobrescribir traducciones existentes
AUTO_TRANSLATE_OVERWRITE=false

# Ejecutar en background (no bloqueante)
AUTO_TRANSLATE_BACKGROUND=true

# Solo traducir contenido publicado
AUTO_TRANSLATE_ONLY_PUBLISHED=true
```

### Modo Background vs Síncrono

- **Background (recomendado)**: La traducción se ejecuta después de devolver la respuesta al usuario. No afecta el tiempo de respuesta de la API.
- **Síncrono**: Espera a que termine la traducción antes de devolver la respuesta. Útil para debugging pero más lento.

### 2. Frontend - Sistema i18n

- Instalar `next-intl` para Next.js
- Crear archivos de traducción para textos estáticos
- Implementar selector de idioma
- Actualizar componentes para mostrar traducciones dinámicas

### 3. Detección Automática de Idioma Original

Actualmente asumimos que el idioma original es ES. Mejorar para:
- Detectar idioma del campo `language` en el modelo
- Permitir especificar idioma fuente en la petición

---

## 🧪 Prueba Rápida

### Paso 1: Crear un Post de Prueba

```bash
curl -X POST http://localhost:3001/api/v2/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primera ultra trail en Pirineos",
    "excerpt": "Una experiencia inolvidable corriendo por las montañas",
    "content": "Fue una carrera increíble con paisajes espectaculares...",
    "category": "RACE_REPORTS",
    "language": "ES",
    "status": "PUBLISHED"
  }'
```

### Paso 2: Traducir Automáticamente

```bash
# Supongamos que el ID del post creado es: abc-123

curl -X POST http://localhost:3001/api/v2/translations/post/abc-123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetLanguages": ["EN", "IT"],
    "overwrite": false
  }'
```

### Paso 3: Verificar Traducciones

```bash
curl http://localhost:3001/api/v2/translations/post/abc-123
```

Deberías ver las traducciones en inglés e italiano.

---

## 📊 Costos de OpenAI

Con GPT-4o-mini:
- **Input**: $0.150 / 1M tokens
- **Output**: $0.600 / 1M tokens

Ejemplo de costo por traducción:
- Post típico (500 palabras) ≈ 750 tokens
- Traducción a 5 idiomas ≈ 3,750 tokens output
- **Costo estimado**: $0.0025 USD por post

Para 1000 posts traducidos a 5 idiomas: **~$2.50 USD**

---

## ❓ Preguntas Frecuentes

### ¿Puedo editar las traducciones automáticas?

Actualmente no hay interfaz para editar traducciones. Está planificado como funcionalidad futura.

### ¿Qué pasa si vuelvo a traducir el mismo contenido?

Por defecto, `overwrite: false` evita sobrescribir traducciones existentes. Si quieres re-traducir, usa `overwrite: true`.

### ¿Se traduce HTML dentro del contenido?

Sí, GPT mantiene el HTML intacto y solo traduce el texto visible.

### ¿Cómo cambiar el modelo de GPT?

Edita `src/services/translation.service.ts` y cambia `gpt-4o-mini` por otro modelo (ej: `gpt-4o`).

---

## 🔧 Troubleshooting

### Error: "OPENAI_API_KEY no configurada"

Verifica que el archivo `.env` tenga la variable correcta.

### Error: "No se recibió traducción de OpenAI"

Posibles causas:
1. API key inválida o sin créditos
2. Rate limit excedido
3. Problema de red

Revisa los logs del backend para más detalles.

### Las traducciones están mal

GPT-4o-mini es muy bueno, pero puede cometer errores. Considera:
1. Mejorar el prompt en `TranslationService`
2. Usar `gpt-4o` (más caro pero más preciso)
3. Implementar revisión manual de traducciones

---

## 📞 Soporte

Si tienes problemas, revisa:
1. Logs del backend (`npm run dev`)
2. Estado de la API de OpenAI: https://status.openai.com
3. Documentación de Prisma: https://www.prisma.io/docs

---

**¡El sistema de traducciones está listo para usar!** 🎉
