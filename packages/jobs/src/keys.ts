import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    TRIGGER_PROJECT: z.string(),
  },
  runtimeEnv: {
    TRIGGER_PROJECT: process.env.TRIGGER_PROJECT
  }
});