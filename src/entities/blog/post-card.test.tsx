import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PostCard } from './post-card.ui';
import type { BlogPost } from '@/shared/types/blog-type';

const mockPost: BlogPost = {
  slug: 'test-post',
  title: 'Test Blog Post',
  date: '2024-01-01',
  description: 'This is a test blog post description',
  tags: ['test', 'blog', 'nextjs'],
};

const mockPostWithoutTags: BlogPost = {
  slug: 'test-post-no-tags',
  title: 'Test Post Without Tags',
  date: '2024-01-02',
  description: 'This post has no tags',
};

describe('PostCard Component', () => {
  it('renders post information correctly', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(
      screen.getByText('This is a test blog post description'),
    ).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('renders tags when available', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('blog')).toBeInTheDocument();
    expect(screen.getByText('nextjs')).toBeInTheDocument();
  });

  it('does not render tags section when no tags', () => {
    render(<PostCard post={mockPostWithoutTags} />);

    expect(screen.queryByText('test')).not.toBeInTheDocument();
    // Should not have any tag elements
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('creates correct link to blog post', () => {
    render(<PostCard post={mockPost} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  it('has proper semantic structure', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});
