import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		expect: { requireAssertions: true },

		projects: [
			{
				extends: './vite.config.ts',

				test: {
					name: 'client',

					browser: {
						enabled: false,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},

					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],

					// ❌ page.svelte.spec.ts を除外
					exclude: [
						'src/lib/server/**',
						'src/routes/page.svelte.spec.ts'
					]
				}
			},

			{
				extends: './vite.config.ts',

				test: {
					name: 'server',
					environment: 'node',

					include: ['src/**/*.{test,spec}.{js,ts}'],

					// ❌ server 側からも除外
					exclude: [
						'src/**/*.svelte.{test,spec}.{js,ts}',
						'src/routes/page.svelte.spec.ts'
					]
				}
			}
		]
	}
});