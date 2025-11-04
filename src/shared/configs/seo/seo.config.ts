export const SEO_CONFIG = {
  /**
   * Base URL for the application
   * Should be set via environment variable in production
   */
  baseUrl: 'https://hololog.vercel.app' as const,

  /**
   * Default metadata
   */
  defaultTitle: 'Next.js 15 Offline App',
  defaultDescription:
    'Progressive Web App with offline support using Service Workers',

  /**
   * Social media metadata
   */
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Next.js 15 Offline App',
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
