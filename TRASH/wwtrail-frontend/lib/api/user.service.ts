// lib/api/user.service.ts
import apiClientV2 from './client-v2';

// ============================================
// TYPES
// ============================================

export interface PublicUser {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  avatar: string | null;
  country: string | null;
  city: string | null;
  bio: string | null;
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY' | null;
  age: number | null;
  isInsider: boolean;
  participationsCount: number;
  finishesCount: number;
}

export interface UserParticipation {
  id: string;
  editionId: string;
  status: string;
  finishTime: string | null;
  position: number | null;
  categoryPosition: number | null;
  categoryType: string | null;
  categoryName: string | null;
  edition: {
    id: string;
    year: number;
    slug: string;
    competition: {
      id: string;
      name: string;
      slug: string;
      event: {
        id: string;
        name: string;
        slug: string;
        country: string;
      };
    };
  };
}

export interface PublicUserProfile {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  avatar: string | null;
  bio: string | null;
  country: string | null;
  city: string | null;
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY' | null;
  age: number | null;
  isInsider: boolean;
  instagramUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  createdAt: string;
  participations: UserParticipation[];
  stats: {
    totalParticipations: number;
    totalFinishes: number;
    totalDNF: number;
  };
}

export interface OwnProfile {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  language: string;
  role: string;
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY' | null;
  birthDate: string | null;
  age: number | null;
  isPublic: boolean;
  instagramUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  createdAt: string;
  updatedAt: string;
  stats: {
    participations: number;
    reviews: number;
    favorites: number;
  };
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  country?: string;
  city?: string;
  language?: string;
  gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' | null;
  birthDate?: string | null;
  isPublic?: boolean;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserEditionInput {
  status: 'COMPLETED' | 'DNF';
  finishTime?: string | null;
  position?: number | null;
  categoryPosition?: number | null;
  categoryType?: 'GENERAL' | 'MALE' | 'FEMALE' | 'CATEGORY' | null;
  categoryName?: string | null;
  bibNumber?: string | null;
  notes?: string | null;
  personalRating?: number | null;
}

export interface EditionSearchResult {
  id: string;
  year: number;
  slug: string;
  startDate: string;
  distance: number | null;
  elevation: number | null;
  competitionName: string;
  eventName: string;
  eventCountry: string;
  eventCity: string;
  displayName: string;
}

export interface GetPublicUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  minAge?: number;
  maxAge?: number;
  editionId?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ============================================
// SERVICE
// ============================================

export const userService = {
  // ============================================
  // PUBLIC ENDPOINTS
  // ============================================

  /**
   * Obtener listado de usuarios públicos
   */
  async getPublicUsers(params: GetPublicUsersParams = {}) {
    const response = await apiClientV2.get('/users', { params });
    return {
      users: response.data.data as PublicUser[],
      pagination: response.data.pagination as PaginationInfo,
    };
  },

  /**
   * Obtener perfil público de un usuario por username
   */
  async getPublicProfile(username: string) {
    const response = await apiClientV2.get(`/users/profile/${username}`);
    return response.data.data as PublicUserProfile;
  },

  /**
   * Obtener insiders públicos con configuración
   */
  async getPublicInsiders() {
    const response = await apiClientV2.get('/users/insiders');
    return response.data.data as {
      config: {
        badgeUrl: string | null;
        introTextES: string | null;
        introTextEN: string | null;
        introTextIT: string | null;
        introTextCA: string | null;
        introTextFR: string | null;
        introTextDE: string | null;
      } | null;
      insiders: Array<{
        id: string;
        username: string;
        fullName: string;
        avatar: string | null;
        country: string | null;
        city: string | null;
        bio: string | null;
      }>;
      stats: {
        total: number;
        byCountry: Record<string, number>;
      };
    };
  },

  // ============================================
  // AUTHENTICATED ENDPOINTS
  // ============================================

  /**
   * Obtener perfil propio
   */
  async getOwnProfile() {
    const response = await apiClientV2.get('/users/me');
    return response.data.data as OwnProfile;
  },

  /**
   * Actualizar perfil propio
   */
  async updateProfile(data: UpdateProfileData) {
    const response = await apiClientV2.put('/users/me', data);
    return response.data.data;
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(data: ChangePasswordData) {
    const response = await apiClientV2.post('/users/me/change-password', data);
    return response.data;
  },

  /**
   * Obtener participaciones propias
   */
  async getOwnParticipations() {
    const response = await apiClientV2.get('/users/me/participations');
    return response.data.data as UserParticipation[];
  },

  /**
   * Obtener participación en una edición específica
   */
  async getParticipation(editionId: string) {
    const response = await apiClientV2.get(`/users/me/participations/${editionId}`);
    return response.data.data;
  },

  /**
   * Crear o actualizar participación en una edición
   */
  async upsertParticipation(editionId: string, data: UserEditionInput) {
    const response = await apiClientV2.post(`/users/me/participations/${editionId}`, data);
    return response.data.data;
  },

  /**
   * Eliminar participación
   */
  async deleteParticipation(editionId: string) {
    const response = await apiClientV2.delete(`/users/me/participations/${editionId}`);
    return response.data;
  },

  /**
   * Buscar ediciones para selector
   */
  async searchEditions(search?: string, page = 1, limit = 20) {
    const params = { search, page, limit };
    const response = await apiClientV2.get('/editions/search', { params });
    return {
      editions: response.data.data as EditionSearchResult[],
      pagination: response.data.pagination,
    };
  },

  /**
   * Obtener participantes de una edición
   */
  async getEditionParticipants(editionId: string) {
    const response = await apiClientV2.get(`/editions/${editionId}/participants`);
    return response.data.data;
  },
};

export default userService;
