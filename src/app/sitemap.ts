import { MetadataRoute } from 'next';
import { getAllPosts } from '@/shared/libs/mdx/mdx.lib';

export default function sitemap(): MetadataRoute.Sitemap {
  // Use environment variable with fallback
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL || 'https://hololog.vercel.app'
  ).replace(/\/$/, '');
  const posts = getAllPosts();

  // Blog post routes with proper metadata
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  return [...routes, ...postRoutes];
}
