import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const signInWithPassword = vi.fn();
const signOut = vi.fn();

vi.mock('@/shared/libs/supabase', () => ({
  createSupabaseServerClient: async () => ({
    auth: { signInWithPassword, signOut },
  }),
}));

import { POST } from './route';

const URL = 'http://localhost/api/auth/login';
const SAME_ORIGIN = { origin: 'http://localhost' };

function loginRequest(
  body: unknown,
  headers: Record<string, string> = SAME_ORIGIN,
) {
  return new NextRequest(URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const credentials = { email: 'admin@example.com', password: 'pw' };

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    signInWithPassword.mockReset();
    signOut.mockReset();
  });

  it('returns 403 for cross-origin requests', async () => {
    const res = await POST(
      loginRequest(credentials, { origin: 'https://evil.com' }),
    );
    expect(res.status).toBe(403);
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid JSON', async () => {
    const res = await POST(loginRequest('{not json'));
    expect(res.status).toBe(400);
  });

  it('returns 400 when fields are missing', async () => {
    const res = await POST(loginRequest({ email: 'a@b.c' }));
    expect(res.status).toBe(400);
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it('returns 401 on wrong credentials', async () => {
    signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    });
    const res = await POST(loginRequest(credentials));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Invalid credentials' });
  });

  it('signs out and returns 403 for non-admin users', async () => {
    signInWithPassword.mockResolvedValue({
      data: { user: { id: 'u', email: 'u@x', app_metadata: {} } },
      error: null,
    });
    const res = await POST(loginRequest(credentials));
    expect(res.status).toBe(403);
    expect(signOut).toHaveBeenCalledOnce();
  });

  it('returns the admin user on success', async () => {
    signInWithPassword.mockResolvedValue({
      data: {
        user: {
          id: 'a',
          email: 'admin@example.com',
          app_metadata: { role: 'admin' },
        },
      },
      error: null,
    });
    const res = await POST(loginRequest(credentials));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      user: { id: 'a', email: 'admin@example.com' },
    });
    expect(signInWithPassword).toHaveBeenCalledWith(credentials);
    expect(signOut).not.toHaveBeenCalled();
  });
});
