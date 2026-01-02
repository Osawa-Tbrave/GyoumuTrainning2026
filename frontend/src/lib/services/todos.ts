// src/lib/services/todos.ts ← フロント側の fetch ロジック
// • 	フロントから API を呼ぶ
// • 	fetch をまとめる
// • 	UI のコードをスッキリさせる
// つまり フロントの API クライアント。

const BASE_URL = '/api/todos';

async function request(url: string, options?: RequestInit) {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;

  return res.json();
}

export function getTodos() {
  return request(BASE_URL);
}

export function deleteTodo(id: number) {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' });
}

export function createTodo(task: string) {
  return request(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ task }),
    headers: { 'Content-Type': 'application/json' }
  });
}