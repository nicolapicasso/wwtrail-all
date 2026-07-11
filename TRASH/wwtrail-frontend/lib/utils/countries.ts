// lib/utils/countries.ts

export interface Country {
  code: string;
  name: string;
  nameEs?: string;
  nameEn?: string;
}

export const COUNTRIES: Country[] = [
  { code: 'AD', name: 'Andorra', nameEs: 'Andorra', nameEn: 'Andorra' },
  { code: 'AR', name: 'Argentina', nameEs: 'Argentina', nameEn: 'Argentina' },
  { code: 'AT', name: 'Austria', nameEs: 'Austria', nameEn: 'Austria' },
  { code: 'AU', name: 'Australia', nameEs: 'Australia', nameEn: 'Australia' },
  { code: 'BE', name: 'Bélgica', nameEs: 'Bélgica', nameEn: 'Belgium' },
  { code: 'BR', name: 'Brasil', nameEs: 'Brasil', nameEn: 'Brazil' },
  { code: 'CA', name: 'Canadá', nameEs: 'Canadá', nameEn: 'Canada' },
  { code: 'CH', name: 'Suiza', nameEs: 'Suiza', nameEn: 'Switzerland' },
  { code: 'CL', name: 'Chile', nameEs: 'Chile', nameEn: 'Chile' },
  { code: 'CN', name: 'China', nameEs: 'China', nameEn: 'China' },
  { code: 'CO', name: 'Colombia', nameEs: 'Colombia', nameEn: 'Colombia' },
  { code: 'CZ', name: 'Chequia', nameEs: 'Chequia', nameEn: 'Czech Republic' },
  { code: 'DE', name: 'Alemania', nameEs: 'Alemania', nameEn: 'Germany' },
  { code: 'DK', name: 'Dinamarca', nameEs: 'Dinamarca', nameEn: 'Denmark' },
  { code: 'EC', name: 'Ecuador', nameEs: 'Ecuador', nameEn: 'Ecuador' },
  { code: 'ES', name: 'España', nameEs: 'España', nameEn: 'Spain' },
  { code: 'FI', name: 'Finlandia', nameEs: 'Finlandia', nameEn: 'Finland' },
  { code: 'FR', name: 'Francia', nameEs: 'Francia', nameEn: 'France' },
  { code: 'GB', name: 'Reino Unido', nameEs: 'Reino Unido', nameEn: 'United Kingdom' },
  { code: 'GR', name: 'Grecia', nameEs: 'Grecia', nameEn: 'Greece' },
  { code: 'HU', name: 'Hungría', nameEs: 'Hungría', nameEn: 'Hungary' },
  { code: 'IE', name: 'Irlanda', nameEs: 'Irlanda', nameEn: 'Ireland' },
  { code: 'IT', name: 'Italia', nameEs: 'Italia', nameEn: 'Italy' },
  { code: 'JP', name: 'Japón', nameEs: 'Japón', nameEn: 'Japan' },
  { code: 'KR', name: 'Corea del Sur', nameEs: 'Corea del Sur', nameEn: 'South Korea' },
  { code: 'MA', name: 'Marruecos', nameEs: 'Marruecos', nameEn: 'Morocco' },
  { code: 'MX', name: 'México', nameEs: 'México', nameEn: 'Mexico' },
  { code: 'NL', name: 'Países Bajos', nameEs: 'Países Bajos', nameEn: 'Netherlands' },
  { code: 'NO', name: 'Noruega', nameEs: 'Noruega', nameEn: 'Norway' },
  { code: 'NZ', name: 'Nueva Zelanda', nameEs: 'Nueva Zelanda', nameEn: 'New Zealand' },
  { code: 'PE', name: 'Perú', nameEs: 'Perú', nameEn: 'Peru' },
  { code: 'PL', name: 'Polonia', nameEs: 'Polonia', nameEn: 'Poland' },
  { code: 'PT', name: 'Portugal', nameEs: 'Portugal', nameEn: 'Portugal' },
  { code: 'RO', name: 'Rumanía', nameEs: 'Rumanía', nameEn: 'Romania' },
  { code: 'SE', name: 'Suecia', nameEs: 'Suecia', nameEn: 'Sweden' },
  { code: 'SI', name: 'Eslovenia', nameEs: 'Eslovenia', nameEn: 'Slovenia' },
  { code: 'SK', name: 'Eslovaquia', nameEs: 'Eslovaquia', nameEn: 'Slovakia' },
  { code: 'TR', name: 'Turquía', nameEs: 'Turquía', nameEn: 'Turkey' },
  { code: 'US', name: 'Estados Unidos', nameEs: 'Estados Unidos', nameEn: 'United States' },
  { code: 'UY', name: 'Uruguay', nameEs: 'Uruguay', nameEn: 'Uruguay' },
  { code: 'VE', name: 'Venezuela', nameEs: 'Venezuela', nameEn: 'Venezuela' },
  { code: 'ZA', name: 'Sudáfrica', nameEs: 'Sudáfrica', nameEn: 'South Africa' },
];

/**
 * Obtener el nombre de un país por su código ISO
 */
export function getCountryName(code: string, locale = 'es'): string {
  const country = COUNTRIES.find((c) => c.code === code);
  if (!country) return code;

  if (locale === 'en' && country.nameEn) return country.nameEn;
  if (country.nameEs) return country.nameEs;
  return country.name;
}

/**
 * Obtener el código de bandera emoji de un país
 */
export function getCountryFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
