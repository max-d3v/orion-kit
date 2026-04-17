import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().includes("sentry.io"),
  },
  server: {
    SENTRY_AUTH_TOKEN: z.string().startsWith("sntrys_").optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    SENTRY_TRACE_EXPORTER_URL: z.string().url().optional(),
    SENTRY_TRACE_EXPORTER_SECRET_KEY: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_TRACE_EXPORTER_URL: process.env.SENTRY_TRACE_EXPORTER_URL,
    SENTRY_TRACE_EXPORTER_SECRET_KEY: process.env.SENTRY_TRACE_EXPORTER_SECRET_KEY,
  },
});