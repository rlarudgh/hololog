import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HomePostCard } from './home-post-card.ui';
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

describe('HomePostCard Component', () => {
  it('renders post information correctly', () => {
    render(<HomePostCard post={mockPost} />);

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(
      screen.getByText('This is a test blog post description'),
    ).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('renders link to the correct blog post', () => {
    render(<HomePostCard post={mockPost} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  it('renders tags when available', () => {
    render(<HomePostCard post={mockPost} />);

    expect(screen.getByText('#test')).toBeInTheDocument();
    expect(screen.getByText('#blog')).toBeInTheDocument();
    expect(screen.getByText('#nextjs')).toBeInTheDocument();
  });

  it('does not render tags section when no tags', () => {
    render(<HomePostCard post={mockPostWithoutTags} />);

    expect(screen.queryByText('#test')).not.toBeInTheDocument();
    expect(screen.queryByText('#blog')).not.toBeInTheDocument();
  });

  it('shows at most 3 tags', () => {
    const postWithMoreTags: BlogPost = {
      ...mockPost,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'], // 5 tags
    };

    render(<HomePostCard post={postWithMoreTags} />);

    // Should show only first 3 tags
    expect(screen.getByText('#tag1')).toBeInTheDocument();
    expect(screen.getByText('#tag2')).toBeInTheDocument();
    expect(screen.getByText('#tag3')).toBeInTheDocument();
    // Should not show 4th and 5th tags
    expect(screen.queryByText('#tag4')).not.toBeInTheDocument();
    expect(screen.queryByText('#tag5')).not.toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<HomePostCard post={mockPost} />);

    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('shows "Read more" indicator', () => {
    render(<HomePostCard post={mockPost} />);

    expect(screen.getByText('Read more →')).toBeInTheDocument();
  });
});
