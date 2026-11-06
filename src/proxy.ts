import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/shared/libs/supabase';
import { isAdmin } from '@/shared/libs/admin-auth';
import {
  authenticateBasic,
  basicAuthChallenge,
} from '@/shared/libs/basic-auth';

/** HTTP Basic 인증으로 보호하는 URL Shortener 관리자 경로. */
function isBasicAuthPath(pathname: string): boolean {
  return (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/api/stats'
  );
}

/** Supabase 세션으로 보호하는 블로그 관리 화면 경로. */
function isDashboardPath(pathname: string): boolean {
  return pathname === '/dashboard' || pathname.startsWith('/dashboard/');
}

/** 갱신된 세션 쿠키를 유지한 채 리다이렉트한다. */
function redirectWithCookies(url: URL, from: NextResponse): NextResponse {
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

/**
 * 1) /admin, /api/stats: HTTP Basic 인증(Supabase와 무관, 세션 갱신도 하지 않음)
 * 2) /dashboard, /login: Supabase 세션 갱신 + admin 접근 1차 필터
 * 실제 권한 검사는 각 페이지/Route Handler에서 다시 한다.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isBasicAuthPath(pathname)) {
    return authenticateBasic(request.headers.get('authorization'))
      ? NextResponse.next()
      : basicAuthChallenge();
  }

  const { response, user } = await updateSession(request);
  const admin = isAdmin(user);

  if (isDashboardPath(pathname) && !admin) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', `${pathname}${search}`);
    return redirectWithCookies(url, response);
  }

  if (pathname === '/login' && admin) {
    return redirectWithCookies(new URL('/dashboard', request.url), response);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/stats', '/dashboard/:path*', '/login'],
};
