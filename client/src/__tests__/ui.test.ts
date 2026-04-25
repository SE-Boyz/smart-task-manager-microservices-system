import { describe, it, expect } from 'vitest';

// A simple client-side utility mock
const formatTaskDate = (date: string) => {
  if (!date) return 'No Date';
  return new Date(date).toLocaleDateString();
};

describe('Client UI Utilities', () => {
  it('should format a valid date string', () => {
    const formatted = formatTaskDate('2026-04-26');
    expect(formatted).toContain('2026');
  });

  it('should return "No Date" if input is empty', () => {
    expect(formatTaskDate('')).toBe('No Date');
  });
});
