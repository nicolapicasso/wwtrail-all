// lib/api/v2/translations.service.ts
// Service for managing translations via AI

import apiClientV2 from '../client-v2';

export type TranslatableEntityType =
  | 'event'
  | 'competition'
  | 'post'
  | 'service'
  | 'special-series';

interface TranslationResponse {
  status: string;
  message: string;
  data?: {
    translations: Record<string, any>;
    entityId: string;
    entityType: string;
  };
}

interface EntityStats {
  total: number;
  withTranslations: number;
  missingTranslations: number;
}

interface TranslationStatsResponse {
  status: string;
  data: {
    events: EntityStats;
    competitions: EntityStats;
    posts: EntityStats;
    services: EntityStats;
    promotions: EntityStats;
    specialSeries: EntityStats;
  };
}

interface BulkTranslationResponse {
  status: string;
  message: string;
  data: {
    entityType: string;
    translated: number;
    errors: number;
    targetLanguages: string[];
  };
}

class TranslationsService {
  /**
   * Generate translations for an event
   */
  async translateEvent(eventId: string): Promise<TranslationResponse> {
    const response = await apiClientV2.post<TranslationResponse>(
      `/translations/event/${eventId}`
    );
    return response.data;
  }

  /**
   * Generate translations for a competition
   */
  async translateCompetition(competitionId: string): Promise<TranslationResponse> {
    const response = await apiClientV2.post<TranslationResponse>(
      `/translations/competition/${competitionId}`
    );
    return response.data;
  }

  /**
   * Generate translations for a post
   */
  async translatePost(postId: string): Promise<TranslationResponse> {
    const response = await apiClientV2.post<TranslationResponse>(
      `/translations/post/${postId}`
    );
    return response.data;
  }

  /**
   * Generate translations for a service
   */
  async translateService(serviceId: string): Promise<TranslationResponse> {
    const response = await apiClientV2.post<TranslationResponse>(
      `/translations/service/${serviceId}`
    );
    return response.data;
  }

  /**
   * Generate translations for a special series
   */
  async translateSpecialSeries(specialSeriesId: string): Promise<TranslationResponse> {
    const response = await apiClientV2.post<TranslationResponse>(
      `/translations/special-series/${specialSeriesId}`
    );
    return response.data;
  }

  /**
   * Generic translate method for any supported entity type
   */
  async translate(entityType: TranslatableEntityType, entityId: string): Promise<TranslationResponse> {
    switch (entityType) {
      case 'event':
        return this.translateEvent(entityId);
      case 'competition':
        return this.translateCompetition(entityId);
      case 'post':
        return this.translatePost(entityId);
      case 'service':
        return this.translateService(entityId);
      case 'special-series':
        return this.translateSpecialSeries(entityId);
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }

  /**
   * Get translation statistics for all entity types (admin only)
   */
  async getStats(): Promise<TranslationStatsResponse> {
    const response = await apiClientV2.get<TranslationStatsResponse>('/translations/bulk/status');
    return response.data;
  }

  /**
   * Bulk translate all pending entities of a specific type (admin only)
   */
  async bulkTranslate(entityType: string): Promise<BulkTranslationResponse> {
    const response = await apiClientV2.post<BulkTranslationResponse>('/translations/bulk/generate', {
      entityType,
    });
    return response.data;
  }

  /**
   * Bulk translate all pending entities of all types (admin only)
   */
  async bulkTranslateAll(): Promise<BulkTranslationResponse[]> {
    const entityTypes = ['event', 'competition', 'post', 'service', 'promotion', 'specialSeries'];
    const results: BulkTranslationResponse[] = [];

    for (const entityType of entityTypes) {
      try {
        const result = await this.bulkTranslate(entityType);
        results.push(result);
      } catch (error) {
        console.error(`Error bulk translating ${entityType}:`, error);
      }
    }

    return results;
  }

  /**
   * Get translations for a competition
   */
  async getCompetitionTranslations(competitionId: string): Promise<any> {
    const response = await apiClientV2.get(`/translations/competition/${competitionId}`);
    return response.data;
  }

  /**
   * Get translations for a post
   */
  async getPostTranslations(postId: string): Promise<any> {
    const response = await apiClientV2.get(`/translations/post/${postId}`);
    return response.data;
  }
}

const translationsService = new TranslationsService();
export default translationsService;
