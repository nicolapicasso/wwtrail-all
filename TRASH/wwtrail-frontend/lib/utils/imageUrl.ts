// lib/utils/imageUrl.ts
// Utilidades para normalizar URLs de imágenes del backend

const BACKEND_URL = 'http://localhost:3001';

/**
 * Normaliza una URL de imagen para que apunte al backend
 * Si la URL ya es absoluta (http/https), la devuelve sin cambios
 * Si es relativa, le agrega el dominio del backend
 */
export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url) return '';

  // Si ya es una URL absoluta, devolverla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Si es relativa, agregar el backend URL
  return `${BACKEND_URL}${url.startsWith('/') ? url : '/' + url}`;
}

/**
 * Normaliza un array de URLs de imágenes
 */
export function normalizeImageUrls(urls: (string | undefined | null)[]): string[] {
  return urls.map(normalizeImageUrl).filter(url => url !== '');
}
