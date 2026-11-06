import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Drizzle 쿼리 빌더 체인을 흉내 낸다. 체인 끝(await)에서 큐에 넣어 둔 결과를 순서대로 반환한다.
 */
const results: unknown[][] = [];
const calls: { method: string; args: unknown[] }[] = [];

function chain(): unknown {
  const target = {
    then(resolve: (value: unknown) => void, reject: (e: unknown) => void) {
      const next = results.shift();
      return Promise.resolve(next ?? []).then(resolve, reject);
    },
  };
  return new Proxy(target, {
    get(obj, prop) {
      if (prop === 'then') return obj.then;
      return (...args: unknown[]) => {
        calls.push({ method: String(prop), args });
        return chain();
      };
    },
  });
}

vi.mock('../db', () => ({
  db: new Proxy(
    {},
    {
      get:
        (_t, prop) =>
        (...args: unknown[]) => {
          calls.push({ method: String(prop), args });
          return chain();
        },
    },
  ),
}));

import {
  getShortUrlStats,
  resolveShortUrl,
  upsertShortUrl,
} from './short-url.query';

const createdAt = new Date('2026-11-06T00:00:00.000Z');
const row = (overrides = {}) => ({
  id: 'id',
  shortCode: 'abc123',
  originalUrl: 'https://example.com',
  clicks: 0,
  createdAt,
  ...overrides,
});

describe('short-url queries', () => {
  beforeEach(() => {
    results.length = 0;
    calls.length = 0;
  });

  describe('upsertShortUrl', () => {
    it('returns created=true when the insert succeeds', async () => {
      results.push([row()]);
      const result = await upsertShortUrl('abc123', 'https://example.com');
      expect(result).toEqual({
        created: true,
        shortUrl: {
          shortCode: 'abc123',
          originalUrl: 'https://example.com',
          clicks: 0,
          createdAt: createdAt.toISOString(),
        },
      });
      expect(calls.map((c) => c.method)).toContain('onConflictDoNothing');
    });

    it('returns the existing row with created=false on conflict', async () => {
      results.push([], [row({ shortCode: 'old999', clicks: 4 })]);
      const result = await upsertShortUrl('abc123', 'https://example.com');
      expect(result.created).toBe(false);
      expect(result.shortUrl.shortCode).toBe('old999');
      expect(result.shortUrl.clicks).toBe(4);
    });

    it('throws if the conflicting row cannot be found', async () => {
      results.push([], []);
      await expect(
        upsertShortUrl('abc123', 'https://example.com'),
      ).rejects.toThrow('disappeared');
    });
  });

  describe('resolveShortUrl', () => {
    it('returns the original URL after incrementing clicks', async () => {
      results.push([{ originalUrl: 'https://example.com' }]);
      expect(await resolveShortUrl('abc123')).toBe('https://example.com');
      expect(calls.map((c) => c.method)).toEqual(
        expect.arrayContaining(['update', 'set', 'where', 'returning']),
      );
    });

    it('returns null for an unknown code', async () => {
      results.push([]);
      expect(await resolveShortUrl('ZZZZZZ')).toBeNull();
    });
  });

  describe('getShortUrlStats', () => {
    it('maps totals (numeric strings) and picks the most-clicked URL', async () => {
      results.push(
        [{ totalUrls: 2, totalClicks: '7', clickedUrls: '1' }],
        [row({ clicks: 7 }), row({ shortCode: 'zzz999', clicks: 0 })],
      );
      const stats = await getShortUrlStats();
      expect(stats.summary).toMatchObject({
        totalUrls: 2,
        totalClicks: 7,
        clickedUrls: 1,
      });
      expect(stats.summary.topUrl?.shortCode).toBe('abc123');
      expect(stats.urls).toHaveLength(2);
    });

    it('handles an empty table', async () => {
      results.push([{ totalUrls: 0, totalClicks: null, clickedUrls: 0 }], []);
      const stats = await getShortUrlStats();
      expect(stats).toEqual({
        summary: { totalUrls: 0, totalClicks: 0, clickedUrls: 0, topUrl: null },
        urls: [],
      });
    });

    it('has no top URL when nothing was clicked', async () => {
      results.push(
        [{ totalUrls: 1, totalClicks: '0', clickedUrls: '0' }],
        [row()],
      );
      expect((await getShortUrlStats()).summary.topUrl).toBeNull();
    });
  });
});
