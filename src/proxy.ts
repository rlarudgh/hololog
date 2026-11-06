import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/shared/libs/supabase';
import { isAdmin } from '@/shared/libs/admin-auth';

/** 갱신된 세션 쿠키를 유지한 채 리다이렉트한다. */
function redirectWithCookies(url: URL, from: NextResponse): NextResponse {
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

/**
 * 세션 갱신 + /admin 접근 1차 필터.
 * 실제 권한 검사는 admin layout과 각 Route Handler에서 다시 한다.
 */
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname, search } = request.nextUrl;
  const admin = isAdmin(user);

  if (pathname.startsWith('/admin') && !admin) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', `${pathname}${search}`);
    return redirectWithCookies(url, response);
  }

  if (pathname === '/login' && admin) {
    return redirectWithCookies(new URL('/admin', request.url), response);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
