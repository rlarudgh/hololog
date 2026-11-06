import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const updateSession = vi.fn();

vi.mock('@/shared/libs/supabase', () => ({
  updateSession: (request: NextRequest) => updateSession(request),
}));

import { proxy, config } from './proxy';

const admin = { id: 'a', app_metadata: { role: 'admin' } };
const user = { id: 'u', app_metadata: {} };

function sessionWith(sessionUser: unknown) {
  const response = NextResponse.next();
  response.cookies.set('sb-test-auth-token', 'refreshed');
  updateSession.mockResolvedValue({ response, user: sessionUser });
  return response;
}

function basic(username: string, password: string) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

describe('proxy', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    updateSession.mockReset();
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 's3cret';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('matches the Basic-auth and Supabase-session paths', () => {
    expect(config.matcher).toEqual([
      '/admin/:path*',
      '/api/stats',
      '/dashboard/:path*',
      '/login',
    ]);
  });

  describe('Basic auth (/admin, /api/stats)', () => {
    it.each(['/admin', '/admin/urls', '/api/stats'])(
      'returns 401 with a Basic challenge for anonymous %s',
      async (path) => {
        const res = await proxy(new NextRequest(`http://localhost${path}`));
        expect(res.status).toBe(401);
        expect(res.headers.get('www-authenticate')).toBe('Basic realm="Admin"');
        expect(res.headers.get('cache-control')).toBe('no-store');
        expect(updateSession).not.toHaveBeenCalled();
      },
    );

    it('rejects wrong credentials', async () => {
      const res = await proxy(
        new NextRequest('http://localhost/admin', {
          headers: { authorization: basic('admin', 'wrong') },
        }),
      );
      expect(res.status).toBe(401);
    });

    it('lets valid credentials through without touching Supabase', async () => {
      const res = await proxy(
        new NextRequest('http://localhost/api/stats', {
          headers: { authorization: basic('admin', 's3cret') },
        }),
      );
      expect(res.status).toBe(200);
      expect(res.headers.get('x-middleware-next')).toBe('1');
      expect(updateSession).not.toHaveBeenCalled();
    });

    it('does not treat /administrator as an admin path', async () => {
      const response = sessionWith(null);
      const res = await proxy(
        new NextRequest('http://localhost/administrator'),
      );
      expect(res).toBe(response);
    });
  });

  describe('Supabase session (/dashboard, /login)', () => {
    it('redirects anonymous /dashboard visits to /login with next', async () => {
      sessionWith(null);
      const res = await proxy(
        new NextRequest('http://localhost/dashboard/posts?page=2'),
      );
      expect(res.status).toBe(307);
      const location = new URL(res.headers.get('location')!);
      expect(location.pathname).toBe('/login');
      expect(location.searchParams.get('next')).toBe('/dashboard/posts?page=2');
    });

    it('redirects non-admin users away from /dashboard and keeps refreshed cookies', async () => {
      sessionWith(user);
      const res = await proxy(new NextRequest('http://localhost/dashboard'));
      expect(res.status).toBe(307);
      expect(res.cookies.get('sb-test-auth-token')?.value).toBe('refreshed');
    });

    it('lets admins through to /dashboard', async () => {
      const response = sessionWith(admin);
      const res = await proxy(new NextRequest('http://localhost/dashboard'));
      expect(res).toBe(response);
    });

    it('sends logged-in admins from /login to /dashboard', async () => {
      sessionWith(admin);
      const res = await proxy(new NextRequest('http://localhost/login'));
      expect(res.status).toBe(307);
      expect(new URL(res.headers.get('location')!).pathname).toBe('/dashboard');
    });

    it('shows /login to anonymous users', async () => {
      const response = sessionWith(null);
      const res = await proxy(new NextRequest('http://localhost/login'));
      expect(res).toBe(response);
    });
  });
});
