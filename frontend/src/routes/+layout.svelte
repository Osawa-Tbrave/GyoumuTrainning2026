<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { setContext } from 'svelte';
	import { writable, derived } from 'svelte/store';
	import { AUTH_CONTEXT_KEY } from '$lib/context/auth';
	import type { User, AuthContext } from 'src/app.d'; // Ensure this path is correct based on your setup

	let { children, data } = $props();

	// Initialize user and token stores from server-side data
	const user = writable<User | null>(data.user);
	const token = writable<string | null>(data.token);

	// Derived store for login status
	const isLoggedIn = derived(user, ($user) => !!$user);

	// Login function
	const login = (userData: User, newToken: string) => {
		user.set(userData);
		token.set(newToken);
		// Potentially update local storage or cookies here if not handled by hooks.server.ts
	};

	// Logout function
	const logout = async () => {
		user.set(null);
		token.set(null);
		// Invalidate session on the server might be needed here or handled by form action
		const response = await fetch('/signout', { method: 'POST' });
		if (response.ok) {
			window.location.href = '/login'; // Redirect after successful logout
		}
	};

	// Provide the auth context
	setContext<AuthContext>(AUTH_CONTEXT_KEY, {
		user,
		isLoggedIn,
		login,
		logout,
		token
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	{#if $user}
		<a href="./">home</a>
		<a href="todos">todos</a>
		<a href="api-demo">apis</a>

		<span class="user-info">Welcome, {$user.email}</span>
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
