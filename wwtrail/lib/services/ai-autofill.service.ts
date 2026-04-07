// lib/services/ai-autofill.service.ts
// Servicio de auto-relleno con IA: extrae información de eventos/competiciones desde una URL

import axios from 'axios';
import logger from '@/lib/utils/logger';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function getOpenAIKey(): Promise<string> {
  try {
    const { SiteConfigService } = await import('@/lib/services/siteConfig.service');
    const key = await SiteConfigService.getOpenAIKey();
    if (key) return key;
  } catch {}
  const envKey = process.env.OPENAI_API_KEY;
  if (envKey) return envKey;
  throw new Error('OPENAI_API_KEY no configurada. Configúrala en Ajustes del Sitio o en variables de entorno.');
}

// Resultado del auto-relleno para eventos
export interface EventAutoFillResult {
  name?: string;
  description?: string;
  city?: string;
  country?: string; // ISO 2-letter code
  website?: string;
  email?: string;
  phone?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  typicalMonth?: number; // 1-12
  firstEditionYear?: number;
  // Competiciones detectadas
  competitions?: CompetitionAutoFillResult[];
  // Imágenes sugeridas
  suggestedImages?: SuggestedImage[];
}

// Resultado del auto-relleno para competiciones
export interface CompetitionAutoFillResult {
  name?: string;
  description?: string;
  type?: 'TRAIL' | 'ULTRA' | 'VERTICAL' | 'SKYRUNNING' | 'CANICROSS' | 'OTHER';
  baseDistance?: number; // km
  baseElevation?: number; // m D+
  baseMaxParticipants?: number;
  itraPoints?: number; // 0-6
  utmbIndex?: string; // INDEX_20K, INDEX_50K, INDEX_100K, INDEX_100M
  // Imágenes sugeridas
  suggestedImages?: SuggestedImage[];
}

export interface SuggestedImage {
  url: string;
  alt?: string;
  type: 'logo' | 'cover' | 'gallery' | 'unknown';
}

/**
 * Extrae el contenido de texto de una página web
 */
async function fetchPageContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WWTRAIL/1.0; +https://wwtrail.com)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'es,en;q=0.9',
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    const html = response.data as string;

    // Extraer imágenes antes de limpiar HTML
    const images = extractImagesFromHtml(html, url);

    // Limpiar HTML: quitar scripts, styles, tags y quedarnos con texto
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#\d+;/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Limitar a ~12000 caracteres para no exceder tokens de OpenAI
    const truncated = textContent.substring(0, 12000);

    // Adjuntar info de imágenes al final
    const imageInfo = images.length > 0
      ? '\n\n[IMAGES FOUND ON PAGE]:\n' + images.map(img => `- ${img.url} (alt: ${img.alt || 'none'})`).join('\n')
      : '';

    return truncated + imageInfo;
  } catch (error: any) {
    logger.error('Error fetching page content:', error.message);
    throw new Error(`No se pudo acceder a la URL: ${error.message}`);
  }
}

/**
 * Extrae URLs de imágenes del HTML
 */
function extractImagesFromHtml(html: string, baseUrl: string): SuggestedImage[] {
  const images: SuggestedImage[] = [];
  const seen = new Set<string>();

  // Extraer <img> tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = resolveUrl(match[1], baseUrl);
    const alt = match[2] || '';
    if (src && !seen.has(src) && isValidImageUrl(src)) {
      seen.add(src);
      images.push({ url: src, alt, type: classifyImage(src, alt) });
    }
  }

  // Extraer og:image y twitter:image meta tags
  const metaRegex = /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
  while ((match = metaRegex.exec(html)) !== null) {
    const src = resolveUrl(match[1], baseUrl);
    if (src && !seen.has(src) && isValidImageUrl(src)) {
      seen.add(src);
      images.push({ url: src, alt: 'Open Graph image', type: 'cover' });
    }
  }

  // Extraer CSS background-image
  const bgRegex = /background-image:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    const src = resolveUrl(match[1], baseUrl);
    if (src && !seen.has(src) && isValidImageUrl(src)) {
      seen.add(src);
      images.push({ url: src, alt: '', type: 'cover' });
    }
  }

  return images;
}

function resolveUrl(src: string, baseUrl: string): string | null {
  try {
    if (src.startsWith('data:')) return null;
    if (src.startsWith('//')) return 'https:' + src;
    if (src.startsWith('http')) return src;
    const base = new URL(baseUrl);
    return new URL(src, base).href;
  } catch {
    return null;
  }
}

function isValidImageUrl(url: string): boolean {
  // Filtrar iconos, tracking pixels, SVGs pequeños
  const lower = url.toLowerCase();
  if (lower.includes('favicon')) return false;
  if (lower.includes('pixel') || lower.includes('tracking')) return false;
  if (lower.includes('1x1') || lower.includes('spacer')) return false;
  if (lower.endsWith('.svg') && lower.includes('icon')) return false;
  if (lower.includes('data:image')) return false;
  return true;
}

function classifyImage(url: string, alt: string): SuggestedImage['type'] {
  const lower = (url + ' ' + alt).toLowerCase();
  if (lower.includes('logo')) return 'logo';
  if (lower.includes('banner') || lower.includes('hero') || lower.includes('cover') || lower.includes('header')) return 'cover';
  if (lower.includes('gallery') || lower.includes('foto') || lower.includes('photo')) return 'gallery';
  return 'unknown';
}

/**
 * Auto-rellena datos de un EVENTO usando IA
 */
