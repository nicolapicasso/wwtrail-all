// Translation configuration (OpenAI)
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
