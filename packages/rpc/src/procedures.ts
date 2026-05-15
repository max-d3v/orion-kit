import { base } from "./base";
import { authMiddleware } from "./middleware/auth";
import { errorMiddleware } from "./middleware/error";

export const publicProcedure = base.use(errorMiddleware);

export const authenticatedProcedure = publicProcedure.use(authMiddleware);
