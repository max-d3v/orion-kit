import "server-only";

import { createRouterClient } from "@orpc/server";
import { headers } from "next/headers";
import { router } from "../router";

export const client = createRouterClient(router, {
  context: async () => ({
    headers: await headers(), // this will let the auth middleware use the clerk auth method!  UGA UGA UGA UGA UGA UGA UGA UGA UGA UGA
  }),
});
