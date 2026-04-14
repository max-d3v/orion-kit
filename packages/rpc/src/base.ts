import { os } from "@orpc/server";
import { authMiddleware } from "./middleware/auth";
import { otelMiddleware } from "./middleware/otel";

export const publicProcedure = os.use(otelMiddleware);

export const authenticatedProcedure = publicProcedure.use(authMiddleware);

export const webhookProcedure = publicProcedure;
