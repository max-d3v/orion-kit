import { db } from "@workspace/database/client";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { config } from "./config";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  ...config,
  plugins: [organization(), nextCookies()],
});
