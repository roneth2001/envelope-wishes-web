import { describe, it, expect } from 'vitest';
import { wishSchema } from '@/lib/birthday-wishes';

describe('Birthday wishes', () => {
  it('trims names and messages', () => {
    expect(wishSchema.parse({ name: ' Friend ', message: ' Happy birthday! ' })).toEqual({ name: 'Friend', message: 'Happy birthday!' });
  });
  it('rejects empty and oversized entries', () => {
    expect(wishSchema.safeParse({ name: ' ', message: 'hello' }).success).toBe(false);
    expect(wishSchema.safeParse({ name: 'Friend', message: ' ' }).success).toBe(false);
    expect(wishSchema.safeParse({ name: 'x'.repeat(61), message: 'hello' }).success).toBe(false);
    expect(wishSchema.safeParse({ name: 'Friend', message: 'x'.repeat(601) }).success).toBe(false);
  });
});