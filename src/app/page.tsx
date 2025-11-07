import Link from 'next/link';
import { getAllPosts } from '@/shared/libs/mdx';
import { HomePostCard } from '@/features/home/ui';
import { ROUTES } from '@/shared/configs/routes';

export default function HomePage() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">Welcome to Hololog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
          개발했던 일들을 기록하는 곳입니다. 최신 기술 동향, 프로젝트 경험,
          그리고 개발 과정에서 배운 내용을 공유합니다.
        </p>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">최근 게시물</h2>
          {recentPosts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              아직 게시물이 없습니다. 곧 업데이트 예정입니다!
            </p>
          ) : (
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <HomePostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </section>

        {posts.length > 3 && (
          <div className="text-center">
            <Link
              href={ROUTES.BLOG}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              모든 게시물 보기
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
