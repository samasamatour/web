import { NextRequest, NextResponse } from 'next/server';
import { parseLocaleFromHeader, SUPPORTED_LOCALES } from '@/lib/i18n';

const STATIC_FILE = /\.(.*)$/;

function isPublicPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/placeholder.svg') ||
    STATIC_FILE.test(pathname)
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    const locale = parseLocaleFromHeader(request.headers.get('accept-language'));
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-admin-public', '1');

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const isLocalized = SUPPORTED_LOCALES.includes(firstSegment as 'id' | 'en');

  if (!isLocalized && !pathname.startsWith('/destination/')) {
    const locale = parseLocaleFromHeader(request.headers.get('accept-language'));
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
