'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api';
import { User, LoginCredentials, RegisterData } from '@/types/auth';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Helper para logs solo en desarrollo
const isDev = process.env.NODE_ENV === 'development';
const log = (...args: any[]) => {
  if (isDev) console.log(...args);
};
const logError = (...args: any[]) => {
  if (isDev) console.error(...args);
};
const logWarn = (...args: any[]) => {
  if (isDev) console.warn(...args);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    log('🔄 AuthProvider mounted, loading user...');
    loadUser();
  }, []);

  const loadUser = async () => {
    log('🔍 loadUser() called');
    log('📦 Token exists:', !!Cookies.get('accessToken'));
    
    try {
      if (authService.isAuthenticated()) {
        log('✅ Token found, fetching user from /auth/me...');
        
        try {
          const currentUser = await authService.getCurrentUser();
          log('✅ User loaded successfully:', currentUser.email);
          setUser(currentUser);
        } catch (error: any) {
          logError('❌ Failed to load user:', error);
          logError('📊 Error details:', {
            status: error?.response?.status,
            message: error?.message,
            url: error?.config?.url
          });
          
          // Si falla porque la ruta no existe (404), limpiar auth
          if (error?.response?.status === 404) {
            logWarn('⚠️ Auth endpoint not available (404), clearing auth state');
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            setUser(null);
          } else if (error?.response?.status === 401 || error?.response?.status === 403) {
            // Token inválido o expirado
            logError('🔒 Invalid token (401/403), clearing auth state');
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            setUser(null);
          } else {
            // Otros errores - NO limpiar el token, puede ser error de red temporal
            logError('⚠️ Network or server error, keeping token');
            setUser(null);
          }
        }
      } else {
        log('❌ No token found, user not authenticated');
      }
    } catch (error) {
      logError('❌ Auth check failed:', error);
      setUser(null);
    } finally {
      log('✅ loadUser() completed, setting loading = false');
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    log('🔐 Attempting login for:', credentials.email);
    try {
      const response = await authService.login(credentials);
      log('✅ Login successful, user:', response.user.email);
      setUser(response.user);
      
      log('🔄 Redirecting to /dashboard...');
      router.push('/dashboard');
    } catch (error) {
      logError('❌ Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    log('🔐 Attempting registration for:', data.email);
    try {
      const response = await authService.register(data);
      log('✅ Registration successful, user:', response.user.email);
      setUser(response.user);
      
      log('🔄 Redirecting to /dashboard...');
      router.push('/dashboard');
    } catch (error) {
      logError('❌ Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    log('🚪 Logging out...');
    try {
      await authService.logout();
      log('✅ Logout API call successful');
    } catch (error) {
      logWarn('⚠️ Logout API failed (continuing anyway):', error);
    } finally {
      // CRÍTICO: Limpiar estado SIEMPRE
      log('🧹 Clearing user state and cookies');
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');

      log('🔄 Redirecting to home...');
      window.location.href = '/';
    }
  };

  const refreshUser = async () => {
    log('🔄 Refreshing user data...');
    try {
      const currentUser = await authService.getCurrentUser();
      log('✅ User refreshed:', currentUser.email);
      setUser(currentUser);
    } catch (error: any) {
      logError('❌ Failed to refresh user:', error);
      // Si falla, limpiar estado
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        log('🧹 Clearing auth due to refresh failure');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        setUser(null);
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    refreshUser,
  };

  log('📊 AuthContext state:', { 
    hasUser: !!user, 
    loading, 
    isAuthenticated: !!user,
    userEmail: user?.email 
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}