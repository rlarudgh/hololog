import crypto from 'crypto';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export type ApiScope = 'read' | 'write';

/**
 * 두 문자열을 상수 시간으로 비교한다.
 * 길이에 따른 분기/예외를 피하려고 sha256으로 고정 길이화한 뒤 비교한다.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const ah = crypto.createHash('sha256').update(a).digest();
  const bh = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ah, bh);
}

/** 요청에서 API 키를 추출한다(`x-api-key` 우선, 없으면 `Authorization: Bearer`). */
function extractKey(request: NextRequest): string | null {
  const headerKey = request.headers.get('x-api-key');
  if (headerKey && headerKey.trim()) return headerKey.trim();

  const auth = request.headers.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const token = auth.slice(7).trim();
    if (token) return token;
  }
  return null;
}

function readKeys(): string[] {
  return (process.env.BLOG_API_KEYS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function writeKey(): string | null {
  const key = process.env.BLOG_API_WRITE_KEY?.trim();
  return key || null;
}

/**
 * 주어진 scope에 대해 요청이 인증되었는지 확인한다.
 * - write: `BLOG_API_WRITE_KEY`와 일치해야 한다(읽기 키로는 쓰기 불가).
 * - read: 읽기 키(`BLOG_API_KEYS`) 중 하나 또는 쓰기 키와 일치하면 된다.
 */
export function isAuthorized(request: NextRequest, scope: ApiScope): boolean {
  const provided = extractKey(request);
  if (!provided) return false;

  if (scope === 'write') {
    const wk = writeKey();
    return wk !== null && timingSafeEqual(provided, wk);
  }

  const candidates = readKeys();
  const wk = writeKey();
  if (wk) candidates.push(wk);

  return candidates.some((key) => timingSafeEqual(provided, key));
}

/** 설정된 allowlist(`BLOG_CORS_ORIGINS`)에 맞춰 CORS 헤더를 만든다. */
export function corsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin') ?? '';
  const config = (process.env.BLOG_CORS_ORIGINS ?? '*').trim();

  let allowOrigin = '*';
  if (config !== '*') {
    const allowed = config
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    allowOrigin = allowed.includes(origin) ? origin : (allowed[0] ?? '');
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization',
    Vary: 'Origin',
  };
}

/** CORS 헤더를 포함한 JSON 응답을 만든다. */
export function jsonWithCors(
  request: NextRequest,
  body: unknown,
  init?: ResponseInit,
): NextResponse {
  return NextResponse.json(body, {
    ...init,
    headers: { ...corsHeaders(request), ...(init?.headers ?? {}) },
  });
}

/** 401 Unauthorized 응답(CORS 헤더 포함). */
export function unauthorized(request: NextRequest): NextResponse {
  return jsonWithCors(request, { error: 'Unauthorized' }, { status: 401 });
}

/** CORS 프리플라이트(OPTIONS) 응답. */
export function handleOptions(request: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

/**
 * 라우트 가드. 인증 실패 시 401 응답을 반환하고, 성공 시 null을 반환한다.
 *
 * @example
 * const denied = requireApiKey(request, 'read');
 * if (denied) return denied;
 */
export function requireApiKey(
  request: NextRequest,
  scope: ApiScope,
): NextResponse | null {
  return isAuthorized(request, scope) ? null : unauthorized(request);
}
