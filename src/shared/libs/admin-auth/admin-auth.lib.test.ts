import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';

const getUser = vi.fn();

vi.mock('@/shared/libs/supabase', () => ({
  createSupabaseServerClient: async () => ({ auth: { getUser } }),
}));

import {
  isAdmin,
  getAdminUser,
  isSameOrigin,
  requireWriteAccess,
} from './admin-auth.lib';

const URL = 'http://localhost/api/posts/a';

function makeUser(role?: string): User {
  return {
    id: 'u1',
    email: 'a@b.c',
    app_metadata: role ? { role } : {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '',
  } as User;
}

function req(headers: Record<string, string> = {}) {
  return new NextRequest(URL, { method: 'PUT', headers });
}

describe('admin-auth', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.BLOG_API_WRITE_KEY = 'write-key';
    getUser.mockReset();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('isAdmin', () => {
    it('is true only for app_metadata.role === admin', () => {
      expect(isAdmin(makeUser('admin'))).toBe(true);
      expect(isAdmin(makeUser('user'))).toBe(false);
      expect(isAdmin(makeUser())).toBe(false);
      expect(isAdmin(null)).toBe(false);
      expect(isAdmin(undefined)).toBe(false);
    });

    it('ignores user_metadata (user-editable)', () => {
      const user = { ...makeUser(), user_metadata: { role: 'admin' } } as User;
      expect(isAdmin(user)).toBe(false);
    });
  });

  describe('getAdminUser', () => {
    it('returns the admin user', async () => {
      const admin = makeUser('admin');
      getUser.mockResolvedValue({ data: { user: admin } });
      await expect(getAdminUser()).resolves.toBe(admin);
    });

    it('returns null for non-admin or anonymous', async () => {
      getUser.mockResolvedValue({ data: { user: makeUser('user') } });
      await expect(getAdminUser()).resolves.toBeNull();
      getUser.mockResolvedValue({ data: { user: null } });
      await expect(getAdminUser()).resolves.toBeNull();
    });
  });

  describe('isSameOrigin', () => {
    it('accepts matching origin only', () => {
      expect(isSameOrigin(req({ origin: 'http://localhost' }))).toBe(true);
      expect(isSameOrigin(req({ origin: 'https://evil.com' }))).toBe(false);
      expect(isSameOrigin(req())).toBe(false);
    });
  });

  describe('requireWriteAccess', () => {
    it('passes with the write API key without touching the session', async () => {
      await expect(
        requireWriteAccess(req({ 'x-api-key': 'write-key' })),
      ).resolves.toBeNull();
      expect(getUser).not.toHaveBeenCalled();
    });

    it('passes with a same-origin admin session', async () => {
      getUser.mockResolvedValue({ data: { user: makeUser('admin') } });
      await expect(
        requireWriteAccess(req({ origin: 'http://localhost' })),
      ).resolves.toBeNull();
    });

    it('rejects a cross-origin admin session', async () => {
      getUser.mockResolvedValue({ data: { user: makeUser('admin') } });
      const res = await requireWriteAccess(req({ origin: 'https://evil.com' }));
      expect(res?.status).toBe(401);
      expect(getUser).not.toHaveBeenCalled();
    });

    it('rejects a same-origin non-admin session', async () => {
      getUser.mockResolvedValue({ data: { user: makeUser('user') } });
      const res = await requireWriteAccess(req({ origin: 'http://localhost' }));
      expect(res?.status).toBe(401);
    });

    it('rejects a read key', async () => {
      process.env.BLOG_API_KEYS = 'read-key';
      const res = await requireWriteAccess(req({ 'x-api-key': 'read-key' }));
      expect(res?.status).toBe(401);
    });
  });
});
