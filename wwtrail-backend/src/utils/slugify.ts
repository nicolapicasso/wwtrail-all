// src/utils/slugify.ts
import prisma from '../config/database';

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
  type: 'event' | 'competition' | 'edition' = 'event'
): Promise<string> {
  let slug = slugify(name);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const testSlug = counter === 1 ? slug : `${slug}-${counter}`;

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
