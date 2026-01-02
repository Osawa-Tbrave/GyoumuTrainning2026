<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { enhance } from '$app/forms';
  export let data;
</script>

<h1>Todos</h1>

<!-- 新規追加フォーム -->
<form method="POST" action="?/create" use:enhance>
  <div style="margin-bottom: 20px;">
    <input
      type="text"
      name="task"
      placeholder="新しいタスクを入力"
      style="padding: 6px; width: 250px;"
      autocomplete="off"
    />
    <Button label="Add" type="submit" />
  </div>
</form>

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
          <form method="POST" action="?/delete" use:enhance>
            <input type="hidden" name="id" value={item.id} />
            <Button label="Delete" type="submit" />
          </form>
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