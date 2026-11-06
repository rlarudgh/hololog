/**
 * Supabase 프로젝트 URL과 공개 키를 읽는다. 없으면 설정 오류로 예외를 던진다.
 * publishable 키(`sb_publishable_...`)를 우선 사용하고, 레거시 anon 키는 호환용으로만 읽는다.
 */
export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set',
    );
  }
  return { url, anonKey };
}
