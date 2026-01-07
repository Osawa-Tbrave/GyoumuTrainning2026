<script lang="ts">
  export let form;
</script>

<form method="POST" class="form">
  {#if form?.error}
    <div class="error-bubble">
      {form.error}
    </div>
  {/if}

  <input
    name="email"
    placeholder="email"
    type="email"
    required
    value={form?.email ?? ''}
  />

  <input
    name="password"
    type="password"
    placeholder="password"
    required
  />

  <button>Sign up</button>
</form>

<style>
  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
    margin: auto;
  }

  .error-bubble {
    background-color: #ffe0e0;
    color: #b00020;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    position: relative;
    font-size: 0.95rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }

  .error-bubble::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 1.5rem;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-top-color: #ffe0e0;
  }

  input {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
  }

  button {
    padding: 0.75rem;
    font-size: 1rem;
    background-color: #0077cc;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  button:hover {
    background-color: #005fa3;
  }
</style>