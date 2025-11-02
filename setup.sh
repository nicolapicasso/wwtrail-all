#!/bin/bash

echo "🚀 WWTRAIL Backend - Quick Setup"
echo "================================"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 20+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
echo ""

# Verificar Docker
echo -e "${BLUE}Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker installed${NC}"
echo ""

# Crear .env si no existe
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env created. Please review the configuration${NC}"
else
    echo -e "${GREEN}✅ .env already exists${NC}"
fi
echo ""

# Instalar dependencias
echo -e "${BLUE}Installing dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Iniciar Docker services
echo -e "${BLUE}Starting Docker services (PostgreSQL + Redis)...${NC}"
docker-compose up -d
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker services started${NC}"
else
    echo -e "${RED}❌ Failed to start Docker services${NC}"
    exit 1
fi
echo ""

# Esperar a que PostgreSQL esté listo
echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Generar Prisma Client
echo -e "${BLUE}Generating Prisma Client...${NC}"
npm run prisma:generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma Client generated${NC}"
else
    echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
    exit 1
fi
echo ""

# Ejecutar migraciones
echo -e "${BLUE}Running database migrations...${NC}"
npm run prisma:migrate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations completed${NC}"
else
    echo -e "${RED}❌ Failed to run migrations${NC}"
    exit 1
fi
echo ""

# Ejecutar seed
echo -e "${BLUE}Seeding database with test data...${NC}"
npm run prisma:seed
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database seeded${NC}"
else
    echo -e "${RED}⚠️  Seed failed (this is optional)${NC}"
fi
echo ""

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}To start the development server:${NC}"
echo -e "  npm run dev"
echo ""
echo -e "${BLUE}API will be available at:${NC}"
echo -e "  http://localhost:3001/api/v1"
echo ""
echo -e "${BLUE}Health check:${NC}"
echo -e "  http://localhost:3001/health"
echo ""
echo -e "${BLUE}Prisma Studio:${NC}"
echo -e "  npm run prisma:studio"
echo ""
echo -e "${BLUE}Test credentials:${NC}"
echo -e "  Admin: admin@wwtrail.com / Admin123"
echo -e "  Organizer: organizer@wwtrail.com / Organizer123"
echo -e "  Athlete: athlete@wwtrail.com / Athlete123"
echo ""
