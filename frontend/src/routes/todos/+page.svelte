<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { deleteTodo, createTodo } from '$lib/services/todos';
  import { invalidateAll } from '$app/navigation';
  export let data;

  let newTask = '';

  async function handleCreate() {
    if (!newTask.trim()) return;

    await createTodo(newTask);
    newTask = '';

    // 関連する load 関数を再実行してデータを更新
    await invalidateAll();
  }

  async function handleDelete(id: number) {
    await deleteTodo(id);
    // 関連する load 関数を再実行してデータを更新
    await invalidateAll();
  }
</script>

<h1>Todos</h1>

<!-- 新規追加フォーム -->
<div style="margin-bottom: 20px;">
  <input
    type="text"
    bind:value={newTask}
    placeholder="新しいタスクを入力"
    style="padding: 6px; width: 250px;"
  />
  <Button label="Add" onClick={handleCreate} />
</div>

<!-- 一覧テーブル -->
<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Task</th>
      <th></th>
    </tr>
  </thead>

  <tbody>
    {#each data.items as item}
      <tr>
        <td>{item.id}</td>
        <td>{item.task}</td>
        <td>
          <Button label="Delete" onClick={() => handleDelete(item.id)} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
    width: 100%;
    max-width: 600px;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 6px 10px;
    text-align: left;
  }

  th {
    background: #f5f5f5;
  }
</style>