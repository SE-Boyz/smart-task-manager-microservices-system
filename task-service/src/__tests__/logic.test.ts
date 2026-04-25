import { describe, it, expect } from '@jest/globals';

// A simple task interface for the test
interface Task {
  title: string;
  completed: boolean;
}

const validateTask = (task: Partial<Task>) => {
  if (!task.title) throw new Error('Title is required');
  return true;
};

describe('Task Service Logic', () => {
  it('should validate a correct task', () => {
    const task = { title: 'Finish Assignment', completed: false };
    expect(validateTask(task)).toBe(true);
  });

  it('should throw an error if title is missing', () => {
    const task = { completed: false };
    expect(() => validateTask(task)).toThrow('Title is required');
  });
});
