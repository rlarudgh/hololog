import { describe, it, expect } from 'vitest';
import { formatPostDate } from './date.util';

describe('formatPostDate', () => {
  it('formats YYYY-MM-DD with dots', () => {
    expect(formatPostDate('2026-01-12')).toBe('2026.01.12');
  });

  it('uses only the date part of an ISO string', () => {
    expect(formatPostDate('2025-11-26T23:30:00.000Z')).toBe('2025.11.26');
  });

  it('returns the input unchanged when it is not a date', () => {
    expect(formatPostDate('soon')).toBe('soon');
  });
});
