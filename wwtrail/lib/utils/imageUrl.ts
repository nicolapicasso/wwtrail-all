// lib/utils/imageUrl.ts
// Utilidades para normalizar URLs de imágenes.
//
// Importante: la reescritura de rutas /uploads/* hacia el CDN de Spaces solo
// ocurre cuando el almacenamiento en Spaces está EXPLÍCITAMENTE activo, vía
// NEXT_PUBLIC_STORAGE_TYPE === 'spaces'. Así el cliente coincide con el backend
// (que sube a Spaces solo cuando isSpacesConfigured()). Si Spaces no está
// activo, las rutas /uploads/* se sirven desde el mismo origen (disco de la
// app), que es donde realmente están los archivos.

const SPACES_URL = process.env.NEXT_PUBLIC_SPACES_URL || 'https://wwtrail-uploads.fra1.cdn.digitaloceanspaces.com';
const USE_SPACES = process.env.NEXT_PUBLIC_STORAGE_TYPE === 'spaces';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

const LOCALHOST_PATTERNS = ['http://localhost:3001', 'http://localhost:3000'];

/** Resuelve una ruta /uploads/... al backend correcto (Spaces o mismo origen). */
function resolveUploadPath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return USE_SPACES ? `${SPACES_URL}${p}` : `${APP_URL}${p}`;
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
