import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Container, Utterances } from '@/shared/ui';
import { BlogPostingSchema, BreadcrumbSchema } from '@/shared/ui/structured-data';
import { getPostBySlug, getAllPosts } from '@/shared/libs/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';

// MDX 컴포넌트를 별도로 정의
function MDXRemoteComponent({ source }: { source: string }) {
  const components = useMDXComponents({});
  return <MDXRemote source={source} components={components} />;
}

// Utterances wrapper with environment variable validation
function UtterancesWrapper() {
  const repo = process.env.NEXT_PUBLIC_UTTERANCES_REPO;

  // Validate environment variable
  if (!repo || repo === 'your-username/your-repo' || repo.trim() === '') {
    console.warn('NEXT_PUBLIC_UTTERANCES_REPO is not properly configured');
    
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <p>댓글 기능이 활성화되지 않았습니다.</p>
        <p className="text-sm mt-2">
          환경 변수 NEXT_PUBLIC_UTTERANCES_REPO를 설정해주세요.
        </p>
      </div>
    );
  }

  return (
    <Utterances
      repo={repo}
      theme="preferred-color-scheme"
      issueTerm="pathname"
      label="blog-comments"
    />
  );
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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hololog.vercel.app';
  const canonical = `${baseUrl}/blog/${slug}`;

  return {
    title: `${post.metadata.title} - Hololog`,
    description: post.metadata.description,
    keywords: post.metadata.tags?.join(', '),
    openGraph: {
      type: 'article',
      url: canonical,
      title: post.metadata.title,
      description: post.metadata.description,
      publishedTime: post.metadata.date,
      tags: post.metadata.tags,
      siteName: 'Hololog',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metadata.title,
      description: post.metadata.description,
    },
    alternates: {
      canonical,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hololog.vercel.app';
  const postUrl = `${baseUrl}/blog/${slug}`;

  // JSON-LD Structured Data
  const jsonLdData = {
    title: post.metadata.title,
    description: post.metadata.description,
    url: postUrl,
    datePublished: post.metadata.date,
    tags: post.metadata.tags,
  };

  // Breadcrumb data
  const breadcrumbData = [
    { name: 'Home', url: baseUrl },
    { name: 'Blog', url: `${baseUrl}/blog` },
    { name: post.metadata.title, url: postUrl },
  ];

  return (
    <>
      {/* Structured Data */}
      <BlogPostingSchema {...jsonLdData} />
      <BreadcrumbSchema items={breadcrumbData} />

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
            <UtterancesWrapper />
          </section>
        </article>
      </Container>
    </>
  );
}
