export const SEO_CONFIG = {
  /**
   * Base URL for the application
   * Should be set via environment variable in production
   */
  baseUrl: 'https://hololog.vercel.app' as const,

  /**
   * Default metadata
   */
  defaultTitle: 'Hololog - 개발 블로그',
  defaultDescription: '개발했던 일들을 기록하는 블로그입니다. Next.js, TypeScript, React 등 다양한 기술을 다룹니다.',
  defaultKeywords: [
    '개발 블로그',
    '프로그래밍',
    'Next.js',
    'TypeScript',
    'React',
    '웹 개발',
    'frontend',
    'blog',
  ],

  /**
   * Social media metadata
   */
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Hololog',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hololog',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@hololog',
    creator: '@hololog',
  },

  /**
   * Sitemap configuration
   */
  sitemap: {
    changeFrequency: {
      always: 'always' as const,
      hourly: 'hourly' as const,
      daily: 'daily' as const,
      weekly: 'weekly' as const,
      monthly: 'monthly' as const,
      yearly: 'yearly' as const,
      never: 'never' as const,
    },
    priority: {
      high: 1.0,
      medium: 0.7,
      low: 0.3,
    },
  },
} as const;
