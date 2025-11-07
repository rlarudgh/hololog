import { useState, useMemo, useCallback, type ChangeEvent } from 'react';
import type { BlogPost } from '@/shared/types/blog-type';
import { useDebounce } from '@/shared/hooks';

/**
 * Configuration options for the useBlogSearch hook
 */
interface IUseBlogSearchOptions {
  /** Debounce delay in milliseconds (default: 300) */
  debounceDelay?: number;
  /** Enable case-sensitive search (default: false) */
  caseSensitive?: boolean;
}

/**
 * Return type for the useBlogSearch hook
 */
interface IUseBlogSearchReturn {
  searchQuery: string;
  debouncedQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  filteredPosts: BlogPost[];
  isSearchVisible: boolean;
  toggleSearchVisibility: () => void;
  clearSearch: () => void;
  isSearching: boolean;
}

/**
 * Custom hook for searching and filtering blog posts with debounce optimization
 *
 * @param posts - Array of blog posts to search through
 * @param options - Configuration options for search behavior
 * @returns Object containing search state and helper functions
 *
 * @example
 * ```tsx
 * const {
 *   searchQuery,
 *   filteredPosts,
 *   handleSearchQueryChange,
 *   isSearching
 * } = useBlogSearch(posts, { debounceDelay: 300 });
 *
 * return (
 *   <div>
 *     <input value={searchQuery} onChange={handleSearchQueryChange} />
 *     {isSearching && <LoadingSpinner />}
 *     {filteredPosts.map(post => <PostCard key={post.slug} post={post} />)}
 *   </div>
 * );
 * ```
 */
export function useBlogSearch(
  posts: BlogPost[],
  options: IUseBlogSearchOptions = {},
): IUseBlogSearchReturn {
  const { debounceDelay = 300, caseSensitive = false } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  /**
   * Debounced search query to prevent excessive filtering
   * Updates only after user stops typing for the specified delay
   */
  const debouncedQuery = useDebounce(searchQuery, debounceDelay);

  /**
   * Indicates whether the search is in debounce waiting state
   * Useful for showing loading indicators during typing
   */
  const isSearching = useMemo(
    () => searchQuery !== debouncedQuery,
    [searchQuery, debouncedQuery],
  );

  /**
   * Normalizes a string for comparison based on case sensitivity setting
   * Time Complexity: O(n) where n is string length
   *
   * @param str - String to normalize
   * @returns Normalized string
   */
  const normalizeString = useCallback(
    (str: string): string => {
      return caseSensitive ? str : str.toLowerCase();
    },
    [caseSensitive],
  );

  /**
   * Filters posts based on debounced search query with memoization
   * Time Complexity: O(n * m) where n is posts length and m is average tags length
   * Only recomputes when debouncedQuery or posts change
   */
  const filteredPosts = useMemo(() => {
    const trimmedQuery = debouncedQuery.trim();

    // Early return for empty search - O(1)
    if (!trimmedQuery) {
      return posts;
    }

    const query = normalizeString(trimmedQuery);

    /**
     * Filter logic checks multiple fields for match
     * - title: direct string match
     * - description: direct string match
     * - slug: direct string match
     * - tags: checks if any tag contains query
     *
     * Short-circuit evaluation optimizes performance by checking
     * simpler fields first before iterating through tags array
     */
    return posts.filter((post) => {
      // Short-circuit evaluation for performance
      if (normalizeString(post.title).includes(query)) return true;
      if (normalizeString(post.description).includes(query)) return true;
      if (normalizeString(post.slug).includes(query)) return true;

      // Check tags last as it requires additional iteration
      if (post.tags?.length) {
        return post.tags.some((tag) => normalizeString(tag).includes(query));
      }

      return false;
    });
  }, [debouncedQuery, posts, normalizeString]);

  /**
   * Handles search input change events
   * Memoized to prevent unnecessary re-creation on parent re-renders
   *
   * @param e - Input change event
   */
  const handleSearchQueryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  /**
   * Toggles search input visibility
   * Memoized for stable reference to prevent child re-renders
   */
  const toggleSearchVisibility = useCallback(() => {
    setIsSearchVisible((prev) => !prev);
  }, []);

  /**
   * Clears the current search query and resets filtered results
   * Memoized for stable reference to prevent child re-renders
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    debouncedQuery,
    setSearchQuery,
    handleSearchQueryChange,
    filteredPosts,
    isSearchVisible,
    toggleSearchVisibility,
    clearSearch,
    isSearching,
  };
}
