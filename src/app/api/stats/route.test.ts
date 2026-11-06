import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const getShortUrlStats = vi.fn();

vi.mock('@/shared/database/queries', () => ({
  getShortUrlStats: () => getShortUrlStats(),
}));

import { GET } from './route';

const stats = {
  summary: { totalUrls: 1, totalClicks: 3, clickedUrls: 1, topUrl: null },
  urls: [],
};

function req(authorization?: string) {
  return new NextRequest('http://localhost/api/stats', {
    headers: authorization ? { authorization } : {},
  });
}

const valid = `Basic ${Buffer.from('admin:s3cret').toString('base64')}`;

describe('GET /api/stats', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    getShortUrlStats.mockReset();
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 's3cret';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns 401 with a Basic challenge without credentials', async () => {
    const res = await GET(req());
    expect(res.status).toBe(401);
    expect(res.headers.get('www-authenticate')).toBe('Basic realm="Admin"');
    expect(getShortUrlStats).not.toHaveBeenCalled();
  });

  it('returns stats JSON with valid credentials', async () => {
    getShortUrlStats.mockResolvedValue(stats);
    const res = await GET(req(valid));
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.json()).toEqual(stats);
  });

  it('returns 500 STATS_ERROR when the query fails', async () => {
    getShortUrlStats.mockRejectedValue(new Error('db down'));
    const res = await GET(req(valid));
    expect(res.status).toBe(500);
    expect((await res.json()).error.code).toBe('STATS_ERROR');
  });
});
