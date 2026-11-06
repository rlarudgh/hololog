import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { upsertShortUrl } from '@/shared/database/queries';
import { createShortCode, validateOriginalUrl } from '@/shared/libs/short-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

/**
 * 요청이 들어온 서비스 주소(프로토콜 + host).
 * 프록시(Vercel) 뒤에서도 사용자가 접속한 주소가 되도록 forwarded 헤더를 우선한다.
 */
function requestOrigin(request: NextRequest): { origin: string; host: string } {
  const host =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    request.nextUrl.host;
  const proto =
    request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ??
    request.nextUrl.protocol.replace(/:$/, '');
  return { origin: `${proto}://${host}`, host };
}

/** POST /api/shorten — `{ originalUrl }`을 6자리 단축 코드로 만든다. */
export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const raw =
    body && typeof body === 'object' && 'originalUrl' in body
      ? body.originalUrl
      : undefined;

  const { origin, host } = requestOrigin(request);
  const validation = validateOriginalUrl(raw, host);
  if (!validation.ok) {
    return errorResponse(validation.code, validation.message, 400);
  }

  const { originalUrl } = validation;

  try {
    const { shortUrl, created } = await upsertShortUrl(
      createShortCode(originalUrl),
      originalUrl,
    );
    return NextResponse.json(
      {
        shortCode: shortUrl.shortCode,
        shortUrl: `${origin}/${shortUrl.shortCode}`,
        originalUrl: shortUrl.originalUrl,
      },
      { status: created ? 201 : 200 },
    );
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to create short URL.', 500);
  }
}
