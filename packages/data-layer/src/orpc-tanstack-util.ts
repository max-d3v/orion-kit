import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { client } from "@workspace/rpc/orpc/orpc.server";

export const orpc = createTanstackQueryUtils(client);
