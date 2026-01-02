// src/routes/todos/+page.server.ts
import { db } from '$lib/server/db';
import { todos } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// ページロード時にDBからTodoリストを取得
export async function load() {
  const result = await db.select().from(todos).where(eq(todos.is_deleted, false));
  return { items: result };
}

// フォームアクションの定義
export const actions = {
  // '?/create' アクションに対応
  create: async ({ request }) => {
    const data = await request.formData();
    const task = data.get('task') as string;

    if (!task || !task.trim()) {
      return fail(400, { task, missing: true });
    }

    try {
      await db.insert(todos).values({
        task,
        is_deleted: false
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      return fail(500, { message: 'Failed to create task.' });
    }
  },

  // '?/delete' アクションに対応
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = Number(data.get('id'));

    if (isNaN(id)) {
      return fail(400, { message: 'Invalid ID.' });
    }

    try {
      await db.update(todos).set({ is_deleted: true }).where(eq(todos.id, id));
      return { success: true };
    } catch (error) {
      console.error(error);
      return fail(500, { message: 'Failed to delete task.' });
    }
  }
};