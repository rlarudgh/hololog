import { getAllPosts } from '@/shared/libs/mdx';
import { BlogList } from '@/widgets/blog';
import { Container } from '@/shared/ui';
import { WebSiteSchema } from '@/shared/ui/structured-data';
import { SITE } from '@/shared/configs/site.config';

/** 홈 = 블로그 목록. 블로그 전용 도메인이라 소개 없이 바로 글을 보여준다. */
export default function HomePage() {
  const posts = getAllPosts();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://hololog.vercel.app';

  return (
    <>
      <WebSiteSchema
        name="Hololog"
        url={baseUrl}
        description="개발했던 일들을 기록하는 블로그입니다. Next.js, TypeScript, React 등 다양한 기술을 다룹니다."
      />

      <Container className="pt-10 lg:pt-20">
        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Blog
          </p>
          <h1 className="mb-4 mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            블로그
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {SITE.description}
          </p>
        </header>

        <BlogList initialPosts={posts} />
      </Container>
    </>
  );
}
