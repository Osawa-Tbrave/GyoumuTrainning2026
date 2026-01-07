<script lang="ts">
    import { getAuthContext } from '$lib/context/auth';

    const { user, isLoggedIn } = getAuthContext();
</script>

<div class="container">
    {#if $isLoggedIn}
        <h1>ホームページへようこそ、{$user?.email}！</h1>
        <p>これはログインしたユーザーだけが見ることができるホームページです。</p>
        <a href="/todos" class="button">TODOリストへ進む</a>
    {:else}
        <h1>ホームページへようこそ！</h1>
        <p>ログインしていません。ログインして機能を利用してください。</p>
        <a href="/login" class="button">ログイン</a>
        <a href="/signup" class="button button-secondary">サインアップ</a>
    {/if}
</div>

<style>
    .container {
        padding: 2rem;
        text-align: center;
    }
    .button {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 0.25rem;
        font-weight: bold;
        margin-right: 0.5rem; /* Add some space between buttons */
    }
    .button:hover {
        background-color: #0056b3;
    }
    .button-secondary {
        background-color: #6c757d; /* A secondary color */
    }
    .button-secondary:hover {
        background-color: #5a6268;
    }
</style>
