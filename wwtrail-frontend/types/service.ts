// types/service.ts - Service types for Servicios module

import { User } from './auth';

/**
 * Service status enum (matches EventStatus in backend)
 */
export type ServiceStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';

/**
 * Base Service interface
 */
export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string; // Free-form category (alojamientos, restaurantes, tiendas, etc.)

  // Location
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;

  // Images
  logoUrl?: string;
  coverImage?: string;
  gallery?: string[];

  // Meta
  organizerId: string;
  organizer?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  status: ServiceStatus;
  viewCount: number;
  featured: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Service creation input
 */
export interface CreateServiceInput {
  name: string;
  description?: string;
  category: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  coverImage?: string;
  gallery?: string[];
  featured?: boolean;
}

/**
 * Service update input
 */
export interface UpdateServiceInput {
  name?: string;
  description?: string;
  category?: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  coverImage?: string;
  gallery?: string[];
  featured?: boolean;
  status?: ServiceStatus;
}

/**
 * Service filters for queries
 */
export interface ServiceFilters {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  city?: string;
  category?: string;
  featured?: boolean;
  status?: ServiceStatus;
  sortBy?: 'name' | 'createdAt' | 'viewCount' | 'category';
  sortOrder?: 'asc' | 'desc';
}

/**
 * API Response types
 */
export interface ServicesResponse {
  status: 'success';
  data: Service[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ServiceResponse {
  status: 'success';
  data: Service;
}

export interface CategoriesResponse {
  status: 'success';
  data: string[];
}
