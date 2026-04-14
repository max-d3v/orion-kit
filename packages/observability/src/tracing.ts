import {
  type Span,
  SpanKind,
  SpanStatusCode,
  type Tracer,
  trace,
} from "@opentelemetry/api";

export type { Span, Tracer };
export { SpanKind, SpanStatusCode, trace };

/** Create a named tracer scoped to a package or module. */
export function getTracer(name: string): Tracer {
  return trace.getTracer(name);
}

/** Return the currently active span, if any. */
export function getActiveSpan(): Span | undefined {
  return trace.getActiveSpan();
}

/**
 * Execute an async function inside a new span.
 *
 * The span is ended and its status set automatically.
 * Exceptions are recorded and re-thrown.
 */
export function withTracing<T>(
  tracer: Tracer,
  name: string,
  fn: (span: Span) => Promise<T>,
  attributes?: Record<string, string | number | boolean>
): Promise<T> {
  return tracer.startActiveSpan(name, { attributes }, async (span) => {
    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof Error) {
        span.recordException(error);
      }
      throw error;
    } finally {
      span.end();
    }
  });
}
