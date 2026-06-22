import { describe, it, expect, vi, beforeEach } from 'vitest';

const getAllPosts = vi.fn();
const getPostBySlug = vi.fn();

vi.mock('./mdx.lib', () => ({
  getAllPosts: () => getAllPosts(),
  getPostBySlug: (slug: string) => getPostBySlug(slug),
}));

import { collectMdxPosts } from './collect-posts.lib';

describe('collectMdxPosts', () => {
  beforeEach(() => {
    getAllPosts.mockReset();
    getPostBySlug.mockReset();
  });

  it('combines summary metadata with full content', () => {
    getAllPosts.mockReturnValue([
      {
        slug: 'hello',
        title: 'Hello',
        date: '2025-01-01',
        description: 'desc',
        tags: ['a', 'b'],
      },
    ]);
    getPostBySlug.mockReturnValue({
      metadata: {},
      content: '# Hello body',
    });

    const result = collectMdxPosts();

    expect(result).toEqual([
      {
        slug: 'hello',
        title: 'Hello',
        description: 'desc',
        content: '# Hello body',
        date: '2025-01-01',
        tags: ['a', 'b'],
      },
    ]);
  });

  it('skips posts whose content cannot be loaded', () => {
    getAllPosts.mockReturnValue([
      { slug: 'a', title: 'A', date: '2025-01-01', description: '' },
      { slug: 'b', title: 'B', date: '2025-01-02', description: '' },
    ]);
    getPostBySlug.mockImplementation((slug: string) =>
      slug === 'a' ? { metadata: {}, content: 'A body' } : null,
    );

    const result = collectMdxPosts();

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('a');
  });

  it('returns an empty array when there are no posts', () => {
    getAllPosts.mockReturnValue([]);
    expect(collectMdxPosts()).toEqual([]);
  });
});
