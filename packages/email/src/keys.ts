import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string().includes("re_").optional(),
    FROM_EMAIL: z.string().email().optional(),
  },
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
  },
  emptyStringAsUndefined: true,
});

/**
 * Whether transactional email sending is configured.
 * When `false`, `sendEmail` resolves with `{ success: false }` without reaching Resend.
 */
export const isEmailEnabled = Boolean(env.RESEND_API_KEY && env.FROM_EMAIL);
