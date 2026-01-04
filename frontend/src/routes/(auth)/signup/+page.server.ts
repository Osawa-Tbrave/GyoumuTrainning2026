import { db } from "$lib/server/db";
import { users, sessions } from "$lib/server/db/schema";
import bcrypt from "bcrypt";

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    // パスワードをハッシュ化
    const hashed = await bcrypt.hash(password, 10);

    // ユーザー作成
    const [user] = await db
      .insert(users)
      .values({
        email,
        hashed_password: hashed
      })
      .returning();

    // セッション作成
    const sessionId = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7日

    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      expiresAt: expires
    });

    // Cookie にセッションIDを保存
    cookies.set("session_id", sessionId, {
      path: "/",
      httpOnly: true,
      secure: false // 本番では true
    });

    // ログインページにリダイレクトして、ログインを促す
    throw redirect(303, "/login");
  }
};