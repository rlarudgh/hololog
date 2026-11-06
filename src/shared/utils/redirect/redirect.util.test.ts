import { describe, it, expect } from 'vitest';
import { safeRedirectPath } from './redirect.util';

describe('safeRedirectPath', () => {
  it('keeps internal paths', () => {
    expect(safeRedirectPath('/admin/posts?x=1')).toBe('/admin/posts?x=1');
  });

  it.each([
    [undefined],
    [null],
    [''],
    ['https://evil.com'],
    ['//evil.com'],
    ['/\\evil.com'],
    ['javascript:alert(1)'],
  ])('falls back for %s', (next) => {
    expect(safeRedirectPath(next)).toBe('/admin');
  });

  it('uses a custom fallback', () => {
    expect(safeRedirectPath('//x', '/')).toBe('/');
  });
});
