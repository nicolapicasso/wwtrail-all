// types/promotion.ts - Promotion types for Cupones y Contenido Exclusivo

/**
 * Promotion type enum
 */
export type PromotionType = 'EXCLUSIVE_CONTENT' | 'COUPON';

/**
 * Promotion status enum (matches PostStatus in backend)
 */
export type PromotionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

/**
 * Language enum
 * Local to this module — the canonical `Language` is re-exported from
 * ./event via the types/v2 barrel. Kept unexported to avoid a barrel name
 * clash (TS2308).
 */
type Language = 'ES' | 'EN' | 'IT' | 'CA' | 'FR' | 'DE';

/**
 * Service Category interface
 * Local to this module — the canonical `ServiceCategory` comes from ./service
 * via the types/v2 barrel. Kept unexported to avoid a barrel name clash.
 */
interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

/**
 * Country interface
 */
export interface PromotionCountry {
  id: string;
  countryCode: string;
}

/**
 * Coupon Code interface
 */
export interface CouponCode {
  id: string;
  code: string;
  isUsed: boolean;
  usedAt?: string;
  usedBy?: string;
}

/**
 * Coupon Statistics interface
 */
export interface CouponStats {
  total: number;
  used: number;
  available: number;
}

/**
 * Base Promotion interface
 */
export interface Promotion {
  id: string;
  type: PromotionType;

  // Common fields
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  gallery?: string[];
  brandUrl?: string;

  // Category
  categoryId?: string;
  category?: ServiceCategory;

  // Language
  language: Language;

  // Countries
  countries?: PromotionCountry[];
  isGlobal: boolean;

  // Type-specific fields
  exclusiveContent?: string; // Only for EXCLUSIVE_CONTENT
  couponStats?: CouponStats; // Only for COUPON
  requiresLogin?: boolean; // Client-side flag for EXCLUSIVE_CONTENT

  // Meta
  status: PromotionStatus;
  viewCount: number;
  featured: boolean;

  // Creator
  createdById: string;
  createdBy?: {
    id: string;
    username: string;
    email: string;
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Promotion creation input
 */
export interface CreatePromotionInput {
  type: PromotionType;
  title: string;
  description: string;
  coverImage?: string;
  gallery?: string[];
  brandUrl?: string;
  categoryId?: string;
  language: Language;
  isGlobal: boolean;
  countries?: string[]; // Array of ISO country codes
  exclusiveContent?: string; // Required if type is EXCLUSIVE_CONTENT
  couponCodes?: string[]; // Required if type is COUPON
  featured?: boolean;
}

/**
 * Promotion update input
 */
export interface UpdatePromotionInput {
  title?: string;
  description?: string;
  coverImage?: string;
  gallery?: string[];
  brandUrl?: string;
  categoryId?: string;
  language?: Language;
  isGlobal?: boolean;
  countries?: string[];
  exclusiveContent?: string;
  featured?: boolean;
  status?: PromotionStatus;
}

/**
 * Promotion filters for queries
 */
export interface PromotionFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: PromotionType;
  categoryId?: string;
  language?: Language;
  country?: string;
  isGlobal?: boolean;
  featured?: boolean;
  status?: PromotionStatus;
  sortBy?: 'title' | 'createdAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Coupon redemption input
 */
export interface RedeemCouponInput {
  userName: string;
  userEmail: string;
}

/**
 * Coupon redemption response
 */
export interface CouponRedemption {
  id: string;
  code: string;
  promotion: {
    title: string;
    description: string;
    brandUrl?: string;
  };
}

/**
 * Add coupon codes input
 */
export interface AddCouponCodesInput {
  codes: string[];
}

/**
 * Coupon analytics interface
 */
export interface CouponAnalytics {
  id: string;
  title: string;
  slug: string;
  totalCodes: number;
  usedCodes: number;
  availableCodes: number;
  redemptions: number;
  viewCount: number;
  status: PromotionStatus;
  createdAt: string;
}

/**
 * API Response types
 */
export interface PromotionsResponse {
  promotions: Promotion[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PromotionResponse {
  status: 'success';
  data: Promotion;
}

export interface CouponRedemptionResponse {
  status: 'success';
  message: string;
  data: CouponRedemption;
}

export interface AddCodesResponse {
  status: 'success';
  message: string;
  data: {
    added: number;
  };
}

export interface CouponAnalyticsResponse {
  status: 'success';
  data: CouponAnalytics[];
}
