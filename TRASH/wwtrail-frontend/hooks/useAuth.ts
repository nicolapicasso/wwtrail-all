'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth.service';
import type { User, LoginCredentials, RegisterData } from '@/types/auth';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isOrganizer: boolean;
  isAthlete: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export function useAuth(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Propiedades calculadas basadas en el rol del usuario
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isOrganizer = user?.role === 'ORGANIZER';
  const isAthlete = user?.role === 'ATHLETE';

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setError(null);
      } catch (err: any) {
        setUser(null);
        setError(null); // No mostramos error si no está autenticado
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.register(data);
      setUser(response.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
    isOrganizer,
    isAthlete,
    login,
    register,
    logout,
  };
}