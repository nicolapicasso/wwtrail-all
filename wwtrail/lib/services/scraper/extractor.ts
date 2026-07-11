// lib/services/scraper/extractor.ts
// AI-assisted extraction: turns cleaned page text into a normalized event graph
// (event + competitions + editions) using OpenAI, reusing the same OpenAI access
// pattern as the translation service.

import axios from 'axios';
import { z } from 'zod';
import logger from '@/lib/utils/logger';
import type { ScrapedGraph } from './types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MAX_INPUT_CHARS = 24000; // keep the prompt bounded

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

const editionSchema = z.object({
  year: z.number().int(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  distance: z.number().nullish(),
  elevation: z.number().nullish(),
  registrationUrl: z.string().nullish(),
});

const competitionSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullish(),
  type: z.string().nullish(),
  baseDistance: z.number().nullish(),
  baseElevation: z.number().nullish(),
  itraPoints: z.number().nullish(),
  editions: z.array(editionSchema).default([]),
});

const graphSchema = z.object({
  event: z.object({
    name: z.string().min(1),
    country: z.string().nullish(),
    city: z.string().nullish(),
    website: z.string().nullish(),
    description: z.string().nullish(),
    typicalMonth: z.number().int().min(1).max(12).nullish(),
    firstEditionYear: z.number().int().nullish(),
  }),
  competitions: z.array(competitionSchema).default([]),
});

const SYSTEM_PROMPT = `Eres un extractor de datos experto en carreras de trail running.
A partir del texto de una página web, identifica UN evento de trail (la carrera/festival principal) y sus competiciones (las distintas distancias/modalidades), con sus ediciones por año si aparecen.

Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta forma exacta:
{
  "event": {
    "name": string,                       // nombre del evento/festival
    "country": string|null,               // código ISO-2 en mayúsculas (ES, IT, FR, ...). Dedúcelo de la ubicación.
    "city": string|null,
    "website": string|null,
    "description": string|null,           // 1-3 frases
    "typicalMonth": number|null,          // 1-12, mes habitual de celebración
    "firstEditionYear": number|null
  },
  "competitions": [
    {
      "name": string,                     // p.ej. "Ultra 100K", "Marathon", "Vertical"
      "description": string|null,
      "type": string|null,                // TRAIL, ULTRA, MARATHON, VERTICAL, KV, SKY, etc. (o null)
      "baseDistance": number|null,        // km (número, sin unidad)
      "baseElevation": number|null,       // desnivel positivo en metros (número)
      "itraPoints": number|null,          // 0-6 si se menciona
      "editions": [
        { "year": number, "startDate": "YYYY-MM-DD"|null, "endDate": "YYYY-MM-DD"|null, "distance": number|null, "elevation": number|null, "registrationUrl": string|null }
      ]
    }
  ]
}

Reglas:
- No inventes datos: usa null cuando no haya información. No rellenes distancias/desniveles a ojo.
- Distancias en km y desniveles en metros como NÚMEROS.
- Si el texto no describe ninguna carrera de trail, devuelve { "event": { "name": "" }, "competitions": [] }.
- Responde SOLO con el JSON, sin explicaciones ni markdown.`;

export async function extractGraph(text: string, sourceUrl?: string | null): Promise<ScrapedGraph> {
  const apiKey = await getOpenAIKey();
  const clipped = text.slice(0, MAX_INPUT_CHARS);

  const userContent = `${sourceUrl ? `URL de origen: ${sourceUrl}\n\n` : ''}Texto de la página:\n"""\n${clipped}\n"""`;

  let raw: string;
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
        temperature: 0.1,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` } }
    );
    raw = response.data.choices[0]?.message?.content?.trim() || '';
  } catch (error: any) {
    logger.error('Scraper OpenAI error:', error.response?.data || error.message);
    throw new Error(`Error extrayendo con IA: ${error.response?.data?.error?.message || error.message}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('La IA no devolvió un JSON válido.');
  }

  const result = graphSchema.safeParse(parsed);
  if (!result.success) {
    logger.error('Scraper schema validation failed:', result.error.flatten());
    throw new Error('La estructura extraída no es válida.');
  }

  const data = result.data;
  // Normalize country to uppercase ISO-2.
  const country = data.event.country ? data.event.country.trim().toUpperCase().slice(0, 2) : null;

  return {
    event: {
      name: data.event.name.trim(),
      country: country || null,
      city: data.event.city ?? null,
      website: data.event.website ?? null,
      description: data.event.description ?? null,
      typicalMonth: data.event.typicalMonth ?? null,
      firstEditionYear: data.event.firstEditionYear ?? null,
    },
    competitions: data.competitions.map((c) => ({
      name: c.name.trim(),
      description: c.description ?? null,
      type: c.type ?? null,
      baseDistance: c.baseDistance ?? null,
      baseElevation: c.baseElevation ?? null,
      itraPoints: c.itraPoints ?? null,
      editions: (c.editions || []).map((e) => ({
        year: e.year,
        startDate: e.startDate ?? null,
        endDate: e.endDate ?? null,
        distance: e.distance ?? null,
        elevation: e.elevation ?? null,
        registrationUrl: e.registrationUrl ?? null,
      })),
    })),
  };
}
