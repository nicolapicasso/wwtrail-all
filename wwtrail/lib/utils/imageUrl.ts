// lib/utils/imageUrl.ts
// Utilidades para normalizar URLs de imágenes

/**
 * Normaliza una URL de imagen.
 * Si la URL ya es absoluta (http/https), la devuelve sin cambios.
 * Si es relativa, le agrega el dominio de la app.
 */
export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url) return '';

  // Si ya es una URL absoluta, devolverla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Si es relativa, usar la URL base de la app (same-origin)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
}

/**
 * Normaliza un array de URLs de imágenes
 */
export function normalizeImageUrls(urls: (string | undefined | null)[]): string[] {
  return urls.map(normalizeImageUrl).filter(url => url !== '');
}
