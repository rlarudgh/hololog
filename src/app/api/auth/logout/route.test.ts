import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const signOut = vi.fn();

vi.mock('@/shared/libs/supabase', () => ({
  createSupabaseServerClient: async () => ({ auth: { signOut } }),
}));

import { POST } from './route';

const URL = 'http://localhost/api/auth/logout';

describe('POST /api/auth/logout', () => {
  beforeEach(() => signOut.mockReset());

  it('signs out for same-origin requests', async () => {
    const res = await POST(
      new NextRequest(URL, {
        method: 'POST',
        headers: { origin: 'http://localhost' },
      }),
    );
    expect(res.status).toBe(200);
    expect(signOut).toHaveBeenCalledOnce();
  });

  it('rejects cross-origin requests', async () => {
    const res = await POST(
      new NextRequest(URL, {
        method: 'POST',
        headers: { origin: 'https://evil.com' },
      }),
    );
    expect(res.status).toBe(403);
    expect(signOut).not.toHaveBeenCalled();
  });
});
