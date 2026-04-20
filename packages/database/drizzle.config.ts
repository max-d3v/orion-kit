import { defineConfig } from "drizzle-kit";
import { keys } from "./src/keys";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  verbose: true,
  dbCredentials: {
    url: keys().DATABASE_URL,
  },
});
