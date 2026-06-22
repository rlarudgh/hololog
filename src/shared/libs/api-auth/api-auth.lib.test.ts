import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { NextRequest } from 'next/server';
import {
  isAuthorized,
  requireApiKey,
  corsHeaders,
  handleOptions,
  unauthorized,
} from './api-auth.lib';

/** 헤더만 사용하는 헬퍼 함수들을 위한 최소 요청 객체를 만든다. */
function makeRequest(headers: Record<string, string> = {}): NextRequest {
  return { headers: new Headers(headers) } as unknown as NextRequest;
}

describe('api-auth', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.BLOG_API_KEYS = 'read-1, read-2';
    process.env.BLOG_API_WRITE_KEY = 'write-secret';
    process.env.BLOG_CORS_ORIGINS = '*';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('isAuthorized - read scope', () => {
    it('rejects when no key is provided', () => {
      expect(isAuthorized(makeRequest(), 'read')).toBe(false);
    });

    it('accepts a valid read key via x-api-key', () => {
      expect(isAuthorized(makeRequest({ 'x-api-key': 'read-1' }), 'read')).toBe(
        true,
      );
    });

    it('accepts a second configured read key', () => {
      expect(isAuthorized(makeRequest({ 'x-api-key': 'read-2' }), 'read')).toBe(
        true,
      );
    });

    it('accepts the write key for reads', () => {
      expect(
        isAuthorized(makeRequest({ 'x-api-key': 'write-secret' }), 'read'),
      ).toBe(true);
    });

    it('accepts a key via Authorization: Bearer', () => {
      expect(
        isAuthorized(
          makeRequest({ authorization: 'Bearer read-1' }),
          'read',
        ),
      ).toBe(true);
    });

    it('rejects an unknown key', () => {
      expect(
        isAuthorized(makeRequest({ 'x-api-key': 'nope' }), 'read'),
      ).toBe(false);
    });
  });

  describe('isAuthorized - write scope', () => {
    it('rejects a read key for writes', () => {
      expect(
        isAuthorized(makeRequest({ 'x-api-key': 'read-1' }), 'write'),
      ).toBe(false);
    });

    it('accepts the write key for writes', () => {
      expect(
        isAuthorized(makeRequest({ 'x-api-key': 'write-secret' }), 'write'),
      ).toBe(true);
    });

    it('rejects writes when no write key is configured', () => {
      delete process.env.BLOG_API_WRITE_KEY;
      expect(
        isAuthorized(makeRequest({ 'x-api-key': 'write-secret' }), 'write'),
      ).toBe(false);
    });
  });

  describe('requireApiKey', () => {
    it('returns null when authorized', () => {
      expect(
        requireApiKey(makeRequest({ 'x-api-key': 'read-1' }), 'read'),
      ).toBeNull();
    });

    it('returns a 401 response when unauthorized', async () => {
      const res = requireApiKey(makeRequest(), 'read');
      expect(res).not.toBeNull();
      expect(res!.status).toBe(401);
      const body = await res!.json();
      expect(body.error).toBe('Unauthorized');
    });
  });

  describe('CORS', () => {
    it('returns wildcard origin by default', () => {
      const headers = corsHeaders(makeRequest({ origin: 'https://a.com' }));
      expect(headers['Access-Control-Allow-Origin']).toBe('*');
      expect(headers['Access-Control-Allow-Methods']).toContain('DELETE');
    });

    it('echoes an allowed origin from the allowlist', () => {
      process.env.BLOG_CORS_ORIGINS = 'https://a.com, https://b.com';
      const headers = corsHeaders(makeRequest({ origin: 'https://b.com' }));
      expect(headers['Access-Control-Allow-Origin']).toBe('https://b.com');
    });

    it('falls back to the first allowed origin when not in the list', () => {
      process.env.BLOG_CORS_ORIGINS = 'https://a.com';
      const headers = corsHeaders(makeRequest({ origin: 'https://evil.com' }));
      expect(headers['Access-Control-Allow-Origin']).toBe('https://a.com');
    });

    it('handleOptions returns 204 with CORS headers', () => {
      const res = handleOptions(makeRequest({ origin: 'https://a.com' }));
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('unauthorized response carries CORS headers', () => {
      const res = unauthorized(makeRequest({ origin: 'https://a.com' }));
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });
});
