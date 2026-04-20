import "server-only";

import { createRouterClient } from "@orpc/server";
import { headers } from "next/headers";
import { router } from "../router";

const client = createRouterClient(router, {
  context: async () => ({
    headers: await headers(),
  }),
});

globalThis.$client = client;
