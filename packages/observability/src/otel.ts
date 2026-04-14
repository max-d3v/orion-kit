import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

/**
 * Register OpenTelemetry with an OTLP HTTP exporter.
 *
 * The exporter reads standard OTEL env vars automatically:
 * - OTEL_EXPORTER_OTLP_ENDPOINT  (default: http://localhost:4318)
 * - OTEL_EXPORTER_OTLP_HEADERS   (e.g. "Authorization=Bearer token")
 * - OTEL_EXPORTER_OTLP_PROTOCOL  (default: http/protobuf)
 *
 * Call this inside the Next.js `register()` instrumentation hook.
 */
export function registerOTel(serviceName: string): void {
  const exporter = new OTLPTraceExporter();

  const sdk = new NodeSDK({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: serviceName,
      [ATTR_SERVICE_VERSION]: process.env.npm_package_version ?? "0.0.1",
    }),
    spanProcessors: [new BatchSpanProcessor(exporter)],
  });

  sdk.start();

  process.on("SIGTERM", () => {
    sdk.shutdown().catch(console.error);
  });
}
