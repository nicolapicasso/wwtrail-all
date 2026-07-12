// lib/utils/imageUrl.ts
// Utilidades para normalizar URLs de imágenes.
//
// Importante: cuando una subida llega a Spaces, el backend (uploadToSpaces)
// devuelve y almacena SIEMPRE una URL absoluta del CDN. Por tanto, una ruta
// relativa /uploads/* en la base de datos significa SIEMPRE que el archivo
// está en el disco local de la app (fallback), nunca en el CDN. Reescribir
// esas rutas al CDN produciría 404 (el archivo no existe allí). Por eso las
// rutas /uploads/* se sirven siempre desde el mismo origen de la app, igual
// que las ve el backoffice.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

const LOCALHOST_PATTERNS = ['http://localhost:3001', 'http://localhost:3000'];

/** Resuelve una ruta /uploads/... contra el mismo origen (disco de la app). */
function resolveUploadPath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${APP_URL}${p}`;
}

/**
 * Normaliza una URL de imagen.
 * - URLs absolutas (http/https) se devuelven tal cual.
 * - Rutas /uploads/... apuntan a Spaces (si está activo) o al mismo origen.
 * - Otras rutas relativas usan la URL base de la app.
 */
export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url) return '';

  // Fix legacy localhost URLs stored in the database
  for (const pattern of LOCALHOST_PATTERNS) {
    if (url.startsWith(pattern)) {
      const relativePath = url.substring(pattern.length);
      if (relativePath.startsWith('/uploads/')) {
        return resolveUploadPath(relativePath);
      }
      return `${APP_URL}${relativePath}`;
    }
  }

  // Si ya es una URL absoluta, devolverla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Si es una ruta de uploads, resolver según el backend de almacenamiento
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    return resolveUploadPath(url);
  }

  // Si es relativa, usar la URL base de la app (same-origin)
  return `${APP_URL}${url.startsWith('/') ? url : '/' + url}`;
}

/**
 * Normaliza un array de URLs de imágenes
 */
export function normalizeImageUrls(urls: (string | undefined | null)[]): string[] {
  return urls.map(normalizeImageUrl).filter((url) => url !== '');
}
