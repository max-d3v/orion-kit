import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_AXIOM_DATASET: z.string(),
    NEXT_PUBLIC_AXIOM_TOKEN: z.string().includes("xaat_"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET,
    NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN
  }
});