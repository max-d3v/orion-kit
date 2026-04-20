import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { keys } from "./keys";
import { schema } from "./schema";

const isLocal =
  keys().DATABASE_URL.includes("localhost") ||
  keys().DATABASE_URL.includes("127.0.0.1");

const createDb = () => {
  if (isLocal) {
    const sql = postgres(keys().DATABASE_URL);
    return drizzlePg({ client: sql, schema });
  }

  const sql = neon(keys().DATABASE_URL);
  return drizzleNeon({ client: sql, schema });
};

export const db = createDb();
export * from "drizzle-orm";
