// src/lib/stores/todosStore.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface Todo {
    id: number;
    task: string;
    is_deleted: boolean;
    created_at?: string;
    updated_at?: string;
}

interface TodosStore {
    todos: Todo[];
    loading: boolean;
    error: string | null;
    init: () => Promise<void>;
    add: (task: string) => Promise<void>;
    update: (id: number, task: string, is_deleted: boolean) => Promise<void>;
    remove: (id: number) => Promise<void>;
}

function createTodosStore() {
    const { subscribe, set, update } = writable<TodosStore>({
        todos: [],
        loading: false,
        error: null,
        init: async () => {}, // Placeholder, will be replaced
        add: async () => {}, // Placeholder
        update: async () => {}, // Placeholder
        remove: async () => {}, // Placeholder
    });

    const init = async () => {
        if (!browser) return; // Only run in browser
        update(s => ({ ...s, loading: true, error: null }));
        try {
            const response = await fetch('/api/todos');
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to fetch todos');
            }
            const { data } = await response.json();
            update(s => ({ ...s, todos: data || [] }));
        } catch (e: any) {
            update(s => ({ ...s, error: e.message || 'Unknown error' }));
        } finally {
            update(s => ({ ...s, loading: false }));
        }
    };

    const add = async (task: string) => {
        update(s => ({ ...s, loading: true, error: null }));
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to add todo');
            }
            const { data: newTodo } = await response.json();
            update(s => ({ ...s, todos: [...s.todos, newTodo] }));
        } catch (e: any) {
            update(s => ({ ...s, error: e.message || 'Unknown error' }));
        } finally {
            update(s => ({ ...s, loading: false }));
        }
    };

    const _update = async (id: number, task: string, is_deleted: boolean) => {
        update(s => ({ ...s, loading: true, error: null }));
        try {
            const response = await fetch('/api/todos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, task, is_deleted }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to update todo');
            }
            const { data: updatedTodo } = await response.json();
            update(s => ({
                ...s,
                todos: s.todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
            }));
        } catch (e: any) {
            update(s => ({ ...s, error: e.message || 'Unknown error' }));
        } finally {
            update(s => ({ ...s, loading: false }));
        }
    };

    const remove = async (id: number) => {
        update(s => ({ ...s, loading: true, error: null }));
        try {
            const response = await fetch('/api/todos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to delete todo');
            }
            // If soft delete, update the item in the store
            // For now, assuming successful soft delete means it should be filtered out from active todos
            update(s => ({ ...s, todos: s.todos.filter(todo => todo.id !== id) }));
        } catch (e: any) {
            update(s => ({ ...s, error: e.message || 'Unknown error' }));
        } finally {
            update(s => ({ ...s, loading: false }));
        }
    };

    return {
        subscribe,
        set,
        update,
        init,
        add,
        update: _update, // Rename to avoid conflict with svelte/store update
        remove,
    };
}

export const todosStore = createTodosStore();

// Initialize the store when the browser environment is ready
if (browser) {
    todosStore.init();
}
