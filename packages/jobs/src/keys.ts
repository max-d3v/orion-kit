import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    TRIGGER_PROJECT: z.string().optional(),
  },
  runtimeEnv: {
    TRIGGER_PROJECT: process.env.TRIGGER_PROJECT,
  },
  emptyStringAsUndefined: true,
});

/**
 * Whether background jobs are wired up.
 * When `false`, the Trigger.dev config falls back to a placeholder and the CLI
 * surfaces a clear error instead of exploding at module load inside app code.
 */
export const isJobsEnabled = Boolean(env.TRIGGER_PROJECT);
