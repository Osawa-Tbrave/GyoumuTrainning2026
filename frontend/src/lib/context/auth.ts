import { getContext, setContext } from 'svelte';
import type { AuthContext } from '../../../../src/app.d'; // Adjust path if necessary

export const AUTH_CONTEXT_KEY = Symbol('auth_context_key');

export function setAuthContext(context: AuthContext) {
    setContext(AUTH_CONTEXT_KEY, context);
}

export function getAuthContext(): AuthContext {
    return getContext(AUTH_CONTEXT_KEY);
}
