import { db } from '$lib/server/db';
import { todos } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm'; //where句に使用するもの

// 論理削除　params.idをもとにis_deletedをtrueに更新
export async function DELETE({ params }) {
  const id = Number(params.id);

  await db
    .update(todos)
    .set({ is_deleted: true })
    .where(eq(todos.id, id));

  return new Response(null, { status: 204 });
}