import apiClient from './client';
import Cookies from 'js-cookie';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  User,
  ApiResponse 
} from '../types';

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    const { accessToken, refreshToken, user } = response.data.data;

    // Store tokens in cookies
    Cookies.set('accessToken', accessToken, {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    Cookies.set('refreshToken', refreshToken, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response.data.data;
  },

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const { accessToken, refreshToken, user } = response.data.data;

    // Store tokens in cookies
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

  // Logout
  async logout(): Promise<void> {
    try {
      // Obtener refreshToken de las cookies
      const refreshToken = Cookies.get('refreshToken');
      
      if (refreshToken) {
        // Enviar refreshToken al backend para invalidarlo
        await apiClient.post('/auth/logout', {
          refreshToken  // ← IMPORTANTE: enviar en el body
        });
      }
    } catch (error) {
      // Log error pero continuar con limpieza local
      console.error('Error during logout:', error);
    } finally {
      // SIEMPRE limpiar cookies, incluso si la API falla
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', {
      refreshToken,
    });
    
    // Actualizar tokens en cookies
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
    
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

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!Cookies.get('accessToken');
  },

  // Get access token
  getAccessToken(): string | undefined {
    return Cookies.get('accessToken');
  },

  // Get refresh token
  getRefreshToken(): string | undefined {
    return Cookies.get('refreshToken');
  },
};
