import { describe, it, expect } from 'vitest';
import { ROUTES } from './routes';

describe('ROUTES Constants', () => {
  it('has correct home route', () => {
    expect(ROUTES.HOME).toBe('/');
  });

  it('has correct blog route', () => {
    expect(ROUTES.BLOG).toBe('/blog');
  });

  it('has correct about route', () => {
    expect(ROUTES.ABOUT).toBe('/about');
  });

  it('generates correct blog post route', () => {
    const slug = 'my-test-post';
    const expectedRoute = '/blog/my-test-post';

    expect(ROUTES.BLOG_POST(slug)).toBe(expectedRoute);
  });

  it('generates different routes for different slugs', () => {
    expect(ROUTES.BLOG_POST('first-post')).toBe('/blog/first-post');
    expect(ROUTES.BLOG_POST('second-post')).toBe('/blog/second-post');
  });

  it('handles special characters in slugs', () => {
    expect(ROUTES.BLOG_POST('post-with-dashes')).toBe('/blog/post-with-dashes');
    expect(ROUTES.BLOG_POST('post_with_underscores')).toBe(
      '/blog/post_with_underscores',
    );
  });
});
