#!/bin/bash
# Script para aplicar la migración de campos de imagen
# Ejecutar desde el directorio wwtrail-backend

echo "🔧 Aplicando migración de campos de imagen..."
echo ""

# Verificar si la base de datos está corriendo
if ! npx prisma migrate status &> /dev/null; then
  echo "❌ Error: La base de datos no está accesible"
  echo "Por favor, asegúrate de que PostgreSQL está corriendo"
  exit 1
fi

# Aplicar la migración
echo "📦 Aplicando migración..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migración aplicada exitosamente!"
  echo ""
  echo "Campos agregados:"
  echo "  - competitions.logoUrl (TEXT)"
  echo "  - competitions.coverImage (TEXT)"
  echo "  - competitions.gallery (TEXT[])"
  echo "  - editions.coverImage (TEXT)"
  echo "  - editions.gallery (TEXT[])"
  echo ""
  echo "🎉 Ahora las imágenes de portada deberían funcionar correctamente"
else
  echo ""
  echo "❌ Error al aplicar la migración"
  echo "Intenta ejecutar manualmente:"
  echo "  npx prisma migrate dev"
  exit 1
fi
