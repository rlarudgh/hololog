import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const headerStore = new Headers();
const getShortUrlStats = vi.fn();
const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});

vi.mock('next/headers', () => ({ headers: async () => headerStore }));
vi.mock('next/navigation', () => ({ notFound: () => notFound() }));
vi.mock('@/shared/database/queries', () => ({
  getShortUrlStats: () => getShortUrlStats(),
}));

import AdminPage from './page';

describe('/admin page', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 's3cret';
    headerStore.delete('authorization');
    getShortUrlStats.mockReset();
    notFound.mockClear();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('refuses to render without valid Basic credentials', async () => {
    await expect(AdminPage()).rejects.toThrow('NEXT_NOT_FOUND');
    expect(getShortUrlStats).not.toHaveBeenCalled();
  });

  it('renders stats for an authenticated admin', async () => {
    headerStore.set(
      'authorization',
      `Basic ${Buffer.from('admin:s3cret').toString('base64')}`,
    );
    getShortUrlStats.mockResolvedValue({
      summary: { totalUrls: 0, totalClicks: 0, clickedUrls: 0, topUrl: null },
      urls: [],
    });

    render(await AdminPage());
    expect(
      screen.getByRole('heading', { name: 'URL Shortener 관리자' }),
    ).toBeInTheDocument();
    expect(screen.getByText('저장된 URL이 없습니다.')).toBeInTheDocument();
  });
});
