import { expect, it, describe } from 'vitest';
import formatPrice from '@utils/formatPrice';

describe('formatPrice', () => {
  it('should return format price', () => {
    expect(formatPrice(100)).toBe('1.00');
  });
});
