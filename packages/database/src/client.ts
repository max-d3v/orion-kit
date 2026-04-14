import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "./keys";
import { OtelLogger } from "./logger";
import { schema } from "./schema";

const sql = neon(env.DATABASE_URL);

export const db = drizzle({ client: sql, schema, logger: new OtelLogger() });
export * from "drizzle-orm";
