import { os } from "@orpc/server";
import { authMiddleware } from "./middleware/auth";

export const publicProcedure = os;

export const authenticatedProcedure = publicProcedure.use(authMiddleware);
