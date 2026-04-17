import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./keys";
import { schema } from "./schema";

const isLocal =
  env.DATABASE_URL.includes("localhost") ||
  env.DATABASE_URL.includes("127.0.0.1");

const createDb = () => {
  if (isLocal) {
    const sql = postgres(env.DATABASE_URL);
    return drizzlePg({ client: sql, schema });
  }

  const sql = neon(env.DATABASE_URL);
  return drizzleNeon({ client: sql, schema });
};

export const db = createDb();
export * from "drizzle-orm";
