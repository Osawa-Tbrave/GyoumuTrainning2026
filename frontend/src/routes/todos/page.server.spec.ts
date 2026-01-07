import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load, actions } from './+page.server';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';

// Mock the database module
vi.mock('$lib/server/db', async (importOriginal) => {
    const actual = await importOriginal() as typeof import('$lib/server/db');
    return {
        ...actual,
        db: {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            values: vi.fn().mockResolvedValue(undefined),
            update: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
        }
    };
});

// Mock the schema
vi.mock('$lib/server/db/schema', () => ({
  todos: {
    id: 'todos.id',
    task: 'todos.task',
    is_deleted: 'todos.is_deleted',
  },
}));

// Mock drizzle-orm
vi.mock('drizzle-orm', () => ({
    eq: (col, val) => ({ column: col, value: val }),
}));


describe('/todos server functions', () => {

  beforeEach(() => {
    vi.mocked(db.select).mockClear();
    vi.mocked(db.from).mockClear();
    vi.mocked(db.where).mockClear();
    vi.mocked(db.insert).mockClear();
    vi.mocked(db.values).mockClear();
    vi.mocked(db.update).mockClear();
    vi.mocked(db.set).mockClear();
  });

  // Test for the load function
  describe('load', () => {
    it('should load and return todos that are not deleted', async () => {
      const mockTodos = [{ id: 1, task: 'Test Todo', is_deleted: false }];
      vi.mocked(db.where).mockResolvedValue(mockTodos);

      const result = await load();

      expect(db.select).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalledWith({
        id: 'todos.id',
        task: 'todos.task',
        is_deleted: 'todos.is_deleted',
      });
      expect(db.where).toHaveBeenCalledWith({ column: 'todos.is_deleted', value: false });
      expect(result).toEqual({ items: mockTodos });
    });
  });

  // Tests for the create action
  describe('actions.create', () => {
    it('should create a new todo successfully', async () => {
      const formData = new FormData();
      formData.append('task', 'New test todo');
      const request = new Request('http://localhost/todos', {
        method: 'POST',
        body: formData,
      });

      const result = await actions.create({ request });

      expect(db.insert).toHaveBeenCalled();
      expect(db.values).toHaveBeenCalledWith({
        task: 'New test todo',
        is_deleted: false
      });
      expect(result).toEqual({ success: true });
    });

    it('should fail with 400 if task is missing or empty', async () => {
      const formData = new FormData();
      formData.append('task', '  '); // Empty task
      const request = new Request('http://localhost/todos', {
        method: 'POST',
        body: formData,
      });

      // We need to call the action directly to test its return value
      const result = await actions.create({ request });
      
      expect(result).toEqual(fail(400, { task: '  ', missing: true }));
      expect(db.insert).not.toHaveBeenCalled();
    });

    it('should fail with 500 if database insert fails', async () => {
        const formData = new FormData();
        formData.append('task', 'A valid task');
        const request = new Request('http://localhost/todos', {
          method: 'POST',
          body: formData,
        });

        vi.mocked(db.values).mockRejectedValue(new Error('DB Error'));

        const result = await actions.create({ request });
        expect(result).toEqual(fail(500, { message: 'Failed to create task.' }));
    });
  });

  // Tests for the delete action
  describe('actions.delete', () => {
    it('should soft delete a todo successfully', async () => {
      const formData = new FormData();
      formData.append('id', '123');
      const request = new Request('http://localhost/todos', {
        method: 'POST',
        body: formData,
      });

      vi.mocked(db.where).mockResolvedValue(undefined); // Simulate successful update

      const result = await actions.delete({ request });

      expect(db.update).toHaveBeenCalledWith({
        id: 'todos.id',
        task: 'todos.task',
        is_deleted: 'todos.is_deleted',
      });
      expect(db.set).toHaveBeenCalledWith({ is_deleted: true });
      expect(db.where).toHaveBeenCalledWith({ column: 'todos.id', value: 123 });
      expect(result).toEqual({ success: true });
    });

    it('should fail with 400 if id is not a number', async () => {
        const formData = new FormData();
        formData.append('id', 'not-a-number');
        const request = new Request('http://localhost/todos', {
          method: 'POST',
          body: formData,
        });
  
        const result = await actions.delete({ request });
        
        expect(result).toEqual(fail(400, { message: 'Invalid ID.' }));
        expect(db.update).not.toHaveBeenCalled();
    });

    it('should fail with 500 if database update fails', async () => {
        const formData = new FormData();
        formData.append('id', '123');
        const request = new Request('http://localhost/todos', {
          method: 'POST',
          body: formData,
        });

        vi.mocked(db.where).mockRejectedValue(new Error('DB Error'));

        const result = await actions.delete({ request });
        expect(result).toEqual(fail(500, { message: 'Failed to delete task.' }));
    });
  });
});
