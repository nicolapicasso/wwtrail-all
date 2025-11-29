'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Menu, ChevronDown, MapPin, Award, Settings, Users, Star, Gift } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslations } from 'next-intl';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  
  // Safely get auth - might not be in AuthProvider
  let user = null;
  let isAuthenticated = false;
  let logout = async () => {};
  let loading = false;

  try {
    const auth = useAuth();
    user = auth.user;
    isAuthenticated = auth.isAuthenticated;
    logout = auth.logout;
    loading = auth.loading;
  } catch (e) {
    // Not in AuthProvider, defaults to null/false
  }

  const handleLogout = async () => {
    try {
      await logout();
      // El AuthContext ya maneja la redirección y limpieza
    } catch (error) {
      console.error('Logout error:', error);
      // Forzar limpieza local como fallback
      window.location.href = '/';
    }
  };

  // Mostrar un placeholder mientras carga
  if (loading) {
    return (
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative h-10 w-40">
                  <Image
                    src="http://localhost:3001/uploads/others/logo_cabecera.webp"
                    alt="WWTRAIL"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-400">{tCommon('loading')}</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-40">
                <Image
                  src="http://localhost:3001/uploads/others/logo_cabecera.webp"
                  alt="WWTRAIL"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation - Public Menu */}
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              <Link
                href="/events"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-hover transition-colors"
              >
                {t('events')}
              </Link>

              {/* Competiciones con dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-1 px-1 pt-1 text-sm font-medium text-white hover:text-hover transition-colors">
                    {t('competitions')}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/competitions" className="cursor-pointer">
                      {t('competitions')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/special-series" className="cursor-pointer">
                      {t('specialSeries')}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/services"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-hover transition-colors"
              >
                {t('services')}
              </Link>
              <Link
                href="/directory"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-hover transition-colors"
              >
                Mapa
              </Link>

              {/* Comunidad dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-1 px-1 pt-1 text-sm font-medium text-white hover:text-hover transition-colors">
                    Comunidad
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/users" className="cursor-pointer flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Directorio de usuarios
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/users/insiders" className="cursor-pointer flex items-center">
                      <Star className="mr-2 h-4 w-4" />
                      Insiders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/promotions" className="cursor-pointer flex items-center">
                      <Gift className="mr-2 h-4 w-4" />
                      Ventajas
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/magazine"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-hover transition-colors"
              >
                {t('magazine')}
              </Link>
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <LanguageSelector />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-hover hover:bg-gray-900">
                    <User className="h-5 w-5" />
                    <span>{user?.username || user?.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{t('profile')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  {/* Mis participaciones - Próximamente */}
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('admin')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    {t('register')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-hover hover:bg-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black">
          {/* Public Menu Items */}
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/events"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-900 hover:text-hover transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('events')}
            </Link>
            <Link
              href="/competitions"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-900 hover:text-hover transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('competitions')}
            </Link>
            <Link
              href="/special-series"
              className="block pl-6 pr-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-hover transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              → {t('specialSeries')}
            </Link>
            <Link
              href="/services"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-900 hover:text-hover transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('services')}
            </Link>
            <Link
              href="/directory"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-900 hover:text-hover transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mapa
            </Link>
            {/* Comunidad section */}
            <div className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300">
              Comunidad
            </div>
            <Link
              href="/users"
              className="block pl-6 pr-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-hover transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              → Directorio de usuarios
            </Link>
            <Link
              href="/users/insiders"
              className="block pl-6 pr-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-hover transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              → Insiders
            </Link>
            <Link
              href="/promotions"
              className="block pl-6 pr-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-hover transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              → Ventajas
            </Link>
            <Link
              href="/magazine"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-900 hover:text-hover transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('magazine')}
            </Link>
          </div>

          {/* Private Menu Items (only if authenticated) */}
          {isAuthenticated && (
            <div className="pt-2 pb-3 border-t border-gray-800 space-y-1">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t('profile')}
              </div>
              <Link
                href="/profile"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-900 hover:text-hover transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {t('profile')}
                </div>
              </Link>
              {/* Mis participaciones - Próximamente */}
              <Link
                href="/dashboard"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-900 hover:text-hover transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  {t('admin')}
                </div>
              </Link>
            </div>
          )}
          {/* Language Selector */}
          <div className="pt-4 pb-3 border-t border-gray-800">
            <div className="px-4 mb-3">
              <LanguageSelector />
            </div>
          </div>

          {/* Auth Section */}
          <div className="pt-4 pb-3 border-t border-gray-800">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-4 flex items-center gap-2 text-sm text-gray-300 mb-3">
                  <User className="h-5 w-5" />
                  <span>{user?.username || user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-red-400 hover:bg-gray-900 hover:text-red-300 transition-colors"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('logout')}
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-4">
                <Link href="/auth/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/auth/register" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    {t('register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
