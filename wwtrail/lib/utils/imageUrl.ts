// lib/utils/imageUrl.ts
// Utilidades para normalizar URLs de imágenes

const SPACES_URL = process.env.NEXT_PUBLIC_SPACES_URL || 'https://wwtrail-uploads.fra1.cdn.digitaloceanspaces.com';

/**
 * Normaliza una URL de imagen.
 * Si la URL ya es absoluta (http/https), la devuelve sin cambios.
 * Si es relativa y empieza con /uploads, apunta al CDN de Spaces.
 * Si es relativa, le agrega el dominio de la app.
 */
const LOCALHOST_PATTERNS = ['http://localhost:3001', 'http://localhost:3000'];

export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url) return '';

  // Fix legacy localhost URLs stored in the database
  for (const pattern of LOCALHOST_PATTERNS) {
    if (url.startsWith(pattern)) {
      const relativePath = url.substring(pattern.length);
      if (relativePath.startsWith('/uploads/')) {
        return `${SPACES_URL}${relativePath}`;
      }
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      return `${baseUrl}${relativePath}`;
    }
  }

  // Si ya es una URL absoluta, devolverla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Si es una ruta de uploads, apuntar al CDN de Spaces
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${SPACES_URL}${path}`;
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
