<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<a href="./">home</a>
	<a href="todos">todos</a>
	<a href="api-demo">apis</a>


</nav>

{@render children()}
