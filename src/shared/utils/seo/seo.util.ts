import { Metadata } from 'next';
import { SEO_CONFIG } from '@/shared/configs/seo/';

/**
 *  Get full URL for a given path
 *
 * @param path
 * @returns { string }
 *
 * @example ```
 * getFullUrl('/about') // https://hololog.vercel.app/about
 * ```
 */
export function getFullUrl(path: string): string {
  return `${SEO_CONFIG.baseUrl}${path}`;
}

/**
 * Generate metadata for a page
 * @param title
 * @param description
 * @param path
 * @returns {Metadata}
 */
export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = getFullUrl(path);

  return {
    title,
    description,
    openGraph: {
      ...SEO_CONFIG.openGraph,
      title,
      description,
      url,
    },
  };
}
