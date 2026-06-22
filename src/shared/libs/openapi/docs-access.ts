/**
 * API 문서(`/api-docs`, `/api/openapi`) 노출 여부.
 *
 * 우선순위:
 * 1. `ENABLE_API_DOCS=true`  → 항상 노출(프로덕션 포함)
 * 2. `ENABLE_API_DOCS=false` → 항상 차단
 * 3. 미설정 → 개발 환경에서만 노출(프로덕션 배포에서는 404)
 */
export function apiDocsEnabled(): boolean {
  const flag = process.env.ENABLE_API_DOCS;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}
