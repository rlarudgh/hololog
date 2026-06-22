import { NextResponse } from 'next/server';
import { apiDocsEnabled } from '@/shared/libs/openapi';

export const dynamic = 'force-dynamic';

/**
 * GET /api-docs — 인터랙티브 API 문서(Scalar).
 *
 * `/api/openapi` 스펙을 불러와 렌더링하며, 우측 패널에서 API 키를 입력해
 * 로컬(localhost:3000)에서 바로 "Test Request"로 호출해 볼 수 있다.
 * Scalar는 CDN에서 로드하므로 별도 npm 의존성이 없다.
 */
export function GET() {
  if (!apiDocsEnabled()) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const html = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hololog API Reference</title>
    <style>body { margin: 0 }</style>
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/api/openapi"
      data-configuration='{"theme":"purple","hideDownloadButton":false}'
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
