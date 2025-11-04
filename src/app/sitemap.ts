import { MetadataRoute } from 'next';
import { getAllPosts } from '@/shared/libs/mdx/mdx.lib';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://hololog.vercel.app' as const;
  const posts = getAllPosts();

  const postRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
  }));

  const routes = [
    {
      url: siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  return [...routes, ...postRoutes];
}
