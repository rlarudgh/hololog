import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/openapi', () => {
  it('returns the OpenAPI spec without requiring a key', async () => {
    const res = GET();
    expect(res.status).toBe(200);
    const spec = await res.json();
    expect(spec.openapi).toBe('3.1.0');
    expect(spec.paths['/api/posts']).toBeDefined();
    expect(spec.paths['/api/posts/{slug}']).toBeDefined();
    expect(spec.paths['/api/tags']).toBeDefined();
    expect(spec.components.securitySchemes.apiKey.name).toBe('x-api-key');
  });
});
