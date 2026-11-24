'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ThemeToggle } from '@/features/theme';
import {
  NAV_LINKS,
  SITE,
  SOCIAL_LINKS,
  isActiveNav,
} from '@/shared/configs/site.config';

const MENU_ID = 'mobile-menu';

/** 모바일(lg 미만) 상단 헤더. 데스크톱에서는 Sidebar가 대신한다. */
export function Header() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const close = useCallback(() => setOpen(false), []);

  // Esc로 메뉴 닫기
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          onClick={close}
          className="font-mono text-sm font-semibold text-slate-900 transition-colors hover:text-accent dark:text-slate-50"
        >
          {SITE.brand}
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            className="-mr-2 p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      <nav
        id={MENU_ID}
        aria-label="모바일 메뉴"
        hidden={!open}
        className="border-t border-slate-200 dark:border-slate-800"
      >
        <ul className="px-4 py-3 sm:px-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={close}
                aria-current={
                  isActiveNav(link.href, pathname) ? 'page' : undefined
                }
                className="flex items-center justify-between py-2.5 text-sm text-slate-600 aria-[current]:font-semibold aria-[current]:text-slate-900 dark:text-slate-400 dark:aria-[current]:text-slate-50"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-slate-400"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-2.5 text-sm text-slate-600 dark:text-slate-400"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-slate-400"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
