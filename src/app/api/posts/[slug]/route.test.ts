import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const getPostBySlug = vi.fn();
const updatePost = vi.fn();
const deletePost = vi.fn();

vi.mock('@/shared/database/queries', () => ({
  getPostBySlug: (slug: string) => getPostBySlug(slug),
  updatePost: (slug: string, input: unknown) => updatePost(slug, input),
  deletePost: (slug: string) => deletePost(slug),
}));

import { GET, PUT, DELETE } from './route';

const URL = 'http://localhost/api/posts/hello';
const ctx = { params: Promise.resolve({ slug: 'hello' }) };

function req(method: string, key: string | null, body?: unknown) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (key) headers['x-api-key'] = key;
  return new NextRequest(URL, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('/api/posts/[slug]', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.BLOG_API_KEYS = 'read-key';
    process.env.BLOG_API_WRITE_KEY = 'write-key';
    getPostBySlug.mockReset();
    updatePost.mockReset();
    deletePost.mockReset();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('GET', () => {
    it('401 without a key', async () => {
      const res = await GET(new NextRequest(URL), ctx);
      expect(res.status).toBe(401);
    });

    it('404 when missing', async () => {
      getPostBySlug.mockResolvedValue(null);
      const res = await GET(req('GET', 'read-key'), ctx);
      expect(res.status).toBe(404);
    });

    it('200 with content', async () => {
      getPostBySlug.mockResolvedValue({ slug: 'hello', content: 'x' });
      const res = await GET(req('GET', 'read-key'), ctx);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.post.slug).toBe('hello');
    });
  });

  describe('PUT', () => {
    it('rejects a read key (401)', async () => {
      const res = await PUT(req('PUT', 'read-key', { title: 'New' }), ctx);
      expect(res.status).toBe(401);
    });

    it('404 when post does not exist', async () => {
      updatePost.mockResolvedValue(null);
      const res = await PUT(req('PUT', 'write-key', { title: 'New' }), ctx);
      expect(res.status).toBe(404);
    });

    it('200 on success', async () => {
      updatePost.mockResolvedValue({ slug: 'hello', title: 'New' });
      const res = await PUT(req('PUT', 'write-key', { title: 'New' }), ctx);
      expect(res.status).toBe(200);
      expect(updatePost).toHaveBeenCalledWith('hello', { title: 'New' });
    });
  });

  describe('DELETE', () => {
    it('rejects a read key (401)', async () => {
      const res = await DELETE(req('DELETE', 'read-key'), ctx);
      expect(res.status).toBe(401);
    });

    it('404 when nothing was deleted', async () => {
      deletePost.mockResolvedValue(false);
      const res = await DELETE(req('DELETE', 'write-key'), ctx);
      expect(res.status).toBe(404);
    });

    it('200 on success', async () => {
      deletePost.mockResolvedValue(true);
      const res = await DELETE(req('DELETE', 'write-key'), ctx);
      expect(res.status).toBe(200);
    });
  });
});
