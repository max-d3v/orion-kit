import { ORPCError } from "@orpc/client";
import { EVENTS } from "@workspace/analytics/events";
import { capture } from "@workspace/analytics/server";
import { captureException } from "@workspace/observability/server";
import { base } from "../base";

export const errorMiddleware = base.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof ORPCError && error.defined) {
      capture({
        event: EVENTS.expected_error,
        userId: "anonymous",
        details: {
          code: error.code,
          message: error.message,
        },
      });
    } else {
      captureException(error);
    }
    throw error;
  }
});
