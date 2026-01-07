import { db } from "$lib/server/db";
import { users, sessions } from "$lib/server/db/schema";
import bcrypt from "bcrypt";
import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    // --- 基本チェック ---
    if (!email) {
      return fail(400, { email, error: "Email is required." });
    }
    if (!password) {
      return fail(400, { email, error: "Password is required." });
    }

    // --- メール形式チェック ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, { email, error: "Invalid email format." });
    }

    // --- パスワード強度チェック（最低8文字・大文字小文字を含む） ---
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    if (!hasMinLength || !hasUppercase || !hasLowercase) {
      return fail(400, {
        email,
        error: "Password must be at least 8 characters and include both uppercase and lowercase letters."
      });
    }

    // --- パスワードをハッシュ化 ---
    const hashed = await bcrypt.hash(password, 10);

    // --- ユーザー作成 ---
    const [user] = await db
      .insert(users)
      .values({
        email,
        hashed_password: hashed
      })
      .returning();

    // --- セッション作成 ---
    const sessionId = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      expiresAt: expires
    });

    // --- Cookie にセッションIDを保存 ---
    cookies.set("session_id", sessionId, {
      path: "/",
      httpOnly: true,
      secure: false
    });

    // --- ログインページにリダイレクト ---
    throw redirect(303, "/login");
  }
};