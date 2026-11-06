import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getSupabaseEnv } from './supabase-env.lib';

describe('getSupabaseEnv', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://ref.supabase.co';
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('prefers the publishable key', () => {
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_x';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'legacy';
    expect(getSupabaseEnv()).toEqual({
      url: 'https://ref.supabase.co',
      anonKey: 'sb_publishable_x',
    });
  });

  it('falls back to the legacy anon key', () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'legacy';
    expect(getSupabaseEnv().anonKey).toBe('legacy');
  });

  it('throws when not configured', () => {
    expect(() => getSupabaseEnv()).toThrow(/must be set/);
  });
});
