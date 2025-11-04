import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getAllPosts, getPostBySlug } from './mdx.lib';

// Mock fs module
vi.mock('fs');
vi.mock('path');

const mockFs = vi.mocked(fs);
const mockPath = vi.mocked(path);

describe('MDX Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup path mocks
    mockPath.join.mockImplementation((...args) => args.join('/'));

    // Mock process.cwd()
    vi.stubGlobal('process', {
      cwd: () => '/mock/project',
    });

    // Mock fs.existsSync to return true by default
    mockFs.existsSync.mockReturnValue(true);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getAllPosts', () => {
    it('returns empty array when no MDX files', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        'README.md',
        'package.json',
      ] as never[]);

      const posts = getAllPosts();
      expect(posts).toEqual([]);
    });

    it('returns empty array when directory does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);

      const posts = getAllPosts();
      expect(posts).toEqual([]);
    });

    it('processes MDX files correctly', () => {
      const mockFileContent = `---
title: "Test Post"
date: "2024-01-01"
description: "Test description"
tags: ["test", "blog"]
---

# Test Content`;

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        'test-post.mdx',
        'another-post.mdx',
      ] as never[]);
      mockFs.readFileSync.mockReturnValue(mockFileContent);

      const posts = getAllPosts();

      expect(posts).toHaveLength(2);
      expect(posts.some((post) => post.slug === 'test-post')).toBe(true);
      expect(posts.some((post) => post.slug === 'another-post')).toBe(true);
      expect(posts[0]).toMatchObject({
        title: 'Test Post',
        date: '2024-01-01',
        description: 'Test description',
        tags: ['test', 'blog'],
      });
    });

    it('sorts posts by date descending', () => {
      const olderPost = `---
title: "Older Post"
date: "2024-01-01"
description: "Older post"
---

Content`;

      const newerPost = `---
title: "Newer Post"
date: "2024-01-02"
description: "Newer post"
---

Content`;

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['older.mdx', 'newer.mdx'] as never[]);
      mockFs.readFileSync
        .mockReturnValueOnce(olderPost)
        .mockReturnValueOnce(newerPost);

      const posts = getAllPosts();

      expect(posts[0].title).toBe('Newer Post');
      expect(posts[1].title).toBe('Older Post');
    });
  });

  describe('getPostBySlug', () => {
    it('returns null for non-existent post', () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      const post = getPostBySlug('non-existent');
      expect(post).toBeNull();
    });

    it('returns post data for existing post', () => {
      const mockFileContent = `---
title: "Test Post"
date: "2024-01-01"
description: "Test description"
---

# Test Content

This is the main content.`;

      mockFs.readFileSync.mockReturnValue(mockFileContent);

      const post = getPostBySlug('test-post');

      expect(post).toMatchObject({
        metadata: {
          title: 'Test Post',
          date: '2024-01-01',
          description: 'Test description',
        },
        content: expect.stringContaining('# Test Content'),
      });
    });

    it('handles posts without frontmatter', () => {
      const mockFileContent = `# Just Content

No frontmatter here.`;

      mockFs.readFileSync.mockReturnValue(mockFileContent);

      const post = getPostBySlug('no-frontmatter');

      expect(post?.metadata.title).toBe('Untitled');
      expect(post?.content).toContain('# Just Content');
    });
  });
});
