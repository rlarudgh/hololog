import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { ShortUrlStats } from '@/shared/database/queries';
import { ShortUrlStatsView } from './short-url-stats.ui';

const url = {
  shortCode: 'abc123',
  originalUrl: 'https://example.com/long',
  clicks: 5,
  createdAt: '2026-11-06T01:00:00.000Z',
};

const stats: ShortUrlStats = {
  summary: { totalUrls: 2, totalClicks: 5, clickedUrls: 1, topUrl: url },
  urls: [url, { ...url, shortCode: 'zzz999', clicks: 0 }],
};

describe('ShortUrlStatsView', () => {
  it('renders summary cards', () => {
    render(<ShortUrlStatsView stats={stats} />);
    expect(screen.getByText('전체 단축 URL 수').nextSibling).toHaveTextContent(
      '2',
    );
    expect(screen.getByText('/abc123')).toBeInTheDocument();
    expect(screen.getByText('5회 클릭')).toBeInTheDocument();
  });

  it('renders one table row per URL with a safe external link', () => {
    render(<ShortUrlStatsView stats={stats} />);
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(2);

    const link = within(rows[0]).getByRole('link', {
      name: 'https://example.com/long',
    });
    expect(link).toHaveAttribute('href', 'https://example.com/long');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows empty states', () => {
    render(
      <ShortUrlStatsView
        stats={{
          summary: {
            totalUrls: 0,
            totalClicks: 0,
            clickedUrls: 0,
            topUrl: null,
          },
          urls: [],
        }}
      />,
    );
    expect(screen.getByText('저장된 URL이 없습니다.')).toBeInTheDocument();
    expect(screen.getByText('아직 클릭 기록이 없습니다.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
