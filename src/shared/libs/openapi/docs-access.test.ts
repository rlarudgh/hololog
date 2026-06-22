import { describe, it, expect, afterEach, vi } from 'vitest';
import { apiDocsEnabled } from './docs-access';

describe('apiDocsEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is enabled outside production when unset', () => {
    vi.stubEnv('ENABLE_API_DOCS', '');
    vi.stubEnv('NODE_ENV', 'development');
    expect(apiDocsEnabled()).toBe(true);
  });

  it('is disabled in production when unset', () => {
    vi.stubEnv('ENABLE_API_DOCS', '');
    vi.stubEnv('NODE_ENV', 'production');
    expect(apiDocsEnabled()).toBe(false);
  });

  it('is force-enabled with ENABLE_API_DOCS=true even in production', () => {
    vi.stubEnv('ENABLE_API_DOCS', 'true');
    vi.stubEnv('NODE_ENV', 'production');
    expect(apiDocsEnabled()).toBe(true);
  });

  it('is force-disabled with ENABLE_API_DOCS=false even in development', () => {
    vi.stubEnv('ENABLE_API_DOCS', 'false');
    vi.stubEnv('NODE_ENV', 'development');
    expect(apiDocsEnabled()).toBe(false);
  });
});
