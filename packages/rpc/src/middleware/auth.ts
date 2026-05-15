import { ORPCError } from "@orpc/client";
import { auth } from "@workspace/auth/auth";
import { base } from "../base";

export const authMiddleware = base.middleware(async ({ context, next }) => {
  const data = await auth.api.getSession({
    headers: context.headers,
  });

  const user = data?.user;
  const sessionClaims = data?.session;

  if (!user) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "unauthorized",
    });
  }

  const result = await next({
    context: {
      user,
      sessionClaims,
    },
  });

  return result;
});
