import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import HomePage from './page';
import { getAllPosts } from '@/shared/libs/mdx';

// Mock the getAllPosts function
vi.mock('@/shared/libs/mdx', async () => {
  const actual = await vi.importActual('@/shared/libs/mdx');

  return {
    ...actual,
    getAllPosts: vi.fn(),
  };
});

describe('Home Page', () => {
  const mockPosts = [
    {
      slug: 'first-post',
      title: 'First Blog Post',
      date: '2024-01-01',
      description: 'This is the first blog post description',
      tags: ['nextjs', 'react'],
    },
    {
      slug: 'second-post',
      title: 'Second Blog Post',
      date: '2024-01-02',
      description: 'This is the second blog post description',
      tags: ['typescript', 'testing'],
    },
    {
      slug: 'third-post',
      title: 'Third Blog Post',
      date: '2024-01-03',
      description: 'This is the third blog post description',
      tags: ['javascript', 'web'],
    },
    {
      slug: 'fourth-post',
      title: 'Fourth Blog Post',
      date: '2024-01-04',
      description: 'This is the fourth blog post description',
      tags: ['css', 'tailwind'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders welcome message and description', () => {
    (getAllPosts as Mock).mockReturnValue(mockPosts);

    render(<HomePage />);

    expect(screen.getByText(/Welcome to Hololog/i)).toBeInTheDocument();
    expect(
      screen.getByText(/개발 했던 일들을 기록하는 곳입니다/i),
    ).toBeInTheDocument();
  });

  it('renders main heading', () => {
    (getAllPosts as Mock).mockReturnValue(mockPosts);

    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Welcome to Hololog',
    );
  });

  it('has proper semantic structure', () => {
    (getAllPosts as Mock).mockReturnValue(mockPosts);

    render(<HomePage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders recent posts when posts exist', () => {
    (getAllPosts as Mock).mockReturnValue(mockPosts);

    render(<HomePage />);

    // Should only show first 3 posts
    expect(screen.getByText('First Blog Post')).toBeInTheDocument();
    expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
    expect(screen.getByText('Third Blog Post')).toBeInTheDocument();
    // Fourth post should not be visible (only showing 3)
    expect(screen.queryByText('Fourth Blog Post')).not.toBeInTheDocument();
  });

  it('shows fallback message when no posts exist', () => {
    (getAllPosts as Mock).mockReturnValue([]);

    render(<HomePage />);

    expect(screen.getByText(/아직 게시물이 없습니다/i)).toBeInTheDocument();
  });

  it('renders "view all posts" link when more than 3 posts exist', () => {
    (getAllPosts as Mock).mockReturnValue(mockPosts); // 4 posts

    render(<HomePage />);

    expect(
      screen.getByRole('link', { name: /모든 게시물 보기/i }),
    ).toHaveAttribute('href', '/blog');
  });

  it('does not render "view all posts" link when 3 or fewer posts exist', () => {
    const fewerPosts = mockPosts.slice(0, 3);
    (getAllPosts as Mock).mockReturnValue(fewerPosts);

    render(<HomePage />);

    expect(
      screen.queryByRole('link', { name: /모든 게시물 보기/i }),
    ).not.toBeInTheDocument();
  });
});
