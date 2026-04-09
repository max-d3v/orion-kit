import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_LINK_URL: z.string().url(),
    NEXT_PUBLIC_DOCS_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_LINK_URL: process.env.NEXT_PUBLIC_LINK_URL,
    NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
  },
});
