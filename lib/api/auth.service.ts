// lib/api/auth.service.ts
import { apiClientV1 } from './client'; // ← IMPORTANTE: Usar V1
import Cookies from 'js-cookie';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth';

class AuthService {
  /**
   * Login
   */
  async login(credentials: LoginCredentials): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const response = await apiClientV1.post<AuthResponse>('/auth/login', credentials);
    
    // ✅ CORRECCIÓN: Acceder a response.data.data
    const { accessToken, refreshToken, user } = response.data.data;
    
    // ✅ CAMBIO: Usar Cookies en lugar de localStorage
    Cookies.set('accessToken', accessToken, { expires: 7 }); // 7 días
    Cookies.set('refreshToken', refreshToken, { expires: 30 }); // 30 días
    
    return { user, accessToken, refreshToken };
  }

  /**
   * Register
   */
  async register(data: RegisterData): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const response = await apiClientV1.post<AuthResponse>('/auth/register', data);
    
    // ✅ CORRECCIÓN: Acceder a response.data.data
    const { accessToken, refreshToken, user } = response.data.data;
    
    // ✅ CAMBIO: Usar Cookies en lugar de localStorage
    Cookies.set('accessToken', accessToken, { expires: 7 });
    Cookies.set('refreshToken', refreshToken, { expires: 30 });
    
    return { user, accessToken, refreshToken };
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    const refreshToken = Cookies.get('refreshToken');
    
    try {
      if (refreshToken) {
        await apiClientV1.post('/auth/logout', { refreshToken });
      }
    } finally {
      // ✅ CAMBIO: Limpiar cookies en lugar de localStorage
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClientV1.get<{ data: User }>('/auth/me');
    return response.data.data;
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = Cookies.get('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClientV1.post<{ data: { accessToken: string } }>(
      '/auth/refresh',
      { refreshToken }
    );

    const newAccessToken = response.data.data.accessToken;
    
    // ✅ CAMBIO: Guardar en cookies
    Cookies.set('accessToken', newAccessToken, { expires: 7 });
    
    return newAccessToken;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!Cookies.get('accessToken');
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return Cookies.get('accessToken') || null;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return Cookies.get('refreshToken') || null;
  }
}

export const authService = new AuthService();
