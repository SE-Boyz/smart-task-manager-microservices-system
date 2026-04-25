import { describe, it, expect } from '@jest/globals';

// A simple routing mock for demonstration
const resolveService = (path: string) => {
  if (path.startsWith('/auth')) return 'auth-service';
  if (path.startsWith('/tasks')) return 'task-service';
  throw new Error('Unknown route');
};

describe('API Gateway Routing', () => {
  it('should route /auth requests to auth-service', () => {
    expect(resolveService('/auth/login')).toBe('auth-service');
  });

  it('should route /tasks requests to task-service', () => {
    expect(resolveService('/tasks/all')).toBe('task-service');
  });

  it('should throw error for unknown routes', () => {
    expect(() => resolveService('/unknown')).toThrow('Unknown route');
  });
});
