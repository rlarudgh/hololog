import { describe, it, expect, vi, beforeEach } from 'vitest';
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

describe('proxy', () => {
  beforeEach(() => updateSession.mockReset());

  it('only matches /admin and /login', () => {
    expect(config.matcher).toEqual(['/admin/:path*', '/login']);
  });

  it('redirects anonymous /admin visits to /login with next', async () => {
    sessionWith(null);
    const res = await proxy(
      new NextRequest('http://localhost/admin/posts?page=2'),
    );
    expect(res.status).toBe(307);
    const location = new URL(res.headers.get('location')!);
    expect(location.pathname).toBe('/login');
    expect(location.searchParams.get('next')).toBe('/admin/posts?page=2');
  });

  it('redirects non-admin users away from /admin and keeps refreshed cookies', async () => {
    sessionWith(user);
    const res = await proxy(new NextRequest('http://localhost/admin'));
    expect(res.status).toBe(307);
    expect(res.cookies.get('sb-test-auth-token')?.value).toBe('refreshed');
  });

  it('lets admins through to /admin', async () => {
    const response = sessionWith(admin);
    const res = await proxy(new NextRequest('http://localhost/admin'));
    expect(res).toBe(response);
  });

  it('sends logged-in admins from /login to /admin', async () => {
    sessionWith(admin);
    const res = await proxy(new NextRequest('http://localhost/login'));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get('location')!).pathname).toBe('/admin');
  });

  it('shows /login to anonymous users', async () => {
    const response = sessionWith(null);
    const res = await proxy(new NextRequest('http://localhost/login'));
    expect(res).toBe(response);
  });
});
