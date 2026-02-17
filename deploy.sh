#!/bin/bash
# ============================================
# WWTRAIL - Script de despliegue en DigitalOcean
# ============================================
set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  WWTRAIL - Despliegue en DigitalOcean ${NC}"
echo -e "${GREEN}========================================${NC}"

# --- 1. Verificar requisitos ---
echo -e "\n${YELLOW}[1/6] Verificando requisitos...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker no esta instalado. Instalando...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}Docker instalado correctamente.${NC}"
fi

if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}Docker Compose no esta disponible.${NC}"
    exit 1
fi

echo -e "${GREEN}Docker y Docker Compose disponibles.${NC}"

# --- 2. Verificar archivo .env ---
echo -e "\n${YELLOW}[2/6] Verificando configuracion...${NC}"

if [ ! -f .env ]; then
    echo -e "${RED}Archivo .env no encontrado.${NC}"
    echo -e "${YELLOW}Creando desde .env.production.example...${NC}"
    cp .env.production.example .env
    echo -e "${RED}IMPORTANTE: Edita el archivo .env con tus valores reales antes de continuar.${NC}"
    echo -e "${YELLOW}  nano .env${NC}"
    exit 1
fi

echo -e "${GREEN}Archivo .env encontrado.${NC}"

# --- 3. Crear directorios necesarios ---
echo -e "\n${YELLOW}[3/6] Creando directorios...${NC}"

mkdir -p certbot/conf certbot/www
echo -e "${GREEN}Directorios creados.${NC}"

# --- 4. Obtener certificado SSL inicial (si no existe) ---
echo -e "\n${YELLOW}[4/6] Verificando certificados SSL...${NC}"

if [ ! -f certbot/conf/live/*/fullchain.pem ]; then
    echo -e "${YELLOW}No se encontraron certificados SSL.${NC}"
    echo -e "${YELLOW}Iniciando con certificado temporal para obtener el real...${NC}"

    # Crear certificado temporal autofirmado
    mkdir -p certbot/conf
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout certbot/conf/privkey.pem \
        -out certbot/conf/fullchain.pem \
        -subj '/CN=localhost' 2>/dev/null

    echo -e "${GREEN}Certificado temporal creado.${NC}"
    echo -e "${YELLOW}Despues del despliegue, ejecuta el siguiente comando para obtener el certificado real:${NC}"
    echo -e "${YELLOW}  docker compose -f docker-compose.prod.yml run --rm certbot certonly --webroot -w /var/www/certbot -d tu-dominio.com${NC}"
    echo -e "${YELLOW}  docker compose -f docker-compose.prod.yml exec nginx nginx -s reload${NC}"
else
    echo -e "${GREEN}Certificados SSL encontrados.${NC}"
fi

# --- 5. Construir y desplegar ---
echo -e "\n${YELLOW}[5/6] Construyendo imagenes Docker...${NC}"

docker compose -f docker-compose.prod.yml build --no-cache

echo -e "${GREEN}Imagenes construidas correctamente.${NC}"

# --- 6. Iniciar servicios ---
echo -e "\n${YELLOW}[6/6] Iniciando servicios...${NC}"

docker compose -f docker-compose.prod.yml up -d

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Despliegue completado!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Servicios activos:"
echo -e "  Frontend:   https://tu-dominio.com"
echo -e "  Backend:    https://tu-dominio.com/api"
echo -e "  Health:     https://tu-dominio.com/health"
echo ""
echo -e "Comandos utiles:"
echo -e "  Ver logs:             docker compose -f docker-compose.prod.yml logs -f"
echo -e "  Ver logs backend:     docker compose -f docker-compose.prod.yml logs -f backend"
echo -e "  Ver logs frontend:    docker compose -f docker-compose.prod.yml logs -f frontend"
echo -e "  Reiniciar:            docker compose -f docker-compose.prod.yml restart"
echo -e "  Parar:                docker compose -f docker-compose.prod.yml down"
echo -e "  Seed DB:              docker compose -f docker-compose.prod.yml exec backend npx prisma db seed"
echo -e "  Prisma Studio:        docker compose -f docker-compose.prod.yml exec backend npx prisma studio"
echo ""
echo -e "${YELLOW}NOTA: Si es la primera vez, recuerda obtener el certificado SSL real:${NC}"
echo -e "  docker compose -f docker-compose.prod.yml run --rm certbot certonly --webroot -w /var/www/certbot -d tu-dominio.com"
echo -e "  docker compose -f docker-compose.prod.yml exec nginx nginx -s reload"
