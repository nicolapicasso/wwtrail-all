// lib/api/v2/aiAutofill.service.ts
import { apiClientV2 } from '../client';

export interface EventAutoFillResult {
  name?: string;
  description?: string;
  city?: string;
  country?: string;
  website?: string;
  email?: string;
  phone?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  typicalMonth?: number;
  firstEditionYear?: number;
  competitions?: CompetitionAutoFillResult[];
  suggestedImages?: SuggestedImage[];
}

export interface CompetitionAutoFillResult {
  name?: string;
  description?: string;
  type?: string;
  baseDistance?: number;
  baseElevation?: number;
  baseMaxParticipants?: number;
  itraPoints?: number;
  utmbIndex?: string;
  suggestedImages?: SuggestedImage[];
}

export interface SuggestedImage {
  url: string;
  alt?: string;
  type: 'logo' | 'cover' | 'gallery' | 'unknown';
}

export interface EditionAutoFillResult {
  year?: number;
  startDate?: string;
  endDate?: string;
  registrationOpenDate?: string;
  registrationCloseDate?: string;
  registrationUrl?: string;
  distance?: number;
  elevation?: number;
  maxParticipants?: number;
  prices?: { early?: number; normal?: number; late?: number };
  notes?: string;
  error?: string;
}

export interface EditionAutoFillContext {
  competitionName?: string;
  eventName?: string;
  baseDistance?: number | null;
  baseElevation?: number | null;
}

class AiAutofillService {
  async autofillEvent(url: string): Promise<EventAutoFillResult> {
    const response = await apiClientV2.post('/ai-autofill', { url, type: 'event' });
    return response.data.data;
  }

  async autofillCompetition(url: string): Promise<CompetitionAutoFillResult> {
    const response = await apiClientV2.post('/ai-autofill', { url, type: 'competition' });
    return response.data.data;
  }

  async autofillEdition(url: string, year: number, context: EditionAutoFillContext): Promise<EditionAutoFillResult> {
    const response = await apiClientV2.post('/ai-autofill', { url, type: 'edition', year, context });
    return response.data.data;
  }
}

export default new AiAutofillService();
