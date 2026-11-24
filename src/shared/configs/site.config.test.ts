import { describe, it, expect } from 'vitest';
import { isActiveNav } from './site.config';

describe('isActiveNav', () => {
  it.each(['/', '/blog', '/blog/some-post'])(
    'activates the blog menu on %s',
    (pathname) => {
      expect(isActiveNav('/', pathname)).toBe(true);
    },
  );

  it('does not activate the blog menu on other pages', () => {
    expect(isActiveNav('/', '/dashboard')).toBe(false);
    expect(isActiveNav('/', '/blogger')).toBe(false);
  });

  it('matches other menus by exact path or sub-path', () => {
    expect(isActiveNav('/tags', '/tags')).toBe(true);
    expect(isActiveNav('/tags', '/tags/react')).toBe(true);
    expect(isActiveNav('/tags', '/tagsx')).toBe(false);
  });
});
