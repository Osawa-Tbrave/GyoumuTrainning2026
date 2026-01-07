// src/routes/(auth)/signup/page.server.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { actions } from './+page.server';
import { fail } from '@sveltejs/kit';

// --- Mocks ---
// Mock dependencies to isolate the action logic.
// We only need to test validation, so DB is not important.
vi.mock('$lib/server/db', () => ({
	db: {}
}));

vi.mock('$lib/server/db/schema', () => ({
	users: {},
	sessions: {}
}));

vi.mock('bcrypt', () => ({
	default: {
		hash: vi.fn()
	}
}));

vi.mock('@sveltejs/kit', async () => {
	const original = await vi.importActual('@sveltejs/kit');
	return {
		...original,
		redirect: vi.fn(), // Simple mock, we are not testing redirection anymore
		fail: vi.fn(original.fail) // Spy on fail but keep original implementation
	};
});

describe('/signup actions', () => {
	it('should fail with 400 for a weak password', async () => {
		const formData = new FormData();
		formData.append('email', 'test@example.com');
		formData.append('password', 'short');
		const request = new Request('http://localhost/signup', { method: 'POST', body: formData });

		const result = await actions.default({ request, cookies: null });

		expect(result).toEqual(
			fail(400, {
				email: 'test@example.com',
				error: 'Password must be at least 8 characters and include both uppercase and lowercase letters.'
			})
		);
	});
});
