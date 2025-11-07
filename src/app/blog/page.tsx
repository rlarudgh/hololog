import { Suspense } from 'react';
import { Container } from '@/shared/ui';
import { getAllPosts } from '@/shared/libs/mdx';
import { BlogList } from '@/widgets/blog';
import { BlogPostSkeletonItem } from '@/shared/ui';

/**
 * Server Component with Suspense streaming
 *
 * Benefits:
 * - Instant page shell rendering
 * - Progressive content loading
 * - Better perceived performance
 */
export default function BlogPage() {
  return (
    <Container className="py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-5xl font-bold">Blogs</h1>
      </div>

      <Suspense
        fallback={
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <BlogPostSkeletonItem key={i} />
            ))}
          </div>
        }
      >
        <BlogListWrapper />
      </Suspense>
    </Container>
  );
}

/**
 * Server Component wrapper for data fetching
 */
function BlogListWrapper() {
  const posts = getAllPosts();
  return <BlogList initialPosts={posts} />;
}
