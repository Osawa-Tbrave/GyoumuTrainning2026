// // src/routes/todos/+page.server.ts
// export async function load({ fetch }) {
//   const res = await fetch('/api/todos');
//   const items = await res.json();
//   return { items };
// }

// src/routes/todos/+page.server.ts

export async function load({ fetch }) {
  // キャッシュを使わず、毎回最新のデータを取得する
  const res = await fetch('/api/todos', {
    cache: 'no-store'
  });

  const items = await res.json();

  return { items };
}