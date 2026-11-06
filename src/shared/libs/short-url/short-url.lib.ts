import { createHash } from 'crypto';

/** 단축 코드 길이. */
export const SHORT_CODE_LENGTH = 6;

/** 허용하는 원본 URL 최대 길이. */
export const MAX_URL_LENGTH = 2048;

/** 단축 코드 형식(6자리 영숫자). 라우트에서 DB 조회 전에 빠르게 거른다. */
export const SHORT_CODE_PATTERN = /^[A-Za-z0-9]{6}$/;

// 헷갈리기 쉬운 문자(0, O, 1, l, I)를 뺀 영숫자 57자(week03과 동일).
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

/**
 * 원본 URL의 SHA-256 해시로 단축 코드를 결정적으로 만든다.
 * 같은 URL은 항상 같은 코드가 된다.
 */
export function createShortCode(
  originalUrl: string,
  length = SHORT_CODE_LENGTH,
): string {
  const hash = createHash('sha256').update(originalUrl).digest();
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[hash[i] % ALPHABET.length];
  }
  return code;
}

export type ShortenErrorCode =
  | 'MISSING_URL'
  | 'URL_TOO_LONG'
  | 'INVALID_URL'
  | 'SELF_URL';

export type UrlValidationResult =
  | { ok: true; originalUrl: string }
  | { ok: false; code: ShortenErrorCode; message: string };

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

/** `example.com:3000` 형태의 Host 헤더에서 포트를 뗀 hostname만 반환한다. */
function hostnameOf(host: string): string {
  try {
    return new URL(`http://${host}`).hostname.toLowerCase();
  } catch {
    return host.toLowerCase();
  }
}

/**
 * 단축할 원본 URL을 검사한다.
 * - 원본 문자열은 trim만 하고 정규화하지 않는다(응답·리다이렉트에 원문 그대로 사용).
 * - 자기 서비스 URL은 요청의 host와 hostname이 같으면 막는다(프로토콜·경로 무관).
 */
export function validateOriginalUrl(
  raw: unknown,
  requestHost: string,
): UrlValidationResult {
  const originalUrl = typeof raw === 'string' ? raw.trim() : '';

  if (!originalUrl) {
    return {
      ok: false,
      code: 'MISSING_URL',
      message: 'Original URL is required.',
    };
  }

  if (originalUrl.length > MAX_URL_LENGTH) {
    return {
      ok: false,
      code: 'URL_TOO_LONG',
      message: `URL must be ${MAX_URL_LENGTH} characters or fewer.`,
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(originalUrl);
  } catch {
    return {
      ok: false,
      code: 'INVALID_URL',
      message: 'URL must start with http:// or https://.',
    };
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    return {
      ok: false,
      code: 'INVALID_URL',
      message: 'URL must start with http:// or https://.',
    };
  }

  if (parsed.hostname.toLowerCase() === hostnameOf(requestHost)) {
    return {
      ok: false,
      code: 'SELF_URL',
      message: 'URLs pointing to this service cannot be shortened.',
    };
  }

  return { ok: true, originalUrl };
}
