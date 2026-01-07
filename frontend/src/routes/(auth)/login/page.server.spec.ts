// src/routes/(auth)/login/page.server.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions } from './+page.server';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import bcrypt from 'bcrypt';

// --- Mocks ---
vi.mock('$lib/server/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('$lib/server/db/schema', () => ({
  users: {},
  sessions: {},
}));

vi.mock('drizzle-orm', () => ({
  eq: (col, val) => ({ column: col, value: val }),
}));

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock('@sveltejs/kit', async () => {
    const original = await vi.importActual('@sveltejs/kit');
    return {
        ...original,
        redirect: vi.fn((status, location) => {
            // In tests, we can't actually redirect, so we throw a special error
            // to signal that a redirect was attempted.
            const error = new Error(`Redirect to ${location}`);
            error.status = status;
            error.location = location;
            throw error;
        }),
    };
});


describe('/login actions', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Successful Login
  it('should redirect to / on successful login', async () => {
    const mockUser = { id: 'user1', email: 'test@example.com', hashed_password: 'hashed_password' };
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'Password123');
    const request = new Request('http://localhost/login', { method: 'POST', body: formData });
    const cookies = { set: vi.fn() };

    vi.mocked(db.where).mockResolvedValue([mockUser]);
    vi.mocked(bcrypt.compare).mockResolvedValue(true);

    try {
        await actions.default({ request, cookies });
        // If it doesn't throw, the test fails
        expect.fail('Expected a redirect to be thrown');
    } catch (error) {
        expect(error.location).toBe('/');
        expect(error.status).toBe(302);
    }

    expect(cookies.set).toHaveBeenCalledWith(
        "session_id",
        expect.any(String),
        expect.objectContaining({ path: "/" })
    );
    expect(db.insert).toHaveBeenCalled();
  });

  // Test 2.1: User not found
  it('should fail with 400 if user is not found', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'Password123');
    const request = new Request('http://localhost/login', { method: 'POST', body: formData });
    const cookies = { set: vi.fn() };

    vi.mocked(db.where).mockResolvedValue([]);
    const result = await actions.default({ request, cookies });
    expect(result).toEqual(fail(400, { email: 'test@example.com', error: "Invalid credentials" }));
    expect(cookies.set).not.toHaveBeenCalled();
  });

  // Test 2.2: Incorrect password
  it('should fail with 400 for incorrect password', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'WrongPassword123');
    const request = new Request('http://localhost/login', { method: 'POST', body: formData });
    const cookies = { set: vi.fn() };
    const mockUser = { id: 'user1', email: 'test@example.com', hashed_password: 'hashed_password' };

    vi.mocked(db.where).mockResolvedValue([mockUser]);
    vi.mocked(bcrypt.compare).mockResolvedValue(false);
    const result = await actions.default({ request, cookies });
    expect(result).toEqual(fail(400, { email: 'test@example.com', error: "Invalid credentials" }));
    expect(cookies.set).not.toHaveBeenCalled();
  });

  // Test 3: Missing Email
  it('should fail with 400 if email is not provided', async () => {
    const formData = new FormData();
    // No email appended
    formData.append('password', 'Password123');
    const request = new Request('http://localhost/login', { method: 'POST', body: formData });
    const cookies = { set: vi.fn() };

    const result = await actions.default({ request, cookies });

    expect(result).toEqual(fail(400, { email: null, error: "Email is required." }));
    expect(cookies.set).not.toHaveBeenCalled();
    expect(db.select).not.toHaveBeenCalled();
  });
});
