'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/features/theme';
import {
  NAV_LINKS,
  SITE,
  SOCIAL_LINKS,
  isActiveNav,
} from '@/shared/configs/site.config';

/** 데스크톱(lg 이상) 좌측 고정 사이드바. 포트폴리오(kkh-log)와 같은 구성. */
export function Sidebar() {
  const pathname = usePathname() ?? '/';

  return (
    <aside
      aria-label="사이드바"
      className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-200 px-10 py-12 lg:flex dark:border-slate-800"
    >
      <Link
        href="/"
        className="self-start font-mono text-sm font-semibold text-slate-900 transition-colors hover:text-accent dark:text-slate-50"
      >
        {SITE.brand}
      </Link>

      <div className="mt-10">
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {SITE.author}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {SITE.role}
        </p>
      </div>

      <nav className="mt-12" aria-label="주요 메뉴">
        <ul className="space-y-1">
          {NAV_LINKS.map((link) => {
            const active = isActiveNav(link.href, pathname);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className="group flex items-center gap-3 py-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900 aria-[current]:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 dark:aria-[current]:text-slate-50"
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-4 bg-slate-300 transition-all group-hover:w-8 group-hover:bg-slate-900 group-aria-[current]:w-8 group-aria-[current]:bg-accent dark:bg-slate-700 dark:group-hover:bg-slate-50"
                  />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto space-y-6">
        <ul className="space-y-1.5 text-sm">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 transition-colors hover:text-accent dark:text-slate-400"
              >
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </div>
    </aside>
  );
}
