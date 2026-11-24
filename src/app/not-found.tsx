import Link from 'next/link';
import { Container } from '@/shared/ui';
import { ROUTES } from '@/shared/configs/routes';

/** App Router에서 페이지를 찾지 못했을 때(404) 표시된다. */
export default function NotFound() {
  return (
    <Container className="py-24 lg:py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
        404
      </p>
      <h1 className="mb-4 mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mb-8 text-slate-600 dark:text-slate-400">
        요청하신 페이지가 없거나 삭제되었습니다.
      </p>
      <Link
        href={ROUTES.HOME}
        className="inline-flex items-center font-mono text-xs text-slate-500 transition-colors hover:text-accent dark:text-slate-400"
      >
        ← 블로그로 돌아가기
      </Link>
    </Container>
  );
}
