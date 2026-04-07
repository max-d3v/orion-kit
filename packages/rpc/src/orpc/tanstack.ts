import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { client } from "./orpc.server";

export const orpc = createTanstackQueryUtils(client);
