// src/utils/slugify.ts
import prisma from '@/lib/db';

/**
 * Convierte un string a formato slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Espacios a guiones
    .replace(/[^\w\-]+/g, '')       // Eliminar caracteres especiales
    .replace(/\-\-+/g, '-')         // Múltiples guiones a uno
    .replace(/^-+/, '')             // Eliminar guiones al inicio
    .replace(/-+$/, '');            // Eliminar guiones al final
}

/**
 * Genera un slug único verificando en la base de datos
 */
export async function generateUniqueSlug(
  name: string,
  type: 'event' | 'competition' | 'edition' | 'service' | 'service-category' | 'special-series' = 'event',
  currentSlug?: string
): Promise<string> {
  let slug = slugify(name);

  // If the generated slug matches the current slug, no need to change
  if (currentSlug && slug === currentSlug) {
    return slug;
  }

  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const testSlug = counter === 1 ? slug : `${slug}-${counter}`;

    // If testSlug matches currentSlug, it's available (it's ours)
    if (currentSlug && testSlug === currentSlug) {
      slug = testSlug;
      isUnique = true;
      break;
    }

    // Verificar si existe en la tabla correspondiente
    let exists;

    switch (type) {
      case 'event':
        exists = await prisma.event.findUnique({
          where: { slug: testSlug },
        });
        break;

      case 'competition':
        exists = await prisma.competition.findUnique({
          where: { slug: testSlug },
        });
        break;

      case 'edition':
        exists = await prisma.edition.findUnique({
          where: { slug: testSlug },
        });
        break;

      case 'service':
        exists = await prisma.service.findUnique({
          where: { slug: testSlug },
        });
        break;

      case 'service-category':
        exists = await prisma.serviceCategory.findUnique({
          where: { slug: testSlug },
        });
        break;

      case 'special-series':
        exists = await prisma.specialSeries.findUnique({
          where: { slug: testSlug },
        });
        break;
    }

    if (!exists) {
      slug = testSlug;
      isUnique = true;
    } else {
      counter++;
    }
  }

  return slug;
}
