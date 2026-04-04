import { os } from "@orpc/server";
import { auth } from "@workspace/auth/server";
import { HttpError } from "@workspace/types/errors/http";

// This needs clerk middleware from wherever its called.
export const authMiddleware = os
  .$context<{ userId?: string }>()
  .middleware(async ({ context, next }) => {
    const { sessionClaims, userId } = await auth();

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
