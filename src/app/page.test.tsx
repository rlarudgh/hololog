import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import HomePage from './page';
import { getAllPosts } from '@/shared/libs/mdx';

vi.mock('@/shared/libs/mdx', async () => {
  const actual = await vi.importActual('@/shared/libs/mdx');
  return { ...actual, getAllPosts: vi.fn() };
});

const mockPosts = Array.from({ length: 4 }, (_, i) => ({
  slug: `post-${i + 1}`,
  title: `Blog Post ${i + 1}`,
  date: `2024-01-0${4 - i}`,
  description: `Description ${i + 1}`,
  tags: ['nextjs'],
}));

describe('Home Page (blog list)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the blog heading', () => {
    (getAllPosts as Mock).mockReturnValue(mockPosts);
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '블로그',
    );
  });

  it('renders every post, not just the recent ones', () => {
    (getAllPosts as Mock).mockReturnValue(mockPosts);
    render(<HomePage />);
    for (const post of mockPosts) {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    }
    expect(screen.getByText('4 posts')).toBeInTheDocument();
  });

  it('links each post to its detail page', () => {
    (getAllPosts as Mock).mockReturnValue(mockPosts.slice(0, 1));
    render(<HomePage />);
    expect(screen.getByRole('link', { name: /Blog Post 1/ })).toHaveAttribute(
      'href',
      '/blog/post-1',
    );
  });

  it('shows an empty state when there are no posts', () => {
    (getAllPosts as Mock).mockReturnValue([]);
    render(<HomePage />);
    expect(screen.getByText('아직 발행된 글이 없습니다.')).toBeInTheDocument();
  });

  it('renders a search box', () => {
    (getAllPosts as Mock).mockReturnValue(mockPosts);
    render(<HomePage />);
    expect(
      screen.getByRole('searchbox', { name: '글 검색' }),
    ).toBeInTheDocument();
  });
});
