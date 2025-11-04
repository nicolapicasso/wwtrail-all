// lib/api/clients.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ============================================
// CLIENTE V1 (Solo para Auth)
// ============================================
export const apiClientV1 = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor V1
apiClientV1.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor V1
apiClientV1.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;

        Cookies.set('accessToken', accessToken, {
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClientV1(originalRequest);
      } catch (refreshError) {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// CLIENTE V2 (Para Events, Competitions, etc.)
// ============================================
export const apiClientV2 = axios.create({
  baseURL: `${BASE_URL}/api/v2`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor V2
apiClientV2.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor V2 (usa V1 para refresh)
apiClientV2.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        // Refresh siempre usa V1
        const response = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;

        Cookies.set('accessToken', accessToken, {
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClientV2(originalRequest);
      } catch (refreshError) {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Exportar cliente por defecto (V1) para compatibilidad
export const apiClient = apiClientV1;
export default apiClientV1;
