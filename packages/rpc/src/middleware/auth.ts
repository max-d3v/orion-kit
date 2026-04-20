import { os } from "@orpc/server";
import { auth } from "@workspace/auth/server";
import { HttpError } from "@workspace/types/errors/http";

// This needs clerk middleware from wherever its called.
export const authMiddleware = os
  .$context<{ userId?: string }>()
  .middleware(async ({ next }) => {
    console.log("authMiddleware");
    const { sessionClaims, userId } = await auth();

    console.log("authMiddleware", { sessionClaims, userId });


    if (!userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const result = await next({
      context: {
        user: {
          id: userId,
          ...sessionClaims,
        },
      },
    });


    return result;
  });
