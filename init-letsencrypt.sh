#!/bin/bash
# ============================================
# Script para obtener certificados SSL iniciales
# Ejecutar UNA SOLA VEZ en el servidor
# ============================================

set -e

DOMAINS="wwtrail.com api.wwtrail.com"
EMAIL="${1:-admin@wwtrail.com}"

echo "==> Creando directorios para Certbot..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

echo "==> Descargando parametros SSL recomendados..."
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > ./certbot/conf/options-ssl-nginx.conf
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > ./certbot/conf/ssl-dhparams.pem

echo "==> Creando certificado temporal (dummy) para arrancar Nginx..."
mkdir -p ./certbot/conf/live/wwtrail.com
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout ./certbot/conf/live/wwtrail.com/privkey.pem \
  -out ./certbot/conf/live/wwtrail.com/fullchain.pem \
  -subj '/CN=localhost'

echo "==> Arrancando Nginx con certificado temporal..."
docker compose up -d nginx

echo "==> Eliminando certificado temporal..."
rm -rf ./certbot/conf/live/wwtrail.com

echo "==> Solicitando certificado real a Let's Encrypt..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d wwtrail.com \
  -d api.wwtrail.com

echo "==> Recargando Nginx con el certificado real..."
docker compose exec nginx nginx -s reload

echo ""
echo "==> SSL configurado correctamente!"
echo "==> Los certificados se renovaran automaticamente."
