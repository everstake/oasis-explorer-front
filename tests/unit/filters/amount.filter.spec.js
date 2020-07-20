import formatAmount from '@/filters/amount.filter';

describe('amount.filter.js', () => {
  test('Should return 0', () => {
    expect(formatAmount(0)).toBe('0');
  });

  test('Should format amount', () => {
    expect(formatAmount(1554688051955036)).toBe('1,554,688.051955036');
  });
});