export async function autoFillEvent(url: string): Promise<EventAutoFillResult> {
  const apiKey = await getOpenAIKey();

  const pageContent = await fetchPageContent(url);

  const systemPrompt = `You are an expert data extraction assistant for trail running events.
Given the text content of a trail running event website, extract as much structured information as possible.

Return ONLY a valid JSON object with these fields (omit fields where you cannot find reliable information):

{
  "name": "Event name",
  "description": "Detailed description of the event in Spanish. Write a compelling 2-4 paragraph description about the event, its history, terrain, and what makes it special.",
  "city": "City name",
  "country": "ISO 3166-1 alpha-2 country code (e.g., ES, FR, IT, US)",
  "email": "Contact email",
  "phone": "Contact phone",
  "instagramUrl": "Full Instagram URL",
  "facebookUrl": "Full Facebook URL",
  "twitterUrl": "Full Twitter/X URL",
  "youtubeUrl": "Full YouTube URL",
  "typicalMonth": 6,
  "firstEditionYear": 2003,
  "competitions": [
    {
      "name": "Competition name (e.g., Ultra 100K)",
      "description": "Short description in Spanish",
      "type": "TRAIL|ULTRA|VERTICAL|SKYRUNNING|CANICROSS|OTHER",
      "baseDistance": 100,
      "baseElevation": 5000,
      "baseMaxParticipants": 500,
      "itraPoints": 4,
      "utmbIndex": "INDEX_20K|INDEX_50K|INDEX_100K|INDEX_100M"
    }
  ],
  "suggestedImages": [
    {
      "url": "https://...",
      "alt": "description",
      "type": "logo|cover|gallery"
    }
  ]
}

IMPORTANT RULES:
- "type" classification: ULTRA for distances >= 42km, TRAIL for < 42km, VERTICAL for vertical races, SKYRUNNING for skyrunning-labeled races
- "utmbIndex": INDEX_20K for ~20km, INDEX_50K for ~50km, INDEX_100K for ~100km, INDEX_100M for ~100 miles/160km+
- "typicalMonth": month number 1-12 when the event typically takes place
- "country": MUST be ISO 3166-1 alpha-2 code (ES for Spain, FR for France, etc.)
- "description": Write in Spanish, be detailed and engaging
- For competitions, extract ALL race distances/modalities mentioned on the page
- For suggestedImages, include ONLY high-quality images from the [IMAGES FOUND ON PAGE] section. Select the best ones for logo, cover, and gallery. Skip tiny icons, ads, and low-quality images.
- Return ONLY valid JSON, no markdown, no code blocks, no explanations`;

  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Extract trail running event data from this page (URL: ${url}):\n\n${pageContent}` },
      ],
      temperature: 0.2,
      max_tokens: 4000,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  const content = response.data.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('La IA no devolvió contenido');
  }

  try {
    // Limpiar posible markdown wrapper
    const jsonStr = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const result = JSON.parse(jsonStr) as EventAutoFillResult;
    result.website = url;
    return result;
  } catch (parseError) {
    logger.error('Error parsing AI response:', content);
    throw new Error('Error al procesar la respuesta de la IA');
  }
}

/**
 * Auto-rellena datos de una COMPETICIÓN usando IA
 */
export async function autoFillCompetition(url: string): Promise<CompetitionAutoFillResult> {
  const apiKey = await getOpenAIKey();

  const pageContent = await fetchPageContent(url);

  const systemPrompt = `You are an expert data extraction assistant for trail running competitions.
Given the text content of a trail running competition page, extract structured information about this SINGLE competition/race.

Return ONLY a valid JSON object with these fields (omit fields where you cannot find reliable information):

{
  "name": "Competition name (e.g., Ultra Trail 100K)",
  "description": "Detailed description in Spanish. Write a compelling 2-3 paragraph description about the race, its terrain, difficulty, route highlights, and what makes it special.",
  "type": "TRAIL|ULTRA|VERTICAL|SKYRUNNING|CANICROSS|OTHER",
  "baseDistance": 100,
  "baseElevation": 5000,
  "baseMaxParticipants": 500,
  "itraPoints": 4,
  "utmbIndex": "INDEX_20K|INDEX_50K|INDEX_100K|INDEX_100M",
  "suggestedImages": [
    {
      "url": "https://...",
      "alt": "description",
      "type": "logo|cover|gallery"
    }
  ]
}

IMPORTANT RULES:
- "type": ULTRA for >= 42km, TRAIL for < 42km, VERTICAL for vertical races, SKYRUNNING for skyrunning-labeled races
- "utmbIndex": INDEX_20K for ~20km, INDEX_50K for ~50km, INDEX_100K for ~100km, INDEX_100M for ~100 miles/160km+
- "baseDistance": in kilometers
- "baseElevation": elevation gain in meters (D+)
- "itraPoints": 0-6 scale
- "description": Write in Spanish, detailed and engaging
- For suggestedImages, include ONLY high-quality images from the [IMAGES FOUND ON PAGE] section
- Return ONLY valid JSON, no markdown, no code blocks, no explanations`;

  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Extract trail running competition data from this page (URL: ${url}):\n\n${pageContent}` },
      ],
      temperature: 0.2,
      max_tokens: 3000,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  const content = response.data.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('La IA no devolvió contenido');
  }

  try {
    const jsonStr = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    return JSON.parse(jsonStr) as CompetitionAutoFillResult;
  } catch (parseError) {
    logger.error('Error parsing AI response:', content);
    throw new Error('Error al procesar la respuesta de la IA');
  }
}
