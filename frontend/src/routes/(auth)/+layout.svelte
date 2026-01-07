<script lang="ts">
	import { page } from '$app/stores';
	let { children } = $props();
</script>

<div class="auth-container" data-testid="auth-container">
	<div class="auth-form-wrapper" data-testid="auth-form-wrapper">
		{@render children()}
		<div class="switch-link">
			{#if $page.route.id?.includes('/login')}
				<p>
					アカウントをお持ちでないですか？ <a href="/signup">サインアップ</a>
				</p>
			{:else if $page.route.id?.includes('/signup')}
				<p>
					すでにアカウントをお持ちですか？ <a href="/login">ログイン</a>
				</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.auth-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 80vh;
	}
	.auth-form-wrapper {
		width: 100%;
		max-width: 400px;
		padding: 2rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	}
	.switch-link {
		margin-top: 1.5rem;
		text-align: center;
	}
	a {
		color: #007bff;
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}
</style>