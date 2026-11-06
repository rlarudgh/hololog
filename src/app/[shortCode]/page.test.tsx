import { describe, it, expect, vi, beforeEach } from 'vitest';

const resolveShortUrl = vi.fn();

// Next.js의 notFound()/redirect()는 예외를 던져 렌더링을 중단한다. 같은 방식으로 흉내 낸다.
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  },
}));

vi.mock('@/shared/database/queries', () => ({
  resolveShortUrl: (code: string) => resolveShortUrl(code),
}));

import ShortCodePage, { dynamic } from './page';

function render(shortCode: string) {
  return ShortCodePage({ params: Promise.resolve({ shortCode }) });
}

describe('/[shortCode] page', () => {
  beforeEach(() => resolveShortUrl.mockReset());

  it('is always rendered per request (no-store)', () => {
    expect(dynamic).toBe('force-dynamic');
  });

  it('redirects to the original URL verbatim', async () => {
    const original = 'https://Example.COM/Path/../A?x=1&y=%2F';
    resolveShortUrl.mockResolvedValue(original);

    await expect(render('abc123')).rejects.toThrow(`NEXT_REDIRECT ${original}`);
    expect(resolveShortUrl).toHaveBeenCalledWith('abc123');
  });

  it('shows the 404 page for an unknown code', async () => {
    resolveShortUrl.mockResolvedValue(null);
    await expect(render('ZZZZZZ')).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it.each(['abc12', 'abc1234', 'ab-123', 'nope'])(
    'shows the 404 page without a DB lookup for malformed code %s',
    async (code) => {
      await expect(render(code)).rejects.toThrow('NEXT_NOT_FOUND');
      expect(resolveShortUrl).not.toHaveBeenCalled();
    },
  );
});
