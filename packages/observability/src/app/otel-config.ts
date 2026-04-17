import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { instrumentation as orpcInstrumentation } from "../orpc";

// side effect import because the instrumentation is not imported anywhere else.
import "../database";

export const config =
  process.env.SENTRY_TRACE_EXPORTER_SECRET_KEY &&
  process.env.SENTRY_TRACE_EXPORTER_URL
    ? {
        serviceName: "app",
        instrumentations: [orpcInstrumentation],
        traceExporter: new OTLPTraceExporter({
          url: process.env.SENTRY_TRACE_EXPORTER_URL,
          headers: {
            "x-sentry-auth": `sentry sentry_key=${process.env.SENTRY_TRACE_EXPORTER_SECRET_KEY}`,
          },
        }),
      }
    : {
        serviceName: "app",
        instrumentations: [orpcInstrumentation],
      };
