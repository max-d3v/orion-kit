import { os } from "@orpc/server";
import { authMiddleware } from "./middleware/auth";

// `zodErrorLoggerMiddleware` must be attached before any `.input(schema)` call
// so it wraps around oRPC's input validation step and can catch its errors.
export const publicProcedure = os;

export const authenticatedProcedure = publicProcedure.use(authMiddleware);
