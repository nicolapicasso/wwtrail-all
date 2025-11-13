#!/bin/bash

# 🔍 WWTRAIL Frontend - Script de Verificación
# Este script verifica que todo esté correctamente configurado

echo "🔍 VERIFICANDO PROYECTO WWTRAIL FRONTEND..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de verificaciones
TOTAL=0
PASSED=0

check() {
  TOTAL=$((TOTAL + 1))
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ $1${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ $1${NC}"
  fi
}

# 1. Verificar Node.js
echo "📦 Verificando dependencias del sistema..."
node --version > /dev/null 2>&1
check "Node.js instalado"

npm --version > /dev/null 2>&1
check "npm instalado"

# 2. Verificar node_modules
if [ -d "node_modules" ]; then
  check "node_modules existe"
else
  echo -e "${RED}❌ node_modules no existe${NC}"
fi

# 3. Verificar archivos clave
echo ""
echo "📁 Verificando archivos del proyecto..."

files=(
  "package.json"
  "tsconfig.json"
  "tailwind.config.js"
  "next.config.js"
  "middleware.ts"
  "app/layout.tsx"
  "app/page.tsx"
  "app/auth/login/page.tsx"
  "app/auth/register/page.tsx"
  "app/dashboard/page.tsx"
  "components/Navbar.tsx"
  "components/ui/button.tsx"
  "components/ui/input.tsx"
  "components/ui/label.tsx"
  "components/ui/card.tsx"
  "contexts/AuthContext.tsx"
  "lib/api/client.ts"
  "lib/api/auth.service.ts"
  "lib/validations/auth.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    check "$file"
  else
    echo -e "${RED}❌ $file no encontrado${NC}"
  fi
done

# 4. Verificar dependencias críticas
echo ""
echo "📚 Verificando dependencias npm..."

deps=(
  "next"
  "react"
  "axios"
  "react-hook-form"
  "zod"
  "@hookform/resolvers"
  "js-cookie"
  "lucide-react"
)

for dep in "${deps[@]}"; do
  if npm ls "$dep" > /dev/null 2>&1; then
    check "$dep instalado"
  else
    echo -e "${RED}❌ $dep no instalado${NC}"
  fi
done

# 5. Verificar variables de entorno
echo ""
echo "🔐 Verificando configuración..."

if [ -f ".env.local" ]; then
  check ".env.local existe"
  if grep -q "NEXT_PUBLIC_API_URL" .env.local; then
    check "NEXT_PUBLIC_API_URL configurada"
  else
    echo -e "${YELLOW}⚠️  NEXT_PUBLIC_API_URL no encontrada en .env.local${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  .env.local no existe (opcional)${NC}"
fi

# Resumen
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "📊 RESUMEN: ${GREEN}${PASSED}/${TOTAL}${NC} verificaciones pasadas"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $PASSED -eq $TOTAL ]; then
  echo -e "${GREEN}✅ ¡TODO CORRECTO! El proyecto está listo.${NC}"
  echo ""
  echo "🚀 Para iniciar el servidor de desarrollo:"
  echo "   npm run dev"
  echo ""
  echo "🌐 El frontend estará disponible en:"
  echo "   http://localhost:3000"
  exit 0
else
  echo -e "${YELLOW}⚠️  Algunas verificaciones fallaron.${NC}"
  echo ""
  echo "💡 Soluciones:"
  echo "   1. Ejecutar: npm install"
  echo "   2. Verificar que todos los archivos estén en su lugar"
  echo "   3. Revisar la documentación en README.md"
  exit 1
fi
