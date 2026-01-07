import { page } from 'vitest/browser';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { writable } from 'svelte/store';
import Page from './+page.svelte';
import type { User } from 'src/app.d';

// Mock the auth context module
vi.mock('$lib/context/auth', () => {
    const mockUser = writable<User | null>(null);
    const mockIsLoggedIn = writable(false);
    const mockToken = writable<string | null>(null);

    return {
        getAuthContext: vi.fn(() => ({
            user: mockUser,
            isLoggedIn: mockIsLoggedIn,
            token: mockToken,
            login: vi.fn((userData: User, token: string) => {
                mockUser.set(userData);
                mockIsLoggedIn.set(true);
                mockToken.set(token);
            }),
            logout: vi.fn(() => {
                mockUser.set(null);
                mockIsLoggedIn.set(false);
                mockToken.set(null);
            }),
        })),
    };
});

// Import the mocked context for direct manipulation in tests
import { getAuthContext } from '$lib/context/auth';

describe('/+page.svelte', () => {
    let mockAuthContext: ReturnType<typeof getAuthContext>;

    beforeEach(() => {
        // Reset the mock state before each test
        mockAuthContext = getAuthContext();
        mockAuthContext.user.set(null);
        mockAuthContext.isLoggedIn.set(false);
        mockAuthContext.token.set(null);
        vi.clearAllMocks();
    });

    it('should render a welcome message and login/signup buttons when logged out', async () => {
        render(Page);

        const heading = page.getByRole('heading', { level: 1 });
        await expect.element(heading).toHaveText('ホームページへようこそ！');

        const loginButton = page.getByRole('link', { name: 'ログイン' });
        const signupButton = page.getByRole('link', { name: 'サインアップ' });
        await expect.element(loginButton).toBeInTheDocument();
        await expect.element(signupButton).toBeInTheDocument();
        
        // Ensure todos link is not present
        const todosLink = page.queryByRole('link', { name: 'TODOリストへ進む' });
        await expect.element(todosLink).not.toBeInTheDocument();
    });

    it('should render a personalized welcome message and todos link when logged in', async () => {
        const testUser: User = { id: '1', email: 'test@example.com', name: 'Test User' };
        mockAuthContext.user.set(testUser);
        mockAuthContext.isLoggedIn.set(true);
        mockAuthContext.token.set('mock-token');

        render(Page);

        const heading = page.getByRole('heading', { level: 1 });
        await expect.element(heading).toHaveText(`ホームページへようこそ、${testUser.email}！`);

        const todosLink = page.getByRole('link', { name: 'TODOリストへ進む' });
        await expect.element(todosLink).toBeInTheDocument();

        // Ensure login/signup buttons are not present
        const loginButton = page.queryByRole('link', { name: 'ログイン' });
        const signupButton = page.queryByRole('link', { name: 'サインアップ' });
        await expect.element(loginButton).not.toBeInTheDocument();
        await expect.element(signupButton).not.toBeInTheDocument();
    });
});
