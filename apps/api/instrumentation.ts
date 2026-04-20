import { captureRequestError } from "@sentry/nextjs";
import { isSentryEnabled } from "@workspace/observability/keys";

export async function register() {
  if (!isSentryEnabled) {
    return;
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@workspace/observability/api/sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("@workspace/observability/api/sentry.edge.config");
  }
}

// Safe to export unconditionally — `captureRequestError` is a no-op
// when Sentry hasn't been initialized.
export const onRequestError = captureRequestError;
