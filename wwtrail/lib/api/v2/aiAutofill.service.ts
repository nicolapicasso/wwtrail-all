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

class AiAutofillService {
  async autofillEvent(url: string): Promise<EventAutoFillResult> {
    const response = await apiClientV2.post('/ai-autofill', { url, type: 'event' });
    return response.data.data;
  }

  async autofillCompetition(url: string): Promise<CompetitionAutoFillResult> {
    const response = await apiClientV2.post('/ai-autofill', { url, type: 'competition' });
    return response.data.data;
  }
}

export default new AiAutofillService();
