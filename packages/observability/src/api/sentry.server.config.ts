import { ORPCInstrumentation } from "@orpc/otel";
import { init } from "@sentry/nextjs";

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  openTelemetryInstrumentations: [new ORPCInstrumentation()],
});
