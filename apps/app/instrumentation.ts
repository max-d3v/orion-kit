import { captureRequestError } from "@sentry/nextjs";
import { registerOTel } from "@vercel/otel";
import {
  config,
  isObservabilityEnabled,
} from "@workspace/observability/app/otel-config";

export async function register() {
  await import("@workspace/rpc/orpc/orpc.server");

  registerOTel(config);
  
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@workspace/observability/app/sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("@workspace/observability/app/sentry.edge.config");
  }
}

// Safe to export unconditionally — `captureRequestError` is a no-op
// when Sentry hasn't been initialized.
export const onRequestError = captureRequestError;
