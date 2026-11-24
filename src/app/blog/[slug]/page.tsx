import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ROUTES } from '@/shared/configs/routes';
import { formatPostDate } from '@/shared/utils/date';
import { Container, Utterances } from '@/shared/ui';
import {
  BlogPostingSchema,
  BreadcrumbSchema,
} from '@/shared/ui/structured-data';
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
      <p className="py-8 text-sm text-slate-500 dark:text-slate-400">
        댓글 기능이 활성화되지 않았습니다.
      </p>
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

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://hololog.vercel.app';
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

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://hololog.vercel.app';
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
    { name: 'Blog', url: baseUrl },
    { name: post.metadata.title, url: postUrl },
  ];

  return (
    <>
      {/* Structured Data */}
      <BlogPostingSchema {...jsonLdData} />
      <BreadcrumbSchema items={breadcrumbData} />

      <Container className="pt-10 lg:pt-20">
        <article>
          <header className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-800">
            <time
              dateTime={post.metadata.date}
              className="font-mono text-xs text-slate-500 dark:text-slate-400"
            >
              {formatPostDate(post.metadata.date)}
            </time>
            <h1 className="mb-4 mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
              {post.metadata.title}
            </h1>
            {post.metadata.description && (
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {post.metadata.description}
              </p>
            )}
            {post.metadata.tags && post.metadata.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="태그">
                {post.metadata.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            )}
          </header>

          <div className="text-slate-700 dark:text-slate-300">
            <MDXRemoteComponent source={post.content} />
          </div>

          <section className="mt-16 border-t border-slate-200 pt-8 dark:border-slate-800">
            <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Comments
            </h2>
            <UtterancesWrapper />
          </section>

          <div className="mt-12">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center font-mono text-xs text-slate-500 transition-colors hover:text-accent dark:text-slate-400"
            >
              ← 목록으로 돌아가기
            </Link>
          </div>
        </article>
      </Container>
    </>
  );
}
