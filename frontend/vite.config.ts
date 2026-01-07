import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		// 期待するアサーション数を必須にする（安全）
		expect: { requireAssertions: true },

		// プロジェクトは「server」だけにする（client/browser は削除）
		projects: [
			{
				extends: './vite.config.ts',

				test: {
					name: 'server',
					environment: 'node',

					// JS/TS のユニットテストだけ実行
					include: ['src/**/*.{test,spec}.{js,ts}'],

					// Svelte コンポーネントのブラウザテストは除外
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});