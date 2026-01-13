interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * JSON-LD Structured Data Component
 *
 * Injects Schema.org structured data into the page for better SEO.
 *
 * @example
 * ```tsx
 * <JsonLd data={{
 *   "@context": "https://schema.org",
 *   "@type": "BlogPosting",
 *   "headline": "Post Title"
 * }} />
 * ```
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Generate BlogPosting schema
 */
export interface BlogPostingSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
  tags?: string[];
}

export function BlogPostingSchema({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  author,
  tags,
}: BlogPostingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: imageUrl,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: author
      ? {
          '@type': 'Person',
          name: author.name,
          url: author.url,
        }
      : undefined,
    keywords: tags?.join(', '),
    inLanguage: 'ko-KR',
    publisher: {
      '@type': 'Organization',
      name: 'Hololog',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <JsonLd data={schema} />;
}

/**
 * Generate BreadcrumbList schema
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={schema} />;
}

/**
 * Generate WebSite schema
 */
export interface WebSiteSchemaProps {
  name: string;
  url: string;
  description?: string;
  searchAction?: {
    target: string;
    queryInput: string;
  };
}

export function WebSiteSchema({
  name,
  url,
  description,
  searchAction,
}: WebSiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: searchAction
      ? {
          '@type': 'SearchAction',
          target: searchAction.target,
          'query-input': searchAction.queryInput,
        }
      : undefined,
  };

  return <JsonLd data={schema} />;
}

/**
 * Generate Organization schema
 */
export interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  sameAs,
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    sameAs,
  };

  return <JsonLd data={schema} />;
}

/**
 * Generate Person schema (for author)
 */
export interface PersonSchemaProps {
  name: string;
  url?: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
}

export function PersonSchema({
  name,
  url,
  jobTitle,
  description,
  image,
  sameAs,
}: PersonSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    jobTitle,
    description,
    image,
    sameAs,
  };

  return <JsonLd data={schema} />;
}
