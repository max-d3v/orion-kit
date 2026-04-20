import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { client } from "@workspace/rpc/orpc/orpc";

export const orpc = createTanstackQueryUtils(client);
