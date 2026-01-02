// DB のアクセス。
// - DB にアクセスする
// - Drizzle を使う
// - PostgreSQL と通信する
// - JSON を返す
// つまり バックエンド。


import { db } from '$lib/server/db'; // db/index.ts から取得。
import { todos } from '$lib/server/db/schema'; // で定義した  テーブルオブジェクトをインポート
import { eq } from 'drizzle-orm';

// sveltekit のGET
export async function GET() {
  // DB から全件取得 Drizzle で  を実行している行
    const result = await db
    .select()
    .from(todos)
    // 論理削除されていないものだけ取得する
    .where(eq(todos.is_deleted, false));


  // DB から取ってきた配列を JSON 文字列に変換  を付けることで、クライアント側が「これは JSON だ」と認識できる
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json',
      'Cache-Control': 'no-store'

     }
    
  });
}


// --------------------------------------------------
// sveltekit の POST ハンドラ（新規追加）
export async function POST({ request }) {
  // リクエストボディから JSON を取り出す
  const { task } = await request.json();

  // DB に新しいレコードを追加し、そのIDが返るまで待つ
  const result = await db
    .insert(todos)
    .values({
      task,
      is_deleted: false
    })
    .returning({ id: todos.id });

  // 作成成功を示す 201 と、作成されたオブジェクトを返す
  return new Response(JSON.stringify(result[0]), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}

