'use client';

import { useMemo } from 'react';
import { PostCard } from '@/entities/blog';
import { useBlogSearch } from '@/shared/hooks';
import { BlogPostSkeletonItem } from '@/shared/ui';
import type { BlogPost } from '@/shared/types/blog-type';

/**
 * Props for BlogList component
 */
interface IBlogListProps {
  /** Initial posts data passed from Server Component */
  initialPosts: BlogPost[];
}

/**
 * Client Component for interactive blog list with search
 *
 * This component handles:
 * - User interactions (search input, filtering)
 * - Client-side state management
 * - Dynamic UI updates
 *
 * Separated from Server Component to:
 * - Keep server benefits (SEO, performance)
 * - Enable client interactivity where needed
 * - Minimize client JS bundle (only this component is client-side)
 *
 * @param props - Component props
 * @returns Interactive blog list with search functionality
 */
export function BlogList({ initialPosts }: IBlogListProps) {
  const {
    searchQuery,
    handleSearchQueryChange,
    filteredPosts,
    isSearchVisible,
    toggleSearchVisibility,
    clearSearch,
    isSearching,
  } = useBlogSearch(initialPosts);

  // Memoize skeleton components to prevent unnecessary re-renders during search
  const skeletonComponents = useMemo(() => {
    return Array.from({ length: 3 }).map((_, index) => (
      <BlogPostSkeletonItem key={`skeleton-${index}`} />
    ));
  }, []);

  // Memoize post components to prevent unnecessary re-renders
  const postComponents = useMemo(() => {
    return filteredPosts.map((post) => (
      <PostCard key={post.slug} post={post} />
    ));
  }, [filteredPosts]);

  return (
    <>
      {/* Search UI */}
      <div className="relative w-full sm:w-auto mb-8">
        {isSearchVisible && (
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="w-full sm:w-64 px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all"
            autoFocus
            aria-label="Search blog posts"
          />
        )}
        <button
          onClick={toggleSearchVisibility}
          className={`${
            isSearchVisible
              ? 'absolute right-3 top-1/2 transform -translate-y-1/2'
              : ''
          } text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors`}
          aria-label={isSearchVisible ? 'Hide search' : 'Show search'}
          aria-expanded={isSearchVisible}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Clear button when searching */}
        {searchQuery && isSearchVisible && (
          <button
            onClick={clearSearch}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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

      {/* Posts list */}
      <div className="space-y-8">
        {isSearching ? (
          // Show skeleton cards while debouncing search
          skeletonComponents
        ) : filteredPosts.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              {searchQuery
                ? `No posts found matching "${searchQuery}"`
                : 'No posts available'}
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          // Posts list
          postComponents
        )}
      </div>
    </>
  );
}
