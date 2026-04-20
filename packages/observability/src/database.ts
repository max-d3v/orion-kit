import { instrumentDrizzleClient } from "@kubiks/otel-drizzle";
import { db } from "@workspace/database/client";
import { env } from "./keys";

// Only attach OTel spans to the Drizzle client when observability is actually wired up.
// When neither Sentry nor an OTLP exporter is configured, skip instrumentation entirely
// so apps without observability envs don't pay the cost.
const hasObservabilityExporter = Boolean(
  env.NEXT_PUBLIC_SENTRY_DSN || env.SENTRY_TRACE_EXPORTER_URL
);

export const instrumentation = hasObservabilityExporter
  ? instrumentDrizzleClient(db)
  : undefined;
