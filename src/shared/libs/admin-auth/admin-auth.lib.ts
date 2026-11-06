import type { NextRequest, NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { isAuthorized, unauthorized } from '@/shared/libs/api-auth';
import { createSupabaseServerClient } from '@/shared/libs/supabase';

/**
 * admin 여부. `app_metadata`는 service role/SQL로만 수정 가능하므로
 * 사용자가 스스로 권한을 올릴 수 없다.
 */
export function isAdmin(user: User | null | undefined): user is User {
  return user?.app_metadata?.role === 'admin';
}

/** 현재 요청의 세션에서 admin 사용자를 반환한다. admin이 아니면 null. */
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return isAdmin(user) ? user : null;
}

/**
 * 쿠키 세션 요청이 같은 출처에서 왔는지 확인한다(CSRF 방어).
 * 브라우저는 POST/PUT/DELETE fetch에 항상 Origin 헤더를 붙인다.
 */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  return origin !== null && origin === request.nextUrl.origin;
}

/**
 * 쓰기 라우트 가드. 쓰기 API 키 또는 같은 출처의 admin 세션이면 통과(null),
 * 아니면 401 응답을 반환한다.
 *
 * @example
 * const denied = await requireWriteAccess(request);
 * if (denied) return denied;
 */
export async function requireWriteAccess(
  request: NextRequest,
): Promise<NextResponse | null> {
  if (isAuthorized(request, 'write')) return null;
  if (isSameOrigin(request) && (await getAdminUser())) return null;
  return unauthorized(request);
}
