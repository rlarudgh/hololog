'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { getCurrentTheme, setTheme, type Theme } from '../theme.lib';

/** <html> class 변화를 구독한다(다른 탭/스크립트에서 바뀌어도 반영). */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

/** 서버 렌더링 시에는 테마를 알 수 없으므로 light로 그리고, 마운트 후 실제 값으로 맞춘다. */
const getServerTheme = (): Theme => 'light';

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getCurrentTheme,
    getServerTheme,
  );
  const isDark = theme === 'dark';

  const toggle = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      aria-pressed={isDark}
      className="relative inline-flex h-8 w-14 items-center rounded-full border border-slate-200 bg-slate-100 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800"
    >
      <span
        aria-hidden="true"
        className={`absolute left-0.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white transition-transform duration-300 dark:border-slate-600 ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <svg
            className="h-4 w-4 text-slate-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            className="h-4 w-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
