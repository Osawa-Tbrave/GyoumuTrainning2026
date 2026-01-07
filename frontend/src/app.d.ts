// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: string;
				email: string;
				name?: string; // name might be optional
			} | null;
			token: string | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface User {
		id: string;
		email: string;
		name?: string;
	}

	interface AuthContext {
		user: import('svelte/store').Writable<User | null>;
		isLoggedIn: import('svelte/store').Readable<boolean>;
		login: (userData: User, token: string) => void;
		logout: () => void;
		token: import('svelte/store').Writable<string | null>;
	}
}

export {};
