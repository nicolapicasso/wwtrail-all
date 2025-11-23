import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Crear middleware de internacionalización
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true, // ✅ ACTIVADO para detectar idioma del navegador automáticamente
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Primero, manejar la internacionalización
  const response = intlMiddleware(request);

  // Luego, aplicar lógica de autenticación
  const accessToken = request.cookies.get('accessToken')?.value;

  // Rutas públicas que NO requieren autenticación
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/test-api',
    '/test-v2',
    '/test',
    '/competitions',
    '/events',
    '/services',
    '/magazine',
    '/promotions',
    '/organizers',
    '/special-series',
  ];

  // Función para verificar si una ruta es pública (considerando locale prefix)
  const isPublicRoute = (path: string) => {
    // Remover locale prefix si existe
    const pathWithoutLocale = path.replace(new RegExp(`^/(${locales.join('|')})`), '');
    const checkPath = pathWithoutLocale || '/';

    return publicRoutes.some(route => {
      return checkPath === route || checkPath.startsWith(route + '/');
    });
  };

  // Verificar si es ruta de auth
  const isAuthRoute = pathname.includes('/auth/');

  // Si es ruta pública o auth, permitir acceso
  if (isPublicRoute(pathname) || isAuthRoute) {
    // Si tiene token y está en login/register, redirigir a dashboard
    if (accessToken && (pathname.includes('/auth/login') || pathname.includes('/auth/register'))) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  // Si intenta acceder a ruta protegida sin token, redirigir a login
  if (!accessToken) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Usuario autenticado accediendo a ruta protegida
  return response;
}

export const config = {
  matcher: [
    // Incluir todas las rutas excepto archivos estáticos
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/',
  ],
};
