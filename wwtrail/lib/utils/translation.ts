// Translation configuration (OpenAI)
import axios from 'axios';
import { Language } from '@prisma/client';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ============================================
// Translation Config
// ============================================

export const TranslationConfig = {
  ENABLED: process.env.AUTO_TRANSLATE_ENABLED !== 'false',
  TARGET_LANGUAGES: (process.env.AUTO_TRANSLATE_LANGUAGES?.split(',') as Language[]) || [
    'EN', 'IT', 'CA', 'FR', 'DE',
  ] as Language[],
  DEFAULT_LANGUAGE: (process.env.DEFAULT_LANGUAGE as Language) || 'ES' as Language,
  OVERWRITE_EXISTING: process.env.AUTO_TRANSLATE_OVERWRITE === 'true',
  BACKGROUND_MODE: process.env.AUTO_TRANSLATE_BACKGROUND !== 'false',
  ONLY_PUBLISHED: process.env.AUTO_TRANSLATE_ONLY_PUBLISHED !== 'false',
};

export function getTargetLanguages(sourceLanguage: Language): Language[] {
  return TranslationConfig.TARGET_LANGUAGES.filter(lang => lang !== sourceLanguage);
}

export function isAutoTranslateEnabled(): boolean {
  return TranslationConfig.ENABLED;
}

export function shouldTranslateByStatus(status: string): boolean {
  if (!TranslationConfig.ONLY_PUBLISHED) return true;
  return status === 'PUBLISHED';
}

export async function translateText(
  text: string,
  targetLanguage: string,
  context?: string
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator specializing in trail running and outdoor sports content. Translate the following text to ${targetLanguage}. ${context || ''} Maintain the tone, formatting (including HTML if present), and technical terminology. Only return the translated text, nothing else.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content.trim();
}

export default { translateText };
