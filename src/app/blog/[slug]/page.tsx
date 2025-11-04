import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Container, Utterances } from '@/shared/ui';
import { getPostBySlug, getAllPosts } from '@/shared/libs/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';

// MDX 컴포넌트를 별도로 정의
function MDXRemoteComponent({ source }: { source: string }) {
  const components = useMDXComponents({});
  return <MDXRemote source={source} components={components} />;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts?.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.metadata.title} - My MDX Blog`,
    description: post.metadata.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <Container className="py-12">
      <article className="max-w-none">
        <header className="mb-8">
          <h1 className="text-5xl font-bold mb-4">{post.metadata.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {post.metadata.date}
          </p>
          {post.metadata.tags && post.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <MDXRemoteComponent source={post.content} />

        {/* 댓글 섹션 */}
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6">댓글</h2>
          <Utterances
            repo={
              process.env.NEXT_PUBLIC_UTTERANCES_REPO ||
              'your-username/your-repo'
            }
            theme="preferred-color-scheme"
            issueTerm="pathname"
            label="blog-comments"
          />
        </section>
      </article>
    </Container>
  );
}
