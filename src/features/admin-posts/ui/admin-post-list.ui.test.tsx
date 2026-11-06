import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AdminPostSummary } from '@/shared/database/queries';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}));

import { AdminPostList } from './admin-post-list.ui';

const posts: AdminPostSummary[] = [
  {
    slug: 'published-post',
    title: 'Published',
    date: '2026-01-02',
    description: '',
    published: true,
    source: 'mdx',
  },
  {
    slug: 'draft-post',
    title: 'Draft',
    date: '2026-01-01',
    description: '',
    published: false,
    source: 'api',
  },
];

describe('AdminPostList', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    refresh.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('shows an empty state', () => {
    render(<AdminPostList posts={[]} />);
    expect(screen.getByText('글이 없습니다.')).toBeInTheDocument();
  });

  it('links only published posts', () => {
    render(<AdminPostList posts={posts} />);
    expect(screen.getByRole('link', { name: 'Published' })).toHaveAttribute(
      'href',
      '/blog/published-post',
    );
    expect(
      screen.queryByRole('link', { name: 'Draft' }),
    ).not.toBeInTheDocument();
  });

  it('toggles the published flag', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 });
    render(<AdminPostList posts={posts} />);
    fireEvent.click(screen.getByRole('button', { name: '발행' }));

    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/posts/draft-post',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ published: true }),
      }),
    );
  });

  it('requires a confirmation step before deleting', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 });
    render(<AdminPostList posts={posts} />);

    fireEvent.click(screen.getByRole('button', { name: 'Draft 삭제' }));
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: '삭제 확인' }));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/posts/draft-post', {
        method: 'DELETE',
      }),
    );
  });

  it('can cancel a pending delete', async () => {
    render(<AdminPostList posts={posts} />);
    fireEvent.click(screen.getByRole('button', { name: 'Draft 삭제' }));
    fireEvent.click(screen.getByRole('button', { name: '취소' }));
    expect(
      screen.queryByRole('button', { name: '삭제 확인' }),
    ).not.toBeInTheDocument();
  });

  it('shows an error when the request fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401 });
    render(<AdminPostList posts={posts} />);
    fireEvent.click(screen.getByRole('button', { name: '발행 취소' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '발행 상태 변경에 실패했습니다. (401)',
    );
    expect(refresh).not.toHaveBeenCalled();
  });

  it('shows a network error', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));
    render(<AdminPostList posts={posts} />);
    fireEvent.click(screen.getByRole('button', { name: '발행 취소' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('네트워크 오류');
  });
});
