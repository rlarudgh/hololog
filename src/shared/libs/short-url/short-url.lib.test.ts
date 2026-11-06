import { describe, it, expect } from 'vitest';
import {
  MAX_URL_LENGTH,
  SHORT_CODE_PATTERN,
  createShortCode,
  validateOriginalUrl,
} from './short-url.lib';

describe('createShortCode', () => {
  it('returns a 6-character alphanumeric code', () => {
    const code = createShortCode('https://example.com/');
    expect(code).toMatch(SHORT_CODE_PATTERN);
  });

  it('is deterministic for the same URL', () => {
    const url = 'https://example.com/?iscu_check=abc';
    expect(createShortCode(url)).toBe(createShortCode(url));
  });

  it('differs for different URLs', () => {
    expect(createShortCode('https://a.example.com')).not.toBe(
      createShortCode('https://b.example.com'),
    );
  });

  it('avoids ambiguous characters', () => {
    for (let i = 0; i < 200; i++) {
      expect(createShortCode(`https://example.com/${i}`)).not.toMatch(
        /[0O1lI]/,
      );
    }
  });

  it('supports a custom length', () => {
    expect(createShortCode('https://example.com', 8)).toHaveLength(8);
  });
});

describe('SHORT_CODE_PATTERN', () => {
  it.each(['abc123', 'ABCDEF', 'a1B2c3'])('accepts %s', (code) => {
    expect(SHORT_CODE_PATTERN.test(code)).toBe(true);
  });

  it.each(['abc12', 'abc1234', 'abc-12', 'about', 'résumé'])(
    'rejects %s',
    (code) => {
      expect(SHORT_CODE_PATTERN.test(code)).toBe(false);
    },
  );
});

describe('validateOriginalUrl', () => {
  const host = 'hololog.vercel.app';

  it.each([undefined, null, 42, '', '   '])(
    'returns MISSING_URL for %p',
    (raw) => {
      const result = validateOriginalUrl(raw, host);
      expect(result).toMatchObject({ ok: false, code: 'MISSING_URL' });
    },
  );

  it('returns URL_TOO_LONG past the limit', () => {
    const url = `https://example.com/${'a'.repeat(MAX_URL_LENGTH)}`;
    expect(validateOriginalUrl(url, host)).toMatchObject({
      ok: false,
      code: 'URL_TOO_LONG',
    });
  });

  it.each([
    'not-a-url',
    'javascript:alert(1)',
    'ftp://example.com',
    'mailto:a@b.c',
  ])('returns INVALID_URL for %s', (raw) => {
    expect(validateOriginalUrl(raw, host)).toMatchObject({
      ok: false,
      code: 'INVALID_URL',
    });
  });

  it.each([
    'https://hololog.vercel.app',
    'https://hololog.vercel.app/abc123',
    'http://hololog.vercel.app/xyz',
    'https://HOLOLOG.vercel.app/',
  ])('returns SELF_URL for %s', (raw) => {
    expect(validateOriginalUrl(raw, host)).toMatchObject({
      ok: false,
      code: 'SELF_URL',
    });
  });

  it('compares hostnames without the port (localhost:3000)', () => {
    expect(
      validateOriginalUrl('http://localhost:3000/abc123', 'localhost:3000'),
    ).toMatchObject({ ok: false, code: 'SELF_URL' });
    expect(
      validateOriginalUrl('http://localhost:4000', 'localhost:3000'),
    ).toMatchObject({ ok: false, code: 'SELF_URL' });
  });

  it('allows other *.vercel.app hosts', () => {
    expect(
      validateOriginalUrl('https://other-abc.vercel.app/sample', host),
    ).toEqual({ ok: true, originalUrl: 'https://other-abc.vercel.app/sample' });
  });

  it('trims but otherwise keeps the original string', () => {
    expect(validateOriginalUrl('  https://Example.com/A?b=1  ', host)).toEqual({
      ok: true,
      originalUrl: 'https://Example.com/A?b=1',
    });
  });
});
