<script lang="ts">
  // 親から受け取る引数
  export let label: string;
  export let onClick: () => void;
</script>

<!--  クリック時に渡された関数をクリック時に実行。 -->
<button on:click={onClick}>
  {label}
</button>

<style>
  button {
    padding: 6px 12px;
    border: 1px solid #ccc;
    background: #f5f5f5;
    cursor: pointer;
  }
  button:hover {
    background: #e5e5e5;
  }
</style>