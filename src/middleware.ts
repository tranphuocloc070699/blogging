import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Protect /auth routes (admin/CMS routes)
  if (pathname.startsWith('/auth') || pathname.startsWith('/profile')) {
    // Allow login page
    if (pathname === '/auth/login') {
      return NextResponse.next();
    }

    // Check for refresh token in cookies (this persists across sessions)
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // If no refresh token, redirect to login
    if (!refreshToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If refresh token exists, allow access
    // The client-side auth-context will handle verifying and refreshing the token
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
