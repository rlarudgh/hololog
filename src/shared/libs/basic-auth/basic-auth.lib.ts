import { createHash, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';

/** Basic 인증 영역 이름. `WWW-Authenticate` 헤더에 들어간다. */
export const BASIC_AUTH_REALM = 'Admin';

export interface BasicAuthUser {
  username: string;
  role: 'admin';
}

/** 길이와 무관하게 상수 시간으로 비교하려고 sha256으로 고정 길이화한다. */
function safeEqual(a: string, b: string): boolean {
  const ah = createHash('sha256').update(a).digest();
  const bh = createHash('sha256').update(b).digest();
  return timingSafeEqual(ah, bh);
}

/** `Authorization: Basic ...` 헤더를 username/password로 분리한다. 형식이 틀리면 null. */
function parseBasicHeader(
  header: string | null,
): { username: string; password: string } | null {
  if (!header?.startsWith('Basic ')) return null;

  let decoded: string;
  try {
    decoded = Buffer.from(
      header.slice('Basic '.length).trim(),
      'base64',
    ).toString('utf-8');
  } catch {
    return null;
  }

  const separator = decoded.indexOf(':');
  if (separator === -1) return null;

  return {
    username: decoded.slice(0, separator),
    password: decoded.slice(separator + 1),
  };
}

/**
 * HTTP Basic 인증. `ADMIN_USERNAME`/`ADMIN_PASSWORD`와 일치하면 사용자, 아니면 null.
 * 둘 중 하나라도 설정되지 않았으면 항상 실패한다(빈 비밀번호로 열리는 것을 막는다).
 */
export function authenticateBasic(
  authorization: string | null,
): BasicAuthUser | null {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) return null;

  const credentials = parseBasicHeader(authorization);
  if (!credentials) return null;

  // 두 비교를 모두 수행해 어느 쪽이 틀렸는지 시간으로 드러나지 않게 한다.
  const userOk = safeEqual(credentials.username, expectedUser);
  const passwordOk = safeEqual(credentials.password, expectedPassword);
  if (!userOk || !passwordOk) return null;

  return { username: credentials.username, role: 'admin' };
}

/** 401 + `WWW-Authenticate: Basic` 응답. 브라우저가 로그인 창을 띄운다. */
export function basicAuthChallenge(): NextResponse {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${BASIC_AUTH_REALM}"`,
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
