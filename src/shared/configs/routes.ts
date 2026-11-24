export const ROUTES = {
  HOME: '/',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
} as const;
