// lib/api/auth.service.ts
import { apiClientV1 } from './client';
import Cookies from 'js-cookie';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth';

class AuthService {
  async login(credentials: LoginCredentials): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const response = await apiClientV1.post<AuthResponse>('/login', credentials);
    const { accessToken, refreshToken, user } = response.data.data;

    Cookies.set('accessToken', accessToken, { expires: 7 });
    Cookies.set('refreshToken', refreshToken, { expires: 30 });

    return { user, accessToken, refreshToken };
  }

  async register(data: RegisterData): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const response = await apiClientV1.post<AuthResponse>('/register', data);
    const { accessToken, refreshToken, user } = response.data.data;

    Cookies.set('accessToken', accessToken, { expires: 7 });
    Cookies.set('refreshToken', refreshToken, { expires: 30 });

    return { user, accessToken, refreshToken };
  }

  async logout(): Promise<void> {
    const refreshToken = Cookies.get('refreshToken');
    try {
      if (refreshToken) {
        await apiClientV1.post('/logout', { refreshToken });
      }
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClientV1.get<{ data: User }>('/me');
    return response.data.data;
  }

  async refreshToken(): Promise<string> {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClientV1.post<{ data: { accessToken: string } }>(
      '/refresh',
      { refreshToken }
    );

    const newAccessToken = response.data.data.accessToken;
    Cookies.set('accessToken', newAccessToken, { expires: 7 });

    return newAccessToken;
  }

  isAuthenticated(): boolean {
    return !!Cookies.get('accessToken');
  }

  getAccessToken(): string | null {
    return Cookies.get('accessToken') || null;
  }

  getRefreshToken(): string | null {
    return Cookies.get('refreshToken') || null;
  }
}

export const authService = new AuthService();
