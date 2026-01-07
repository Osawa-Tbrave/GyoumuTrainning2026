<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	{#if data.user}
		<a href="./">home</a>
		<a href="todos">todos</a>
		<a href="api-demo">apis</a>

		<span class="user-info">Welcome, {data.user.email}</span>
		<form method="POST" action="/signout" data-sveltekit-reload>
			<button type="submit">Sign out</button>
		</form>
	{:else}
		<span class="app-title">My Application</span>
	{/if}
</nav>

{@render children()}

<style>
	nav {
		display: flex;
		gap: 1em;
		padding: 1em;
		background: #f0f0f0;
		align-items: center; /* 中央揃え */
	}

	.app-title {
		font-weight: bold;
		font-size: 1.2rem;
	}

	nav a {
		text-decoration: none;
		color: #333;
	}

	nav a:hover {
		text-decoration: underline;
	}

	.user-info {
		margin-left: auto; /* 他の要素を左に寄せ、これを右に寄せる */
		margin-right: 1em;
	}
	nav form button {
		padding: 0.5em 1em;
		background-color: #dc3545; /* Bootstrapのdangerカラー */
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
	}
	nav form button:hover {
		background-color: #c82333;
	}
</style>
