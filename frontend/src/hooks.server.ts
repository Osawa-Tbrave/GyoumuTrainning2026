import { db } from "$lib/server/db";
import { sessions, users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get("session_id");

  if (sessionId) {
    const result = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));

    const session = result[0];

    if (session && session.expiresAt > new Date()) {
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, session.userId));

      event.locals.user = userResult[0];
    }
  }

  return resolve(event);
};