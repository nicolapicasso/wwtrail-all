import apiClientV2 from '../client-v2';
import {
  Promotion,
  PromotionsResponse,
  PromotionResponse,
  CouponRedemptionResponse,
  AddCodesResponse,
  CouponAnalyticsResponse,
  CreatePromotionInput,
  UpdatePromotionInput,
  PromotionFilters,
  RedeemCouponInput,
  AddCouponCodesInput,
} from '@/types/v2';

class PromotionsService {
  /**
   * Get all promotions (public, shows only PUBLISHED for non-admin)
   */
  async getAll(filters?: PromotionFilters): Promise<PromotionsResponse> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.language) params.append('language', filters.language);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.isGlobal !== undefined) params.append('isGlobal', filters.isGlobal.toString());
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClientV2.get<PromotionsResponse>(`/promotions?${params.toString()}`);
    return response.data;
  }

  /**
   * Get promotion by ID or slug
   */
  async getByIdOrSlug(idOrSlug: string): Promise<PromotionResponse> {
    const response = await apiClientV2.get<PromotionResponse>(`/promotions/${idOrSlug}`);
    return response.data;
  }

  /**
   * Create promotion (admin only)
   */
  async create(data: CreatePromotionInput): Promise<PromotionResponse> {
    const response = await apiClientV2.post<PromotionResponse>('/promotions', data);
    return response.data;
  }

  /**
   * Update promotion (admin only)
   */
  async update(id: string, data: UpdatePromotionInput): Promise<PromotionResponse> {
    const response = await apiClientV2.put<PromotionResponse>(`/promotions/${id}`, data);
    return response.data;
  }

  /**
   * Partial update promotion (admin only)
   */
  async patch(id: string, data: UpdatePromotionInput): Promise<PromotionResponse> {
    const response = await apiClientV2.patch<PromotionResponse>(`/promotions/${id}`, data);
    return response.data;
  }

  /**
   * Delete promotion (admin only)
   */
  async delete(id: string): Promise<{ status: string; message: string }> {
    const response = await apiClientV2.delete<{ status: string; message: string }>(`/promotions/${id}`);
    return response.data;
  }

  /**
   * Redeem coupon (public - requires name + email)
   */
  async redeemCoupon(id: string, data: RedeemCouponInput): Promise<CouponRedemptionResponse> {
    const response = await apiClientV2.post<CouponRedemptionResponse>(`/promotions/${id}/redeem`, data);
    return response.data;
  }

  /**
   * Add coupon codes to existing promotion (admin only)
   */
  async addCouponCodes(id: string, data: AddCouponCodesInput): Promise<AddCodesResponse> {
    const response = await apiClientV2.post<AddCodesResponse>(`/promotions/${id}/codes`, data);
    return response.data;
  }

  /**
   * Get coupon analytics (admin only)
   * @param promotionId Optional - if provided, get analytics for specific promotion
   */
  async getCouponAnalytics(promotionId?: string): Promise<CouponAnalyticsResponse> {
    const url = promotionId
      ? `/promotions/analytics/coupons?promotionId=${promotionId}`
      : '/promotions/analytics/coupons';

    const response = await apiClientV2.get<CouponAnalyticsResponse>(url);
    return response.data;
  }

  /**
   * Upload coupon codes from CSV/text
   * Helper method to parse and add codes
   */
  async uploadCouponCodes(id: string, text: string): Promise<AddCodesResponse> {
    // Split by newlines and commas, trim whitespace, remove empty lines
    const codes = text
      .split(/[\n,]/)
      .map(code => code.trim())
      .filter(code => code.length > 0);

    if (codes.length === 0) {
      throw new Error('No valid coupon codes found');
    }

    return this.addCouponCodes(id, { codes });
  }
}

export default new PromotionsService();
