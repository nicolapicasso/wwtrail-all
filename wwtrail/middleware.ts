import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';
import { verifyJwtEdge } from './lib/auth/edge';

const JWT_SECRET = process.env.JWT_SECRET || '';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes entirely (no i18n needed for API)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Apply i18n middleware
  const response = intlMiddleware(request);

  // Auth logic: verify the token signature + expiry, not just its presence.
  const rawToken = request.cookies.get('accessToken')?.value;
  const validPayload = rawToken ? await verifyJwtEdge(rawToken, JWT_SECRET) : null;
  const accessToken = validPayload ? rawToken : undefined;

  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/competitions',
    '/events',
    '/services',
    '/magazine',
    '/promotions',
    '/organizers',
    '/special-series',
    '/users',
    '/directory',
    '/page',
    '/editions',
  ];

  const isPublicRoute = (path: string) => {
    const pathWithoutLocale = path.replace(new RegExp(`^/(${locales.join('|')})`), '');
    const checkPath = pathWithoutLocale || '/';
    return publicRoutes.some(route => checkPath === route || checkPath.startsWith(route + '/'));
  };

  const isAuthRoute = pathname.includes('/auth/');

  if (isPublicRoute(pathname) || isAuthRoute) {
    if (accessToken && (pathname.includes('/auth/login') || pathname.includes('/auth/register'))) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  if (!accessToken) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|uploads|.*\\..*).*)',
    '/',
  ],
};
