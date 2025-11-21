# Instrucciones de Migración - Restauración Schema Completo

## Problema Solucionado

Durante el merge de las ramas `claude/fix-styles-01QAtNyTG97NAMn5fZ5muehp` (sistema de magazine/blog) y `claude/review-project-structure-01QAtNyTG97NAMn5fZ5muehp` (sistema de cupones), el `schema.prisma` quedó con la versión simplificada perdiendo campos importantes del modelo Post.

## Campos Restaurados en Post

### Campos SEO:
- `metaTitle` (String?, VARCHAR 255)
- `metaDescription` (String?, TEXT)

### Campo de Idioma:
- `language` (Language, default ES)

### Relaciones con Eventos:
- `eventId` (String?, opcional)
- `event` (relación con Event)
- `competitionId` (String?, opcional)
- `competition` (relación con Competition)

## Migración de Base de Datos

### Opción 1: Migración Automática (RECOMENDADA)

Cuando levantes la base de datos PostgreSQL, ejecuta:

```bash
cd wwtrail-backend
npx prisma migrate dev --name restore_complete_post_schema
```

Esto creará automáticamente la migración y aplicará los cambios.

### Opción 2: Migración Manual (si prefieres revisar el SQL primero)

```bash
# Generar la migración sin aplicarla
npx prisma migrate dev --create-only --name restore_complete_post_schema

# Revisar el SQL generado en:
# prisma/migrations/XXXXXX_restore_complete_post_schema/migration.sql

# Aplicar la migración
npx prisma migrate deploy
```

## SQL Esperado de la Migración

La migración debería añadir las siguientes columnas a la tabla `posts`:

```sql
-- Añadir campos SEO
ALTER TABLE "posts" ADD COLUMN "metaTitle" VARCHAR(255);
ALTER TABLE "posts" ADD COLUMN "metaDescription" TEXT;

-- Añadir campo de idioma
ALTER TABLE "posts" ADD COLUMN "language" "Language" NOT NULL DEFAULT 'ES';

-- Añadir relaciones con eventos
ALTER TABLE "posts" ADD COLUMN "eventId" TEXT;
ALTER TABLE "posts" ADD COLUMN "competitionId" TEXT;

-- Crear foreign keys
ALTER TABLE "posts" ADD CONSTRAINT "posts_eventId_fkey"
  FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "posts" ADD CONSTRAINT "posts_competitionId_fkey"
  FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Crear índices
CREATE INDEX "posts_language_idx" ON "posts"("language");
CREATE INDEX "posts_eventId_idx" ON "posts"("eventId");
CREATE INDEX "posts_competitionId_idx" ON "posts"("competitionId");
```

## Verificación Post-Migración

Después de ejecutar la migración, verifica que todo esté correcto:

```bash
# Verificar que el schema está sincronizado
npx prisma validate

# Ver el estado de las migraciones
npx prisma migrate status

# Probar que Prisma Client funciona
npx prisma studio
```

## Datos Existentes

- Los posts existentes en la base de datos tendrán los nuevos campos en `NULL` (excepto `language` que tendrá 'ES' por defecto)
- No se perderán datos existentes
- Puedes actualizar los posts posteriormente para añadir metaTitle, metaDescription y relaciones si es necesario

## Rollback (Si es necesario)

Si necesitas revertir los cambios:

```bash
# Ver migraciones aplicadas
npx prisma migrate status

# Volver a la migración anterior
# (CUIDADO: esto puede causar pérdida de datos)
npx prisma migrate resolve --rolled-back [migration_name]
```

## Backup

Antes de ejecutar la migración, se recomienda hacer un backup de la base de datos:

```bash
pg_dump -U wwtrail_user wwtrail_db > backup_antes_migracion_$(date +%Y%m%d_%H%M%S).sql
```

## Cambios en el Código

Los siguientes archivos ya fueron actualizados en este commit:
- ✅ `prisma/schema.prisma` - Schema completo restaurado
- ✅ `src/services/posts.service.ts` - Interfaces y métodos actualizados
- ✅ Prisma Client regenerado

## Soporte

Si encuentras algún problema durante la migración:
1. Verifica que PostgreSQL está corriendo
2. Verifica las credenciales en `.env`
3. Revisa los logs de error de Prisma
4. Verifica que el backup del schema anterior está en `prisma/schema.prisma.backup-TIMESTAMP`
