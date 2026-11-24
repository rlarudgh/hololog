import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// 테스트 환경에는 localStorage가 없으므로 메모리 기반 대체물을 둔다.
const store = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => void store.set(key, value),
  removeItem: (key: string) => void store.delete(key),
  clear: () => store.clear(),
});
import {
  resolveTheme,
  setTheme,
  getCurrentTheme,
  THEME_INIT_SCRIPT,
} from './theme.lib';
import { ThemeToggle } from './ui/theme-toggle.ui';

describe('resolveTheme', () => {
  it('uses a stored theme first', () => {
    expect(resolveTheme('dark', false)).toBe('dark');
    expect(resolveTheme('light', true)).toBe('light');
  });

  it('falls back to the system preference', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });

  it('ignores an invalid stored value', () => {
    expect(resolveTheme('purple', true)).toBe('dark');
  });
});

describe('setTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('applies and stores the theme', () => {
    setTheme('dark');
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(getCurrentTheme()).toBe('dark');

    setTheme('light');
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});

describe('THEME_INIT_SCRIPT', () => {
  it('reads the same storage key that setTheme writes', () => {
    expect(THEME_INIT_SCRIPT).toContain("localStorage.getItem('theme')");
  });
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('toggles between light and dark', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const toLight = () =>
      screen.getByRole('button', { name: '라이트 모드로 전환' });
    const toDark = () =>
      screen.getByRole('button', { name: '다크 모드로 전환' });

    expect(toDark()).toHaveAttribute('aria-pressed', 'false');

    await user.click(toDark());
    expect(document.documentElement).toHaveClass('dark');
    expect(
      await screen.findByRole('button', { name: '라이트 모드로 전환' }),
    ).toHaveAttribute('aria-pressed', 'true');

    await user.click(toLight());
    expect(document.documentElement).not.toHaveClass('dark');
  });
});
