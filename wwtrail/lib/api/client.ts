// lib/api/client.ts
// Unified API client - calls same-origin API routes (no external backend, no CORS)
import axios from 'axios';
import Cookies from 'js-cookie';

// Same-origin: empty string in browser, full URL on server
const BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

// ============================================
// AUTH CLIENT (replaces V1 - /api/auth/*)
// ============================================
export const apiClientV1 = axios.create({
  baseURL: `${BASE_URL}/api/auth`,
  headers: { 'Content-Type': 'application/json' },
});

// ============================================
// DATA CLIENT (replaces V2 - /api/v2/*)
// ============================================
export const apiClientV2 = axios.create({
  baseURL: `${BASE_URL}/api/v2`,
  headers: { 'Content-Type': 'application/json' },
});

// Shared request interceptor - add auth token
function addAuthToken(config: any) {
  const token = Cookies.get('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

// Shared response interceptor - handle 401 with token refresh
function createResponseInterceptor(client: any) {
  return async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = response.data.data;

        Cookies.set('accessToken', accessToken, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        if (newRefresh) {
          Cookies.set('refreshToken', newRefresh, {
            expires: 30,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          });
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  };
}

// Apply interceptors to both clients
apiClientV1.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
apiClientV2.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

apiClientV1.interceptors.response.use((r) => r, createResponseInterceptor(apiClientV1));
apiClientV2.interceptors.response.use((r) => r, createResponseInterceptor(apiClientV2));

// Default export for backwards compatibility
export const apiClient = apiClientV1;
export default apiClientV1;
