import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { resolveShortUrl } from '@/shared/database/queries';
import { SHORT_CODE_PATTERN } from '@/shared/libs/short-url';

// 요청마다 조회해야 하므로 정적 생성/캐시를 끈다(응답에 Cache-Control: no-store가 붙는다).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface ShortCodePageProps {
  params: Promise<{ shortCode: string }>;
}

/**
 * /{shortCode} — 원본 URL로 307 리다이렉트하고 클릭 수를 올린다.
 * - /about, /blog 같은 정적 경로는 Next.js가 동적 세그먼트보다 먼저 매칭한다.
 * - 형식이 틀리거나 없는 코드는 notFound()로 블로그의 기본 404 페이지를 보여 준다
 *   (route handler로 만들면 /typo 같은 주소가 일반 텍스트 404가 된다).
 */
export default async function ShortCodePage({ params }: ShortCodePageProps) {
  const { shortCode } = await params;
  if (!SHORT_CODE_PATTERN.test(shortCode)) notFound();

  const originalUrl = await resolveShortUrl(shortCode);
  if (!originalUrl) notFound();

  // redirect()는 Server Component에서 307을 반환하며, basePath가 없으면 URL을 그대로 Location에 넣는다.
  redirect(originalUrl);
}
