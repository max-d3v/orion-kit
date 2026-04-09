import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    STRIPE_SECRET_KEY: z.string().includes("sk_"),
    STRIPE_WEBHOOK_SECRET: z.string().includes("whsec_"),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().includes("pk_"),
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO: z.string().includes("price_"),
    NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE: z.string().includes("price_"),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
    NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  }
});