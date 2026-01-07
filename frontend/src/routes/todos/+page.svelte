<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { todosStore, type Todo } from '$lib/stores/todosStore';
  import { onMount } from 'svelte';

  let newTask = '';

  onMount(() => {
    // Ensure the store is initialized on mount if it hasn't been already
    todosStore.init();
  });

  async function handleAddTodo() {
    if (newTask.trim()) {
      await todosStore.add(newTask);
      newTask = ''; // Clear input after adding
    }
  }

  async function handleRemoveTodo(id: number) {
    await todosStore.remove(id);
  }

</script>

<h1>Todos</h1>

{#if $todosStore.loading && $todosStore.todos.length === 0}
  <p>Loading todos...</p>
{:else if $todosStore.error}
  <p style="color: red;">Error: {$todosStore.error}</p>
{/if}

<!-- 新規追加フォーム -->
<form on:submit|preventDefault={handleAddTodo}>
  <div style="margin-bottom: 20px;">
    <input
      type="text"
      name="task"
      placeholder="新しいタスクを入力"
      style="padding: 6px; width: 250px;"
      autocomplete="off"
      bind:value={newTask}
      disabled={$todosStore.loading}
    />
    <Button label="Add" type="submit" disabled={!newTask.trim() || $todosStore.loading} />
  </div>
</form>

<!-- 一覧テーブル -->
{#if $todosStore.todos.length > 0}
<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Task</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {#each $todosStore.todos as item (item.id)}
      <tr>
        <td>{item.id}</td>
        <td>{item.task}</td>
        <td>
          <Button label="Delete" onClick={() => handleRemoveTodo(item.id)} disabled={$todosStore.loading} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
{:else if !$todosStore.loading}
  <p>No todos yet. Add one above!</p>
{/if}

<style>
  table {
    border-collapse: collapse;
    width: 100%;
    max-width: 600px;
  }

  th,
  td {
    border: 1px solid #ccc;
    padding: 6px 10px;
    text-align: left;
  }

  th {
    background: #f5f5f5;
  }
</style>