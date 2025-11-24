// lib/api/footer.service.ts
import api from './axios';

export interface FooterContent {
  leftColumn: string | null;
  centerColumn: string | null;
  rightColumn: string | null;
}

export interface Footer {
  id: string;
  leftColumnES: string | null;
  leftColumnEN: string | null;
  leftColumnIT: string | null;
  leftColumnCA: string | null;
  leftColumnFR: string | null;
  leftColumnDE: string | null;
  centerColumnES: string | null;
  centerColumnEN: string | null;
  centerColumnIT: string | null;
  centerColumnCA: string | null;
  centerColumnFR: string | null;
  centerColumnDE: string | null;
  rightColumnES: string | null;
  rightColumnEN: string | null;
  rightColumnIT: string | null;
  rightColumnCA: string | null;
  rightColumnFR: string | null;
  rightColumnDE: string | null;
  createdAt: string;
  updatedAt: string;
}

class FooterService {
  /**
   * Get footer configuration (admin only)
   */
  async getFooter(): Promise<Footer> {
    const response = await api.get('/footer');
    return response.data;
  }

  /**
   * Get footer content for specific language (public)
   */
  async getPublicFooter(language: string): Promise<FooterContent> {
    const response = await api.get(`/footer/public?language=${language}`);
    return response.data;
  }

  /**
   * Update footer configuration (admin only)
   */
  async updateFooter(data: Partial<Footer>): Promise<Footer> {
    const response = await api.put('/footer', data);
    return response.data.data;
  }
}

export const footerService = new FooterService();
export default footerService;
