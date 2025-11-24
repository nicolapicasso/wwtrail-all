// lib/api/landing.service.ts
import api from './axios';
import { Language } from '@/types/v2';

export interface Landing {
  id: string;
  title: string;
  slug: string;
  language: Language;
  coverImage: string | null;
  gallery: string[];
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
  };
  translations?: LandingTranslation[];
  translatedLanguage?: Language;
}

export interface LandingTranslation {
  id: string;
  landingId: string;
  language: Language;
  title: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLandingInput {
  title: string;
  slug?: string;
  language?: Language;
  coverImage?: string | null;
  gallery?: string[];
  content: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface UpdateLandingInput {
  title?: string;
  slug?: string;
  coverImage?: string | null;
  gallery?: string[];
  content?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface GetLandingsParams {
  page?: number;
  limit?: number;
  search?: string;
  language?: Language;
}

export interface GetLandingsResponse {
  data: Landing[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class LandingService {
  /**
   * Get all landings (admin only)
   */
  async getAll(params?: GetLandingsParams): Promise<GetLandingsResponse> {
    const response = await api.get('/landings', { params });
    return response.data;
  }

  /**
   * Get landing by ID (admin only)
   */
  async getById(id: string): Promise<Landing> {
    const response = await api.get(`/landings/${id}`);
    return response.data;
  }

  /**
   * Get landing by slug (public)
   */
  async getBySlug(slug: string, language?: Language): Promise<Landing> {
    const params = language ? { language } : {};
    const response = await api.get(`/landings/slug/${slug}`, { params });
    return response.data;
  }

  /**
   * Create new landing (admin only)
   */
  async create(data: CreateLandingInput): Promise<Landing> {
    const response = await api.post('/landings', data);
    return response.data.data;
  }

  /**
   * Update landing (admin only)
   */
  async update(id: string, data: UpdateLandingInput): Promise<Landing> {
    const response = await api.put(`/landings/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete landing (admin only)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/landings/${id}`);
  }

  /**
   * Auto-translate landing (admin only)
   */
  async translate(
    id: string,
    targetLanguages: Language[],
    overwrite = false
  ): Promise<LandingTranslation[]> {
    const response = await api.post(`/landings/${id}/translate`, {
      targetLanguages,
      overwrite,
    });
    return response.data.data;
  }
}

export const landingService = new LandingService();
export default landingService;
