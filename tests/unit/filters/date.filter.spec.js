import {
  formatDate,
  formatYear,
  formatDaysAgo,
  formatUTCDate,
  formatUTCDaysAgo,
} from '@/filters/date.filter';

describe('date.filter.js', () => {
  const timestamp = 1592496000;
  const utcTimestamp = '2020-07-20T12:32:26Z';

  test('formatDate', () => {
    expect(formatDate(timestamp)).toBe('19:00 18.06.2020');
  });

  test('formatYear', () => {
    expect(formatYear(timestamp)).toBe('18.06.2020');
  });

  test('formatDaysAgo', () => {
    expect(formatDaysAgo(timestamp)).toMatch('ago');
  });

  test('formatUTCDate', () => {
    expect(formatUTCDate(utcTimestamp)).toBe('15:32 20.07.2020');
  });

  test('formatUTCDaysAgo', () => {
    expect(formatUTCDaysAgo(utcTimestamp)).toMatch('ago');
  });
});
