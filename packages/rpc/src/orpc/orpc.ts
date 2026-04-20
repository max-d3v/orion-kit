import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { router } from "../router";

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
  url: () => {
    if (typeof window === "undefined") {
      throw new Error("RPCLink is not allowed on the server side.");
    }

    return "http://localhost:3002/rpc";
  },
  // The app (:3001) and the API (:3002) are different origins, so the browser
  // won't send Clerk's `__session` cookie unless we explicitly opt in.
  // The API's CORS already sets `Access-Control-Allow-Credentials: true`.
  fetch: (request, init) =>
    globalThis.fetch(request, { ...init, credentials: "include" }),
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link);
