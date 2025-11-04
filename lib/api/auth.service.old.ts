// lib/api/auth.service.ts
import apiClient from './client';
import Cookies from 'js-cookie';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth';

// Tipo para las respuestas de la API
interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

/**
 * Auth Service
 * IMPORTANTE: Usa rutas relativas porque client.ts ya tiene baseURL=/api/v1
 */
export const authService = {
  /**
   * Login de usuario
   * POST /auth/login (relativo a /api/v1)
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    
    const { accessToken, refreshToken, user } = response.data.data;

    // Guardar tokens en cookies
    Cookies.set('accessToken', accessToken, {
      expires: 1, // 1 día
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    Cookies.set('refreshToken', refreshToken, {
      expires: 7, // 7 días
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response.data.data;
  },

  /**
   * Registro de usuario
   * POST /auth/register
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    
    const { accessToken, refreshToken, user } = response.data.data;

    // Guardar tokens en cookies
    Cookies.set('accessToken', accessToken, {
      expires: 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    Cookies.set('refreshToken', refreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response.data.data;
  },

  /**
   * Logout
   * POST /auth/logout
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = Cookies.get('refreshToken');
      
      if (refreshToken) {
        // Enviar refreshToken al backend para invalidarlo
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // SIEMPRE limpiar cookies, incluso si la API falla
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  },

  /**
   * Obtener usuario actual
   * GET /auth/me
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  /**
   * Refresh token
   * POST /auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
    
    // Actualizar tokens en cookies
    Cookies.set('accessToken', newAccessToken, {
      expires: 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    Cookies.set('refreshToken', newRefreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    return response.data.data;
  },

  /**
   * Logout de todos los dispositivos
   * POST /auth/logout-all
   */
  async logoutAll(): Promise<void> {
    try {
      await apiClient.post('/auth/logout-all');
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!Cookies.get('accessToken');
  },

  /**
   * Obtener access token
   */
  getAccessToken(): string | undefined {
    return Cookies.get('accessToken');
  },

  /**
   * Obtener refresh token
   */
  getRefreshToken(): string | undefined {
    return Cookies.get('refreshToken');
  },
};

export default authService;