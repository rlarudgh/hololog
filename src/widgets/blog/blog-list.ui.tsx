'use client';

import { useMemo } from 'react';
import { PostCard } from '@/entities/blog';
import { useBlogSearch } from '@/shared/hooks';
import { BlogPostSkeletonItem } from '@/shared/ui';
import type { BlogPost } from '@/shared/types/blog-type';

interface IBlogListProps {
  /** Server Component에서 넘겨받은 전체 글 */
  initialPosts: BlogPost[];
}

/**
 * 검색이 가능한 글 목록(Client Component).
 * 데이터는 서버에서 받고, 검색(300ms 디바운스)만 클라이언트에서 처리한다.
 */
export function BlogList({ initialPosts }: IBlogListProps) {
  const {
    searchQuery,
    handleSearchQueryChange,
    filteredPosts,
    clearSearch,
    isSearching,
  } = useBlogSearch(initialPosts);

  const skeletonComponents = useMemo(
    () =>
      Array.from({ length: 3 }).map((_, index) => (
        <BlogPostSkeletonItem key={`skeleton-${index}`} />
      )),
    [],
  );

  const postComponents = useMemo(
    () => filteredPosts.map((post) => <PostCard key={post.slug} post={post} />),
    [filteredPosts],
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <label htmlFor="blog-search" className="sr-only">
            글 검색
          </label>
          <input
            id="blog-search"
            type="search"
            placeholder="검색"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="w-full border-b border-slate-200 bg-transparent py-2 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-800 dark:text-slate-50 dark:focus:border-slate-50 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="검색어 지우기"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <p
          className="shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400"
          aria-live="polite"
        >
          {filteredPosts.length} posts
        </p>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        {isSearching ? (
          skeletonComponents
        ) : filteredPosts.length === 0 ? (
          <div className="border-b border-slate-200 py-10 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            {searchQuery ? (
              <>
                &lsquo;{searchQuery}&rsquo;에 맞는 글이 없습니다.{' '}
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-slate-900 underline underline-offset-4 hover:text-accent dark:text-slate-50"
                >
                  검색 초기화
                </button>
              </>
            ) : (
              '아직 발행된 글이 없습니다.'
            )}
          </div>
        ) : (
          postComponents
        )}
      </div>
    </>
  );
}
