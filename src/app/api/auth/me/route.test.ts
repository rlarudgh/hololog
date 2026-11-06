import { describe, it, expect, vi, beforeEach } from 'vitest';

const getAdminUser = vi.fn();

vi.mock('@/shared/libs/admin-auth', () => ({
  getAdminUser: () => getAdminUser(),
}));

import { GET } from './route';

describe('GET /api/auth/me', () => {
  beforeEach(() => getAdminUser.mockReset());

  it('returns 401 without an admin session', async () => {
    getAdminUser.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns the admin user', async () => {
    getAdminUser.mockResolvedValue({ id: 'a', email: 'admin@example.com' });
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      user: { id: 'a', email: 'admin@example.com' },
    });
  });
});
