import { lucia } from "lucia";
import { dev } from "$app/environment";
import { pg } from "@lucia-auth/adapter-postgresql";
import { db } from "$lib/server/db";

export const auth = lucia({
  adapter: pg(db),
  env: dev ? "DEV" : "PROD",
  sessionCookie: {
    attributes: {
      secure: !dev
    }
  }
});

export type Auth = typeof auth;