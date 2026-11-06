import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { ShortUrlStatsView } from '@/features/short-url-stats';
import { getShortUrlStats } from '@/shared/database/queries';
import { authenticateBasic } from '@/shared/libs/basic-auth';
import { Container } from '@/shared/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'URL Shortener 관리자',
  robots: { index: false, follow: false },
};

/**
 * /admin — URL Shortener 통계. HTTP Basic 인증은 proxy가 401로 먼저 처리하고,
 * matcher를 우회한 요청에 대비해 여기서 한 번 더 확인한다.
 */
export default async function AdminPage() {
  const requestHeaders = await headers();
  if (!authenticateBasic(requestHeaders.get('authorization'))) notFound();

  const stats = await getShortUrlStats();

  return (
    <Container className="py-12">
      <h1 className="mb-2 text-2xl font-bold">URL Shortener 관리자</h1>
      <p className="mb-8 text-sm text-gray-600 dark:text-gray-400">
        단축 URL 목록과 사용량을 확인합니다.
      </p>
      <ShortUrlStatsView stats={stats} />
    </Container>
  );
}
