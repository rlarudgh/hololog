import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const postgresMock = vi.fn((url: string, options: unknown) => ({
  url,
  options,
}));
const drizzleMock = vi.fn((client: unknown, config: unknown) => ({
  client,
  config,
  query: { posts: 'posts-query' },
  transaction(this: unknown) {
    return this;
  },
}));

vi.mock('postgres', () => ({
  default: (url: string, options: unknown) => postgresMock(url, options),
}));
vi.mock('drizzle-orm/postgres-js', () => ({
  drizzle: (client: unknown, config: unknown) => drizzleMock(client, config),
}));

const ORIGINAL_URL = process.env.DATABASE_URL;

async function loadDbModule() {
  vi.resetModules();
  return import('./db');
}

describe('db (lazy client)', () => {
  beforeEach(() => {
    postgresMock.mockClear();
    drizzleMock.mockClear();
  });

  afterEach(() => {
    if (ORIGINAL_URL === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = ORIGINAL_URL;
  });

  it('does not connect or throw at import time without DATABASE_URL', async () => {
    delete process.env.DATABASE_URL;
    await expect(loadDbModule()).resolves.toBeDefined();
    expect(postgresMock).not.toHaveBeenCalled();
  });

  it('throws on first use when DATABASE_URL is missing', async () => {
    delete process.env.DATABASE_URL;
    const { db, getDb } = await loadDbModule();
    expect(() => getDb()).toThrow(
      'DATABASE_URL environment variable is not set',
    );
    expect(() => db.query).toThrow(
      'DATABASE_URL environment variable is not set',
    );
  });

  it('creates the client once and reuses it', async () => {
    process.env.DATABASE_URL = 'postgres://user:pw@localhost:5432/db';
    const { getDb } = await loadDbModule();
    const first = getDb();
    expect(getDb()).toBe(first);
    expect(postgresMock).toHaveBeenCalledTimes(1);
    expect(postgresMock).toHaveBeenCalledWith(
      'postgres://user:pw@localhost:5432/db',
      { prepare: false },
    );
  });

  it('forwards property access and binds methods to the real client', async () => {
    process.env.DATABASE_URL = 'postgres://user:pw@localhost:5432/db';
    const { db, getDb } = await loadDbModule();
    expect(db.query).toEqual({ posts: 'posts-query' });
    const transaction = db.transaction as unknown as () => unknown;
    expect(transaction()).toBe(getDb());
  });
});
