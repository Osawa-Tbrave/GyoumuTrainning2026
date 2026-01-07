// src/routes/api/todos/+server.ts
import { db } from '$lib/server/db';
import { todos } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// GET handler to list todos
export async function GET() {
    try {
        const result = await db.select().from(todos).where(eq(todos.is_deleted, false)).orderBy(todos.created_at);
        return json({ status: 'success', data: result });
    } catch (err) {
        console.error('Error fetching todos:', err);
        throw error(500, 'Failed to fetch todos');
    }
}

// POST handler to create a todo
export async function POST({ request }) {
    try {
        const { task } = await request.json();

        if (!task || !task.trim()) {
            throw error(400, 'Task cannot be empty');
        }

        const newTodo = await db.insert(todos).values({
            task,
            is_deleted: false
        }).returning(); // .returning() to get the inserted data

        return json({ status: 'success', data: newTodo[0] }); // Assuming returning() returns an array
    } catch (err) {
        console.error('Error creating todo:', err);
        if (err.status === 400) {
            throw err;
        }
        throw error(500, 'Failed to create todo');
    }
}

// PUT handler to update a todo (e.g., mark as completed, or edit task)
export async function PUT({ request }) {
    try {
        const { id, task, is_deleted } = await request.json();

        if (typeof id !== 'number') {
            throw error(400, 'Invalid ID provided');
        }

        const updatedTodo = await db.update(todos)
            .set({ task, is_deleted })
            .where(eq(todos.id, id))
            .returning();

        if (updatedTodo.length === 0) {
            throw error(404, 'Todo not found');
        }

        return json({ status: 'success', data: updatedTodo[0] });
    } catch (err) {
        console.error('Error updating todo:', err);
        if (err.status === 400 || err.status === 404) {
            throw err;
        }
        throw error(500, 'Failed to update todo');
    }
}

// DELETE handler to soft-delete a todo
export async function DELETE({ request }) {
    try {
        const { id } = await request.json();

        if (typeof id !== 'number') {
            throw error(400, 'Invalid ID provided');
        }

        const deletedTodo = await db.update(todos)
            .set({ is_deleted: true })
            .where(eq(todos.id, id))
            .returning();

        if (deletedTodo.length === 0) {
            throw error(404, 'Todo not found');
        }

        return json({ status: 'success', data: deletedTodo[0] });
    } catch (err) {
        console.error('Error deleting todo:', err);
        if (err.status === 400 || err.status === 404) {
            throw err;
        }
        throw error(500, 'Failed to delete todo');
    }
}
