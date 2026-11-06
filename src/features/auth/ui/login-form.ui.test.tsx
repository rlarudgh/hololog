import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const replace = vi.fn();
const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, refresh }),
}));

import { LoginForm } from './login-form.ui';

const fetchMock = vi.fn();

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText('이메일'), {
    target: { value: 'admin@example.com' },
  });
  fireEvent.change(screen.getByLabelText('비밀번호'), {
    target: { value: 'pw' },
  });
  fireEvent.click(screen.getByRole('button', { name: '로그인' }));
}

describe('LoginForm', () => {
  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('disables submit until both fields are filled', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
  });

  it('posts credentials and navigates to next on success', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 });
    render(<LoginForm next="/admin/posts" />);
    fillAndSubmit();

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/admin/posts'));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'admin@example.com', password: 'pw' }),
      }),
    );
    expect(refresh).toHaveBeenCalled();
  });

  it('ignores external next targets', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 });
    render(<LoginForm next="//evil.com" />);
    fillAndSubmit();
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/admin'));
  });

  it.each([
    [401, '이메일 또는 비밀번호가 올바르지 않습니다.'],
    [403, '관리자 권한이 없는 계정입니다.'],
    [500, '로그인에 실패했습니다.'],
  ])('shows an error for %i', async (status, message) => {
    fetchMock.mockResolvedValue({ ok: false, status });
    render(<LoginForm />);
    fillAndSubmit();

    expect(await screen.findByRole('alert')).toHaveTextContent(message);
    expect(replace).not.toHaveBeenCalled();
  });

  it('shows a network error', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));
    render(<LoginForm />);
    fillAndSubmit();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      '네트워크 오류가 발생했습니다.',
    );
  });
});
