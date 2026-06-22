import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const listPosts = vi.fn();
const createPost = vi.fn();

vi.mock('@/shared/database/queries', () => ({
  listPosts: () => listPosts(),
  createPost: (input: unknown) => createPost(input),
}));

import { GET, POST } from './route';

const URL = 'http://localhost/api/posts';

function jsonRequest(method: string, key: string | null, body?: unknown) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (key) headers['x-api-key'] = key;
  return new NextRequest(URL, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('/api/posts', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.BLOG_API_KEYS = 'read-key';
    process.env.BLOG_API_WRITE_KEY = 'write-key';
    listPosts.mockReset();
    createPost.mockReset();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('GET', () => {
    it('returns 401 without a key', async () => {
      const res = await GET(new NextRequest(URL));
      expect(res.status).toBe(401);
    });

    it('returns posts with a valid read key', async () => {
      listPosts.mockResolvedValue([{ slug: 'a', title: 'A', date: '2025-01-01', description: '' }]);
      const res = await GET(jsonRequest('GET', 'read-key'));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.posts).toHaveLength(1);
    });
  });

  describe('POST', () => {
    const validBody = {
      slug: 'new-post',
      title: 'New',
      description: 'desc',
      content: '# body',
      tags: ['x'],
    };

    it('rejects a read key (401)', async () => {
      const res = await POST(jsonRequest('POST', 'read-key', validBody));
      expect(res.status).toBe(401);
      expect(createPost).not.toHaveBeenCalled();
    });

    it('creates a post with the write key (201)', async () => {
      createPost.mockResolvedValue({ ...validBody, date: '2025-01-01' });
      const res = await POST(jsonRequest('POST', 'write-key', validBody));
      expect(res.status).toBe(201);
      expect(createPost).toHaveBeenCalledOnce();
    });

    it('returns 400 on invalid body', async () => {
      const res = await POST(jsonRequest('POST', 'write-key', { title: 'only' }));
      expect(res.status).toBe(400);
      expect(createPost).not.toHaveBeenCalled();
    });

    it('returns 409 when creation fails (duplicate slug)', async () => {
      createPost.mockRejectedValue(new Error('unique violation'));
      const res = await POST(jsonRequest('POST', 'write-key', validBody));
      expect(res.status).toBe(409);
    });
  });
});
