import { describe, it, expect, vi } from 'vitest';

// db.ts는 import 시점에 DATABASE_URL을 요구하므로, 순수 함수만 테스트하기 위해 모킹한다.
vi.mock('@/shared/database/db', () => ({ db: {} }));

import { slugifyTag } from './post.query';

describe('slugifyTag', () => {
  it('lowercases and hyphenates ASCII tags', () => {
    expect(slugifyTag('Service Worker')).toBe('service-worker');
  });

  it('preserves Hangul characters', () => {
    expect(slugifyTag('스타트업')).toBe('스타트업');
  });

  it('strips special characters', () => {
    expect(slugifyTag('C++ / Rust!')).toBe('c-rust');
  });

  it('collapses repeated and trailing hyphens', () => {
    expect(slugifyTag('  hello   world  ')).toBe('hello-world');
  });

  it('falls back to an encoded value when nothing remains', () => {
    expect(slugifyTag('@@@')).toBe(encodeURIComponent('@@@'));
  });
});
