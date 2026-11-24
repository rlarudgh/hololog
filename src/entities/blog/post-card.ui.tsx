import Link from 'next/link';
import { memo } from 'react';
import type { BlogPost } from '@/shared/types/blog-type';
import { ROUTES } from '@/shared/configs/routes';
import { formatPostDate } from '@/shared/utils/date';

interface PostCardProps {
  post: BlogPost;
}

/** 글 목록의 한 행. 위아래 경계선으로 구분한다(포트폴리오 블로그 목록과 동일). */
const PostCardComponent = ({ post }: PostCardProps) => {
  return (
    <article className="group border-b border-slate-200 dark:border-slate-800">
      <Link
        href={ROUTES.BLOG_POST(post.slug)}
        className="grid gap-x-6 gap-y-1 py-6 sm:grid-cols-[7rem_1fr]"
      >
        <time
          dateTime={post.date}
          className="font-mono text-xs leading-7 text-slate-500 dark:text-slate-400"
        >
          {formatPostDate(post.date)}
        </time>
        <div className="min-w-0">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-accent dark:text-slate-50">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {post.description}
          </p>
          {post.tags && post.tags.length > 0 && (
            <ul
              className="mt-3 flex flex-wrap gap-x-3 gap-y-1"
              aria-label="태그"
            >
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="font-mono text-xs text-slate-500 dark:text-slate-400"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  );
};

export const PostCard = memo(PostCardComponent);
