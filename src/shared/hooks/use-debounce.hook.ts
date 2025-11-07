import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value by delaying its update
 * Useful for optimizing expensive operations like API calls or search filtering
 *
 * @template T - The type of the value to debounce
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns The debounced value that updates after the delay period
 *
 * @example
 * ```tsx
 * const SearchComponent = () => {
 *   const [searchQuery, setSearchQuery] = useState('');
 *   const debouncedQuery = useDebounce(searchQuery, 300);
 *
 *   // This effect only runs when user stops typing for 300ms
 *   useEffect(() => {
 *     if (debouncedQuery) {
 *       fetchSearchResults(debouncedQuery);
 *     }
 *   }, [debouncedQuery]);
 *
 *   return <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />;
 * };
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    /**
     * Set up a timer to update the debounced value after the specified delay
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     */
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    /**
     * Cleanup function that cancels the timer if:
     * - The value changes before the delay expires
     * - The component unmounts
     *
     * This prevents memory leaks and ensures only the latest value is processed
     */
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect when value or delay changes

  return debouncedValue;
}
