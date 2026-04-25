import { describe, it, expect } from '@jest/globals';

// A simple notification formatter mock
const formatEmail = (user: string, action: string) => {
  if (!user || !action) throw new Error('User and action are required');
  return `Hello ${user}, your task was ${action.toLowerCase()}.`;
};

describe('Notification Service Formatting', () => {
  it('should format a correct email message', () => {
    const message = formatEmail('John', 'CREATED');
    expect(message).toBe('Hello John, your task was created.');
  });

  it('should throw an error if data is missing', () => {
    expect(() => formatEmail('', 'CREATED')).toThrow('User and action are required');
  });
});
