/**
 * Utility functions for handling multilanguage translations
 */

import { Language } from '@prisma/client';

export interface Translatable {
  language: Language;
  translations?: Array<{
    language: Language;
    name?: string;
    title?: string;
    description?: string;
    [key: string]: any;
  }>;
  name?: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

/**
 * Apply translations to an entity based on requested language
 * If translation exists for requested language, replace name/description
 * Otherwise, keep original fields
 */
export function applyTranslations<T extends Translatable>(
  entity: T,
  requestedLanguage: Language
): T {
  // If no translations or requesting original language, return as is
  if (!entity.translations || entity.language === requestedLanguage) {
    return entity;
  }

  // Find translation for requested language
  const translation = entity.translations.find(
    (t) => t.language === requestedLanguage
  );

  if (!translation) {
    // No translation found, return original
    return entity;
  }

  // Apply translation fields
  const translated = { ...entity };

  if (translation.name) translated.name = translation.name;
  if (translation.title) translated.title = translation.title;
  if (translation.description) translated.description = translation.description;

  return translated;
}

/**
 * Apply translations to an array of entities
 */
export function applyTranslationsToList<T extends Translatable>(
  entities: T[],
  requestedLanguage: Language
): T[] {
  return entities.map((entity) => applyTranslations(entity, requestedLanguage));
}

/**
 * Parse language string to Language enum
 * Defaults to ES if invalid
 */
export function parseLanguage(lang?: string): Language {
  if (!lang) return Language.ES;

  const upperLang = lang.toUpperCase();

  // Check if it's a valid Language enum value
  if (Object.values(Language).includes(upperLang as Language)) {
    return upperLang as Language;
  }

  return Language.ES;
}
