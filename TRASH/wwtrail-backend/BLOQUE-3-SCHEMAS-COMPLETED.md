# ✅ BLOQUE 3 COMPLETADO: Schemas de Validación (Zod)

## 📋 Resumen de Implementación

### ✅ Todos los Schemas Creados/Mejorados

---

## 1️⃣ auth.schema.ts ✅ (EXISTÍA - VERIFICADO)

**Schemas disponibles:**

- **`registerSchema`**
  - email: validación de email
  - username: 3-20 chars, solo alfanumérico + guión bajo
  - password: min 8 chars, requiere mayúscula + minúscula + número
  - firstName, lastName: opcionales
  - language: enum ['ES', 'EN', 'IT', 'CA', 'FR', 'DE']

- **`loginSchema`**
  - email: validación de email
  - password: requerido

- **`refreshTokenSchema`**
  - refreshToken: string requerido

- **`forgotPasswordSchema`**
  - email: validación de email

- **`resetPasswordSchema`**
  - token: requerido
  - password: validación fuerte

**Types exportados:**
```typescript
RegisterInput, LoginInput, RefreshTokenInput, 
ForgotPasswordInput, ResetPasswordInput
```

---

## 2️⃣ competition.schema.ts ✅ (MEJORADO Y AMPLIADO)

**Schemas CRUD:**

- **`createCompetitionSchema`**
  - name: min 3 chars
  - type: enum ['TRAIL', 'ULTRA', 'VERTICAL', 'SKYRUNNING', 'CANICROSS', 'OTHER']
  - startDate, endDate: datetime ISO
  - country, city: requeridos
  - latitude (-90 a 90), longitude (-180 a 180): opcionales
  - distance, elevation: números positivos opcionales
  - URLs: validación de URL o string vacío
  - email: validación de email
  - maxParticipants: entero positivo

- **`updateCompetitionSchema`**
  - Todos los campos opcionales (partial)
  - Añade: status, registrationStatus, isHighlighted
  - Mismas validaciones que create

- **`getCompetitionsSchema`** (query params)
  - page, limit: strings con defaults ('1', '10')
  - search: string opcional
  - type, status, country: filtros opcionales
  - startDate, endDate: rangos de fecha
  - sortBy: ['startDate', 'name', 'createdAt', 'viewCount']
  - sortOrder: ['asc', 'desc']
  - language: enum idiomas

- **`competitionIdSchema`**
  - params.id: UUID validado

- **`competitionSlugSchema`** ⭐ NUEVO
  - params.slug: string min 1 char

**Schemas de Búsqueda Avanzada:** ⭐ NUEVOS

- **`searchCompetitionsSchema`**
  - query.q: min 2 chars (búsqueda full-text)
  - query.limit: número, default 20

- **`nearbyCompetitionsSchema`**
  - query.lat: -90 a 90
  - query.lon: -180 a 180
  - query.radius: 1 a 500 km, default 50

- **`featuredCompetitionsSchema`**
  - query.limit: 1 a 50, default 10

- **`upcomingCompetitionsSchema`**
  - query.limit: 1 a 100, default 20

- **`competitionsByCountrySchema`**
  - params.country: min 2 chars
  - query.page, query.limit: paginación

**Types exportados:**
```typescript
CreateCompetitionInput, UpdateCompetitionInput, 
GetCompetitionsQuery, SearchCompetitionsQuery,
NearbyCompetitionsQuery, FeaturedCompetitionsQuery,
UpcomingCompetitionsQuery, CompetitionsByCountryParams,
CompetitionsByCountryQuery
```

---

## 3️⃣ user.schema.ts ⭐ NUEVO

**Schemas disponibles:**

- **`updateUserSchema`**
  - firstName, lastName: 1-50 chars
  - username: 3-20 chars, alfanumérico + underscore
  - bio: max 500 chars
  - avatar: URL o string vacío
  - phone, city: opcionales
  - country: código ISO 2 letras
  - language: enum idiomas

- **`changePasswordSchema`**
  - currentPassword: requerido
  - newPassword: validación fuerte (8+ chars, mayús/minús/número)
  - confirmPassword: debe coincidir con newPassword
  - **Refinement**: valida que newPassword === confirmPassword

- **`userIdSchema`**
  - params.id: UUID validado

- **`getUsersSchema`** (solo admin)
  - query.page, query.limit: paginación
  - query.role: enum ['ADMIN', 'ORGANIZER', 'ATHLETE', 'VIEWER']
  - query.isActive: boolean transform
  - query.search: string opcional

**Types exportados:**
```typescript
UpdateUserInput, ChangePasswordInput, GetUsersQuery
```

---

## 4️⃣ translation.schema.ts ⭐ NUEVO

**Schemas disponibles:**

- **`createTranslationSchema`**
  - competitionId: UUID
  - language: enum idiomas
  - name: min 3 chars
  - description: opcional

- **`updateTranslationSchema`**
  - name: min 3 chars, opcional
  - description: opcional
  - status: enum ['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVIEW']

- **`autoTranslateSchema`** (IA)
  - competitionId: UUID
  - targetLanguages: array de idiomas, min 1, max 5
  - overwrite: boolean, default false

- **`getTranslationsSchema`**
  - params.competitionId: UUID
  - query.language: filtro por idioma
  - query.status: filtro por estado

- **`updateTranslationStatusSchema`**
  - status: enum estados

- **`translationIdSchema`**
  - params.id: UUID

**Types exportados:**
```typescript
CreateTranslationInput, UpdateTranslationInput,
AutoTranslateInput, GetTranslationsQuery,
UpdateTranslationStatusInput
```

---

## 5️⃣ review.schema.ts ⭐ NUEVO

**Schemas disponibles:**

