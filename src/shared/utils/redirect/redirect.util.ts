/** `next` 리다이렉트 대상을 내부 경로로 제한한다(open redirect 방지). */
export function safeRedirectPath(
  next: string | null | undefined,
  fallback = '/dashboard',
): string {
  if (
    !next ||
    !next.startsWith('/') ||
    next.startsWith('//') ||
    next.includes('\\')
  ) {
    return fallback;
  }
  return next;
}
