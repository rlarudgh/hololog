import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { createShortCode } from '@/shared/libs/short-url';

const upsertShortUrl = vi.fn();

vi.mock('@/shared/database/queries', () => ({
  upsertShortUrl: (code: string, url: string) => upsertShortUrl(code, url),
}));

import { POST } from './route';

function post(body: unknown, base = 'http://localhost:3000') {
  return new NextRequest(`${base}/api/shorten`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function stored(shortCode: string, originalUrl: string, created: boolean) {
  return {
    shortUrl: { shortCode, originalUrl, clicks: 0, createdAt: '' },
    created,
  };
}

describe('POST /api/shorten', () => {
  beforeEach(() => {
    upsertShortUrl.mockReset();
    upsertShortUrl.mockImplementation(async (code: string, url: string) =>
      stored(code, url, true),
    );
  });

  it('returns 201 with shortCode, shortUrl and originalUrl', async () => {
    const url = 'https://example.com/?iscu_check=abc';
    const res = await POST(post({ originalUrl: url }));
    expect(res.status).toBe(201);

    const body = await res.json();
    const code = createShortCode(url);
    expect(body).toEqual({
      shortCode: code,
      shortUrl: `http://localhost:3000/${code}`,
      originalUrl: url,
    });
    expect(body.shortCode).toMatch(/^[A-Za-z0-9]{6}$/);
    expect(upsertShortUrl).toHaveBeenCalledWith(code, url);
  });

  it('returns 200 with the existing code for a duplicate URL', async () => {
    upsertShortUrl.mockResolvedValue(
      stored('Exist1', 'https://example.com', false),
    );
    const res = await POST(post({ originalUrl: 'https://example.com' }));
    expect(res.status).toBe(200);
    expect((await res.json()).shortCode).toBe('Exist1');
  });

  it('builds shortUrl from forwarded host/proto (Vercel)', async () => {
    const req = new NextRequest('http://internal/api/shorten', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-host': 'hololog.vercel.app',
        'x-forwarded-proto': 'https',
      },
      body: JSON.stringify({ originalUrl: 'https://example.com' }),
    });
    const body = await (await POST(req)).json();
    expect(body.shortUrl).toBe(`https://hololog.vercel.app/${body.shortCode}`);
  });

  it.each([
    {},
    { originalUrl: '' },
    { originalUrl: '   ' },
    { originalUrl: 1 },
  ])('returns 400 MISSING_URL for %j', async (payload) => {
    const res = await POST(post(payload));
    expect(res.status).toBe(400);
    expect((await res.json()).error.code).toBe('MISSING_URL');
    expect(upsertShortUrl).not.toHaveBeenCalled();
  });

  it.each(['not json', 'null', '[]'])(
    'returns 400 MISSING_URL for body %s',
    async (raw) => {
      const res = await POST(post(raw));
      expect(res.status).toBe(400);
      expect((await res.json()).error.code).toBe('MISSING_URL');
    },
  );

  it.each(['not-a-url', 'javascript:alert(1)'])(
    'returns 400 INVALID_URL for %s',
    async (originalUrl) => {
      const res = await POST(post({ originalUrl }));
      expect(res.status).toBe(400);
      const { error } = await res.json();
      expect(error.code).toBe('INVALID_URL');
      expect(error.message).toEqual(expect.any(String));
    },
  );

  it.each([
    'https://hololog.vercel.app',
    'https://hololog.vercel.app/abc123',
    'http://hololog.vercel.app/xyz',
  ])('returns 400 SELF_URL for %s', async (originalUrl) => {
    const res = await POST(post({ originalUrl }, 'https://hololog.vercel.app'));
    expect(res.status).toBe(400);
    expect((await res.json()).error.code).toBe('SELF_URL');
  });

  it('returns 400 SELF_URL for localhost:3000 URLs locally', async () => {
    const res = await POST(post({ originalUrl: 'http://localhost:3000/abc' }));
    expect(res.status).toBe(400);
  });

  it('allows other *.vercel.app URLs', async () => {
    const originalUrl = 'https://other-123.vercel.app/sample';
    const res = await POST(post({ originalUrl }, 'https://hololog.vercel.app'));
    expect(res.status).toBe(201);
    expect((await res.json()).originalUrl).toBe(originalUrl);
  });

  it('returns 500 INTERNAL_ERROR when the database fails', async () => {
    upsertShortUrl.mockRejectedValue(new Error('db down'));
    const res = await POST(post({ originalUrl: 'https://example.com' }));
    expect(res.status).toBe(500);
    expect((await res.json()).error.code).toBe('INTERNAL_ERROR');
  });
});
