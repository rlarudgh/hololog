import { describe, it, expect } from 'vitest';
import { SEO_CONFIG } from './seo.config';

describe('SEO_CONFIG', () => {
  it('should have the correct base URL', () => {
    expect(SEO_CONFIG.baseUrl).toBe('https://hololog.vercel.app');
  });

  it('should have a default title', () => {
    expect(typeof SEO_CONFIG.defaultTitle).toBe('string');
    expect(SEO_CONFIG.defaultTitle).not.toBe('');
  });

  it('should have a default description', () => {
    expect(typeof SEO_CONFIG.defaultDescription).toBe('string');
    expect(SEO_CONFIG.defaultDescription).not.toBe('');
  });

  it('should have Open Graph metadata', () => {
    expect(SEO_CONFIG.openGraph).toBeDefined();
    expect(SEO_CONFIG.openGraph.type).toBe('website');
    expect(SEO_CONFIG.openGraph.locale).toBe('en_US');
    expect(typeof SEO_CONFIG.openGraph.siteName).toBe('string');
  });

  it('should have sitemap configuration', () => {
    expect(SEO_CONFIG.sitemap).toBeDefined();
    expect(SEO_CONFIG.sitemap.changeFrequency).toBeDefined();
    expect(SEO_CONFIG.sitemap.priority).toBeDefined();
  });

  it('should have correct sitemap change frequencies', () => {
    const { changeFrequency } = SEO_CONFIG.sitemap;
    const validFrequencies = [
      'always',
      'hourly',
      'daily',
      'weekly',
      'monthly',
      'yearly',
      'never',
    ];
    const frequencies = Object.values(changeFrequency);

    +expect(frequencies).toHaveLength(validFrequencies.length);

    +frequencies.forEach((freq) => {
      +expect(validFrequencies).toContain(freq);
    });
  });

  it('should have correct sitemap priorities', () => {
    const { priority } = SEO_CONFIG.sitemap;
    expect(priority.high).toBe(1.0);
    expect(priority.medium).toBe(0.7);
    expect(priority.low).toBe(0.3);
  });
});
