import { toLocalISODate } from './dates';

describe('toLocalISODate', () => {
  it('formats the local calendar date', () => {
    expect(toLocalISODate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});
