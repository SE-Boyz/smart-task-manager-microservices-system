import { describe, it, expect } from '@jest/globals';

// A simple report aggregator mock
const calculateCompletionRate = (total: number, completed: number) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

describe('Report Service Aggregation', () => {
  it('should calculate the correct completion percentage', () => {
    expect(calculateCompletionRate(10, 5)).toBe(50);
  });

  it('should return 0 if there are no tasks', () => {
    expect(calculateCompletionRate(0, 0)).toBe(0);
  });
});
