import type { Metadata } from 'next';
import { SEO_CONFIG } from '@/shared/configs/seo/seo.config';

/**
 * Enhanced metadata interface
 */
export interface SeoMetadataParams {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noindex?: boolean;
  canonical?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

/**
 * Generate enhanced metadata with OpenGraph and Twitter Card support
 *
 * @example
 * ```ts
 * export const metadata = generateMetadata({
 *   title: 'Post Title',
 *   description: 'Post description',
 *   keywords: ['nextjs', 'react'],
 *   image: '/post-image.png',
 * });
 * ```
 */
export function generateMetadata(params: SeoMetadataParams = {}): Metadata {
  const {
    title = SEO_CONFIG.defaultTitle,
    description = SEO_CONFIG.defaultDescription,
    keywords = SEO_CONFIG.defaultKeywords,
    image = SEO_CONFIG.openGraph.images[0].url,
    noindex = false,
    canonical,
    publishedTime,
    modifiedTime,
    authors = [],
    tags = [],
  } = params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SEO_CONFIG.baseUrl;
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const canonicalUrl = canonical || baseUrl;

  // Combine keywords with tags
  const allKeywords = [...new Set([...keywords, ...tags])];

  return {
    title,
    description,
    keywords: allKeywords.join(', '),

    // OpenGraph
    openGraph: {
      type: 'website',
      locale: SEO_CONFIG.openGraph.locale,
      url: canonicalUrl,
      title,
      description,
      siteName: SEO_CONFIG.openGraph.siteName,
      images: [
        {
          url: imageUrl,
          width: SEO_CONFIG.openGraph.images[0].width,
          height: SEO_CONFIG.openGraph.images[0].height,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: SEO_CONFIG.twitter.card,
      title,
      description,
      images: [imageUrl],
      site: SEO_CONFIG.twitter.site,
      creator: SEO_CONFIG.twitter.creator,
    },

    // Robots
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification (add your verification codes)
    verification: {
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
    },

    // Alternates
    alternates: {
      canonical: canonicalUrl,
    },

    // Category and type
    category: 'technology',
  };
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogMetadata(params: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SEO_CONFIG.baseUrl;
  const canonical = `${baseUrl}/blog/${params.slug}`;

  return generateMetadata({
    ...params,
    canonical,
  });
}
