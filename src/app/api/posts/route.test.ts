import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const getAllPosts = vi.fn();
const createPost = vi.fn();

vi.mock('@/shared/database/queries', () => ({
  createPost: (input: unknown) => createPost(input),
}));

vi.mock('@/shared/libs/mdx', () => ({
  getAllPosts: () => getAllPosts(),
}));

import { GET, POST } from './route';

const URL = 'http://localhost/api/posts';

function jsonRequest(method: string, key: string | null, body?: unknown) {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
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
    getAllPosts.mockReset();
    createPost.mockReset();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('GET', () => {
    /** 발행일 내림차순(getAllPosts와 동일)으로 정렬된 가짜 글 n개 */
    const makePosts = (n: number) =>
      Array.from({ length: n }, (_, i) => ({
        slug: `post-${i + 1}`,
        title: `Post ${i + 1}`,
        date: `2025-01-${String(30 - i).padStart(2, '0')}`,
        description: '',
      }));

    it('is public: returns 200 without a key', async () => {
      getAllPosts.mockReturnValue(makePosts(1));
      const res = GET(new NextRequest(URL));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.posts).toHaveLength(1);
    });

    it('returns the first 10 posts by default', async () => {
      getAllPosts.mockReturnValue(makePosts(12));
      const body = await GET(new NextRequest(URL)).json();
      expect(body.posts).toHaveLength(10);
      expect(body.posts[0].slug).toBe('post-1');
      expect(body.pagination).toMatchObject({ page: 1, limit: 10, total: 12 });
    });

    it('slices the requested page and computes pagination metadata', async () => {
      getAllPosts.mockReturnValue(makePosts(7));
      const body = await GET(new NextRequest(`${URL}?page=2&limit=3`)).json();
      expect(body.posts.map((p: { slug: string }) => p.slug)).toEqual([
        'post-4',
        'post-5',
        'post-6',
      ]);
      expect(body.pagination).toEqual({
        page: 2,
        limit: 3,
        total: 7,
        totalPages: 3,
        hasNext: true,
      });
    });

    it('returns the remainder on the last page with hasNext=false', async () => {
      getAllPosts.mockReturnValue(makePosts(7));
      const body = await GET(new NextRequest(`${URL}?page=3&limit=3`)).json();
      expect(body.posts).toHaveLength(1);
      expect(body.pagination.hasNext).toBe(false);
    });

    it('returns an empty list for a page beyond the end', async () => {
      getAllPosts.mockReturnValue(makePosts(2));
      const res = GET(new NextRequest(`${URL}?page=9`));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.posts).toEqual([]);
      expect(body.pagination.totalPages).toBe(1);
      expect(body.pagination.hasNext).toBe(false);
    });

    it('handles no posts', async () => {
      getAllPosts.mockReturnValue([]);
      const body = await GET(new NextRequest(URL)).json();
      expect(body.posts).toEqual([]);
      expect(body.pagination).toMatchObject({
        total: 0,
        totalPages: 0,
        hasNext: false,
      });
    });

    it.each(['limit=0', 'limit=51', 'page=0', 'page=abc', 'limit=2.5'])(
      'returns 400 for invalid query %s',
      (query) => {
        const res = GET(new NextRequest(`${URL}?${query}`));
        expect(res.status).toBe(400);
        expect(getAllPosts).not.toHaveBeenCalled();
      },
    );

    it('sets CORS and cache headers', async () => {
      process.env.BLOG_CORS_ORIGINS = 'https://kkh-log.pages.dev';
      getAllPosts.mockReturnValue([]);
      const res = GET(
        new NextRequest(URL, {
          headers: { origin: 'https://kkh-log.pages.dev' },
        }),
      );
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://kkh-log.pages.dev',
      );
      expect(res.headers.get('Cache-Control')).toContain('s-maxage=60');
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
      const res = await POST(
        jsonRequest('POST', 'write-key', { title: 'only' }),
      );
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
