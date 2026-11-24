import { PORTFOLIO_URL, SITE } from '@/shared/configs/site.config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 flex flex-col gap-2 border-t border-slate-200 py-8 font-mono text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:text-slate-400">
      <p>
        &copy; {currentYear} {SITE.author}. Built with Next.js.
      </p>
      <a
        href={PORTFOLIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-accent"
      >
        Portfolio ↗
      </a>
    </footer>
  );
}
