#!/bin/bash

echo "🚀 WWTRAIL Backend - Setup Inicial"
echo "===================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js 20 o superior"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detectado${NC}"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    echo "Por favor instala Docker para continuar"
    exit 1
fi

echo -e "${GREEN}✅ Docker detectado${NC}"

# Verificar si docker-compose está disponible
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está disponible${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker Compose detectado${NC}"
echo ""

# Paso 1: Instalar dependencias npm
echo -e "${YELLOW}📦 Paso 1: Instalando dependencias...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi
echo ""

# Paso 2: Levantar contenedores Docker
echo -e "${YELLOW}🐳 Paso 2: Levantando PostgreSQL y Redis...${NC}"
docker-compose up -d
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Contenedores iniciados${NC}"
else
    echo -e "${RED}❌ Error iniciando contenedores${NC}"
    exit 1
fi
echo ""

# Esperar a que PostgreSQL esté listo
echo -e "${YELLOW}⏳ Esperando a que PostgreSQL esté listo...${NC}"
for i in {1..30}; do
    if docker exec wwtrail-postgres pg_isready -U wwtrail -d wwtrail_db > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL está listo${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Timeout esperando PostgreSQL${NC}"
        exit 1
    fi
    sleep 1
done
echo ""

# Paso 3: Generar cliente de Prisma
echo -e "${YELLOW}🔧 Paso 3: Generando cliente de Prisma...${NC}"
npx prisma generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Cliente de Prisma generado${NC}"
else
    echo -e "${RED}❌ Error generando cliente de Prisma${NC}"
    exit 1
fi
echo ""

# Paso 4: Ejecutar migraciones
echo -e "${YELLOW}🗄️  Paso 4: Ejecutando migraciones...${NC}"
npx prisma migrate dev --name init
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migraciones completadas${NC}"
else
    echo -e "${RED}❌ Error ejecutando migraciones${NC}"
    exit 1
fi
echo ""

# Paso 5: Seed de datos iniciales (opcional)
echo -e "${YELLOW}🌱 Paso 5: ¿Deseas cargar datos de prueba? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    npm run prisma:seed
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Datos de prueba cargados${NC}"
    else
        echo -e "${RED}❌ Error cargando datos de prueba${NC}"
    fi
fi
echo ""

# Resumen final
echo -e "${GREEN}═══════════════════════════════════${NC}"
echo -e "${GREEN}✅ Setup completado exitosamente!${NC}"
echo -e "${GREEN}═══════════════════════════════════${NC}"
echo ""
echo "📋 Información útil:"
echo ""
echo "   🌐 API: http://localhost:3001/api/v1"
echo "   💚 Health: http://localhost:3001/health"
echo "   🗄️  Database: postgresql://wwtrail:wwtrail_password@localhost:5432/wwtrail_db"
echo "   🔴 Redis: localhost:6379"
echo "   🎨 Prisma Studio: npm run prisma:studio"
echo ""
echo "🚀 Para iniciar el servidor:"
echo "   npm run dev"
echo ""
echo "📚 Comandos útiles:"
echo "   npm run dev              # Iniciar en modo desarrollo"
echo "   npm run build            # Compilar TypeScript"
echo "   npm run prisma:studio    # Abrir Prisma Studio"
echo "   npm run prisma:migrate   # Nueva migración"
echo "   npm run prisma:seed      # Cargar datos de prueba"
echo "   docker-compose logs -f   # Ver logs de Docker"
echo ""