- **`createReviewSchema`**
  - competitionId: UUID
  - rating: entero 1-5
  - comment: max 1000 chars, opcional

- **`updateReviewSchema`**
  - rating: entero 1-5, opcional
  - comment: max 1000 chars, opcional

- **`getReviewsSchema`**
  - params.competitionId: UUID
  - query.page, query.limit: paginación
  - query.sortBy: ['createdAt', 'rating']
  - query.sortOrder: ['asc', 'desc']
  - query.rating: filtro 1-5

- **`reviewIdSchema`**
  - params.id: UUID

**Types exportados:**
```typescript
CreateReviewInput, UpdateReviewInput,
GetReviewsQuery, GetReviewsParams
```

---

## 6️⃣ participant.schema.ts ⭐ NUEVO

**Schemas disponibles:**

- **`createParticipantSchema`**
  - competitionId: UUID
  - categoryId: UUID, opcional
  - firstName, lastName: max 50 chars, opcionales
  - email: validación email, opcional
  - bibNumber: max 20 chars, opcional

- **`updateParticipantSchema`**
  - categoryId: UUID, opcional
  - bibNumber: max 20 chars, opcional
  - status: enum ['REGISTERED', 'CONFIRMED', 'DNS', 'DNF', 'DSQ', 'FINISHED']

- **`getParticipantsSchema`**
  - query.competitionId: UUID, opcional
  - query.categoryId: UUID, opcional
  - query.status: filtro por estado
  - query.page, query.limit: paginación
  - query.search: buscar por nombre/email

- **`participantIdSchema`**
  - params.id: UUID

**Types exportados:**
```typescript
CreateParticipantInput, UpdateParticipantInput,
GetParticipantsQuery
```

---

## 7️⃣ result.schema.ts ⭐ NUEVO

**Schemas disponibles:**

- **`createResultSchema`**
  - competitionId: UUID
  - categoryId: UUID
  - participantId: UUID
  - position: entero positivo, opcional
  - time: formato HH:MM:SS (regex), opcional
  - timeSeconds: entero positivo, opcional
  - pace: string, opcional
  - avgHeartRate: 1-250 bpm, opcional

- **`updateResultSchema`**
  - Campos opcionales de create
  - isVerified: boolean

- **`getResultsSchema`**
  - query.competitionId: UUID filtro
  - query.categoryId: UUID filtro
  - query.participantId: UUID filtro
  - query.userId: UUID filtro
  - query.page, query.limit: paginación
  - query.sortBy: ['position', 'timeSeconds', 'createdAt']
  - query.sortOrder: ['asc', 'desc']
  - query.isVerified: boolean filter

- **`resultIdSchema`**
  - params.id: UUID

- **`importResultsSchema`** (bulk import)
  - competitionId: UUID
  - categoryId: UUID
  - results: array de resultados (min 1)
    - participantId o bibNumber
    - position, time, timeSeconds

**Types exportados:**
```typescript
CreateResultInput, UpdateResultInput,
GetResultsQuery, ImportResultsInput
```

---

## 🎯 Características de los Schemas

### ✅ Validaciones Implementadas

1. **UUIDs**: Validación con `.uuid()` para todos los IDs
2. **Emails**: Validación con `.email()`
3. **URLs**: Validación con `.url()` + opción de string vacío
4. **Enums**: Validación estricta de valores permitidos
5. **Rangos**: Min/max para números (lat, lon, rating, etc.)
6. **Regex**: Patrones para username, password, time format
7. **Transforms**: Conversión automática de strings a números/booleans
8. **Refinements**: Validaciones custom (ej: passwords match)
9. **Defaults**: Valores por defecto para parámetros opcionales

### 🔄 Patterns Comunes

**Paginación estándar:**
```typescript
page: z.string().optional().default('1').transform(Number)
limit: z.string().optional().default('20').transform(Number)
```

**UUID validation:**
```typescript
id: z.string().uuid('Invalid ID')
```

**Enum languages:**
```typescript
language: z.enum(['ES', 'EN', 'IT', 'CA', 'FR', 'DE'])
```

**Sort params:**
```typescript
sortBy: z.enum(['field1', 'field2']).optional().default('field1')
sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
```

---

## 📦 Archivos Creados/Actualizados

```
✅ src/schemas/auth.schema.ts           - EXISTÍA (verificado)
✅ src/schemas/competition.schema.ts    - MEJORADO Y AMPLIADO
⭐ src/schemas/user.schema.ts           - NUEVO
⭐ src/schemas/translation.schema.ts    - NUEVO
⭐ src/schemas/review.schema.ts         - NUEVO
⭐ src/schemas/participant.schema.ts    - NUEVO
⭐ src/schemas/result.schema.ts         - NUEVO
```

**Total: 7 schemas completos** 🎉

---

## 🔌 Uso en Middleware

Estos schemas se usan con el middleware de validación:

```typescript
import { validate } from '../middlewares/validate.middleware';
import { createCompetitionSchema } from '../schemas/competition.schema';

router.post(
  '/competitions',
  authenticate,
  validate(createCompetitionSchema),
  CompetitionController.create
);
```

---

## 🚀 SIGUIENTE PASO

**BLOQUE 4: Controllers**

Ahora que tenemos todos los schemas, necesitamos actualizar/crear los controllers para usar estas validaciones:

1. ✅ `auth.controller.ts` - Ya completado
2. 🔄 `competition.controller.ts` - Actualizar con nuevos endpoints
3. ⭐ `user.controller.ts` - Crear
4. ⭐ `translation.controller.ts` - Crear
5. ⭐ `review.controller.ts` - Crear
6. ⭐ `participant.controller.ts` - Crear
7. ⭐ `result.controller.ts` - Crear

¿Continuamos con los Controllers? 🎯
