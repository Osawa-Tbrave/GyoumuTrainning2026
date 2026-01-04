import { db } from "$lib/server/db";
import { users, sessions } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    const user = result[0];
    if (!user) return { error: "Invalid credentials" };

    const ok = await bcrypt.compare(password, user.hashed_password);
    if (!ok) return { error: "Invalid credentials" };

    const sessionId = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      expiresAt: expires
    });

    cookies.set("session_id", sessionId, {
      path: "/",
      httpOnly: true,
      secure: false
    });

    // 🔥 ログイン成功 → todosへ直接リダイレクト
    throw redirect(302, "/todos");
  }
};