import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

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
  ];

  // Verificar si es una ruta pública
  const isPublicRoute = publicRoutes.some(route => {
    // Coincidencia exacta o que empiece con la ruta (para subrutas)
    return pathname === route || pathname.startsWith(route + '/');
  });

  // También permitir rutas que empiezan con /auth/
  const isAuthRoute = pathname.startsWith('/auth/');

  // Si es ruta pública o auth, permitir acceso
  if (isPublicRoute || isAuthRoute) {
    // Si tiene token y está en login/register, redirigir a dashboard
    if (accessToken && (pathname === '/auth/login' || pathname === '/auth/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Si intenta acceder a ruta protegida sin token, redirigir a login
  if (!accessToken) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Usuario autenticado accediendo a ruta protegida
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};