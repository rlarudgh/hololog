import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseEnv } from './supabase-env.lib';

/**
 * Server Component / Route Handler용 Supabase 클라이언트.
 * 세션은 쿠키로 유지되며, 인증 확인은 반드시 `auth.getUser()`로 한다
 * (`getSession()`은 서명 검증 없이 쿠키 값을 그대로 신뢰한다).
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component에서는 쿠키를 쓸 수 없다. 세션 갱신은 proxy가 담당하므로 무시한다.
        }
      },
    },
  });
}
