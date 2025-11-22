// src/config/translation.config.ts
import { Language } from '@prisma/client';

/**
 * Configuración global del sistema de traducciones automáticas
 */
export const TranslationConfig = {
  /**
   * Habilitar/deshabilitar traducciones automáticas globalmente
   */
  ENABLED: process.env.AUTO_TRANSLATE_ENABLED !== 'false', // true por defecto

  /**
   * Idiomas objetivo para traducciones automáticas
   * Se traducirá automáticamente a todos estos idiomas cuando se publique contenido
   */
  TARGET_LANGUAGES: (process.env.AUTO_TRANSLATE_LANGUAGES?.split(',') as Language[]) || [
    'EN',
    'IT',
    'CA',
    'FR',
    'DE',
  ] as Language[],

  /**
   * Idioma por defecto/principal (no se auto-traduce a sí mismo)
   */
  DEFAULT_LANGUAGE: (process.env.DEFAULT_LANGUAGE as Language) || 'ES' as Language,

  /**
   * Si sobrescribir traducciones existentes al auto-traducir
   */
  OVERWRITE_EXISTING: process.env.AUTO_TRANSLATE_OVERWRITE === 'true', // false por defecto

  /**
   * Traducir en background (no bloqueante)
   * Si es true, la traducción se hace sin esperar a que termine
   * Si es false, espera a que termine la traducción antes de devolver respuesta
   */
  BACKGROUND_MODE: process.env.AUTO_TRANSLATE_BACKGROUND !== 'false', // true por defecto

  /**
   * Solo traducir contenido con status PUBLISHED
   * Si es false, también traduce contenido en DRAFT
   */
  ONLY_PUBLISHED: process.env.AUTO_TRANSLATE_ONLY_PUBLISHED !== 'false', // true por defecto
};

/**
 * Obtener idiomas objetivo excluyendo el idioma fuente
 */
export function getTargetLanguages(sourceLanguage: Language): Language[] {
  return TranslationConfig.TARGET_LANGUAGES.filter(lang => lang !== sourceLanguage);
}

/**
 * Verificar si las traducciones automáticas están habilitadas
 */
export function isAutoTranslateEnabled(): boolean {
  return TranslationConfig.ENABLED;
}

/**
 * Verificar si debe traducirse según el status
 */
export function shouldTranslateByStatus(status: string): boolean {
  if (!TranslationConfig.ONLY_PUBLISHED) {
    return true; // Traducir siempre
  }
  return status === 'PUBLISHED';
}
