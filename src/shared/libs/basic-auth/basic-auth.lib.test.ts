import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { authenticateBasic, basicAuthChallenge } from './basic-auth.lib';

function basic(value: string) {
  return `Basic ${Buffer.from(value).toString('base64')}`;
}

describe('authenticateBasic', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'pa:ss';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns the admin user for valid credentials (password may contain ":")', () => {
    expect(authenticateBasic(basic('admin:pa:ss'))).toEqual({
      username: 'admin',
      role: 'admin',
    });
  });

  it.each([
    ['missing header', null],
    ['non-Basic scheme', 'Bearer token'],
    ['no separator', basic('adminpass')],
    ['wrong password', basic('admin:nope')],
    ['wrong username', basic('root:pa:ss')],
    ['empty credentials', basic(':')],
  ])('rejects %s', (_label, header) => {
    expect(authenticateBasic(header)).toBeNull();
  });

  it.each(['ADMIN_USERNAME', 'ADMIN_PASSWORD'])(
    'always rejects when %s is not set',
    (key) => {
      delete process.env[key];
      expect(authenticateBasic(basic('admin:pa:ss'))).toBeNull();
      expect(authenticateBasic(basic(':'))).toBeNull();
    },
  );
});

describe('basicAuthChallenge', () => {
  it('returns 401 with a Basic challenge and no-store', async () => {
    const res = basicAuthChallenge();
    expect(res.status).toBe(401);
    expect(res.headers.get('www-authenticate')).toBe('Basic realm="Admin"');
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.text()).toBe('Authentication required');
  });
});
