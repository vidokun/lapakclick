import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const publicRoutes = new Set([
  '/',
  '/login',
  '/register',
  '/forgot-password',
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes, API routes, and Next.js internals
  if (
    publicRoutes.has(pathname) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/')
  ) {
    return;
  }

  const { response, user } = await updateSession(request);

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return Response.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (e.g. robots.txt, manifest.webmanifest)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
