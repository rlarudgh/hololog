import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const replace = vi.fn();
const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, refresh }),
}));

import { LogoutButton } from './logout-button.ui';

describe('LogoutButton', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('logs out and returns to /login', async () => {
    fetchMock.mockResolvedValue({ ok: true });
    render(<LogoutButton />);
    fireEvent.click(screen.getByRole('button', { name: '로그아웃' }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST',
    });
    expect(refresh).toHaveBeenCalled();
  });
});
