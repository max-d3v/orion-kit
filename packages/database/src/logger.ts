import { SpanKind, trace } from "@opentelemetry/api";
import type { Logger } from "drizzle-orm";

const tracer = trace.getTracer("drizzle-orm");

/**
 * Drizzle logger that records each query as an OpenTelemetry span event.
 *
 * When a parent span is active (e.g. from the oRPC OTEL middleware) the
 * query is attached as an event on that span.  A zero-duration child span
 * with full DB attributes is also emitted so the query appears as its own
 * node in the trace waterfall.
 */
export class OtelLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    const activeSpan = trace.getActiveSpan();

    if (activeSpan) {
      activeSpan.addEvent("db.query", {
        "db.system": "postgresql",
        "db.statement": query,
      });
    }

    // Emit a standalone span so the query is visible in the trace timeline
    const span = tracer.startSpan("db.query", {
      kind: SpanKind.CLIENT,
      attributes: {
        "db.system": "postgresql",
        "db.statement": query,
        "db.parameters": JSON.stringify(params),
      },
    });
    span.end();
  }
}
