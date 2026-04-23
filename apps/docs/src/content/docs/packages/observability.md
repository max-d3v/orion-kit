---
title: Observability Package
description: Sentry error tracking, performance tracing, session replay, and OpenTelemetry (oRPC + Drizzle)
---

Error tracking, performance monitoring, session replay, and OpenTelemetry tracing — built on **Sentry**, with OTel instrumentation for **oRPC** and **Drizzle**.

**Service:** Sentry (+ optional OTLP trace exporter)
**Type:** Auxiliary
**Consumed by:** Apps (`app`, `api`)

> Previously this package used Axiom. It was moved to Sentry to consolidate errors + traces and reduce vendor lock-in (OTel is the integration surface, not a proprietary SDK).

## Package Exports

```json
{
  "exports": {
    "./server": "./src/server.ts",
    "./client": "./src/client.ts",
    "./api/*": "./src/api/*.ts",
    "./app/*": "./src/app/*.ts",
    "./database": "./src/database.ts",
    "./keys": "./src/keys.ts"
  }
}
```

| Export | Purpose |
| ------ | ------- |
| `./server` | Re-exports `@sentry/nextjs` for server/route code |
| `./client` | `"use client"` re-export of `@sentry/nextjs` (e.g. `captureException`) |
| `./api/sentry.server.config` · `./api/sentry.edge.config` | Side-effect init for the `api` app |
| `./app/sentry.client.config` · `./app/sentry.server.config` · `./app/sentry.edge.config` | Side-effect init for the `app` app |
| `./app/otel-config` | `registerOTel` config with oRPC + Drizzle instrumentation |
| `./database` | Instrumented Drizzle client (OTel spans on queries) |
| `./keys` | t3-env validation + `isSentryEnabled` flag |

## Runtime Wiring

### `apps/app` — Next.js instrumentation hook

```ts
// apps/app/instrumentation.ts
import { captureRequestError } from "@sentry/nextjs";
import { registerOTel } from "@vercel/otel";
import { config } from "@workspace/observability/app/otel-config";
import { isSentryEnabled } from "@workspace/observability/keys";

export async function register() {
  await import("@workspace/rpc/orpc/orpc.server");

  if (!isSentryEnabled) return;

  registerOTel(config);

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@workspace/observability/app/sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("@workspace/observability/app/sentry.edge.config");
  }
}

export const onRequestError = captureRequestError;
```

### Client-side error capture

```tsx
// apps/app/app/error.tsx
"use client";
import { captureException } from "@workspace/observability/client";

export default function Error({ error }: { error: Error }) {
  captureException(error);
  // ...
}
```

## What You Get

### Error tracking
Exceptions, unhandled rejections, and React error boundaries are captured via `@sentry/nextjs`.

### Session replay
Configured in `app/sentry.client.config.ts`:

```ts
init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,     // 10% of sessions
  replaysOnErrorSampleRate: 1.0,     // 100% of sessions with errors
  integrations: [replayIntegration()],
});
```

### oRPC tracing
Every oRPC procedure call produces an OTel span via `@orpc/otel`:

```ts
import { ORPCInstrumentation } from "@orpc/otel";
openTelemetryInstrumentations: [new ORPCInstrumentation()];
```

### Database tracing
Drizzle queries are wrapped with `@kubiks/otel-drizzle` spans — **only** when an observability exporter is configured:

```ts
// packages/observability/src/database.ts
const hasObservabilityExporter = Boolean(
  env.NEXT_PUBLIC_SENTRY_DSN || env.SENTRY_TRACE_EXPORTER_URL
);

export const instrumentation = hasObservabilityExporter
  ? instrumentDrizzleClient(db)
  : undefined;
```

Apps without observability envs skip the instrumentation cost entirely.

### Optional OTLP exporter
Set `SENTRY_TRACE_EXPORTER_URL` + `SENTRY_TRACE_EXPORTER_SECRET_KEY` to forward traces to Sentry's OTel endpoint (or any OTLP-compatible backend) instead of using the Sentry SDK pipeline.

## No-op Safety

The whole package is designed to **degrade to a no-op** when envs are missing:

- `isSentryEnabled` is `false` when `NEXT_PUBLIC_SENTRY_DSN` is unset.
- All `init()` calls are gated by `isSentryEnabled`.
- `captureRequestError` / `captureException` are safe to export unconditionally — they no-op when Sentry hasn't been initialized.
- Drizzle instrumentation is skipped when no exporter is configured.

This means the package is safe to keep installed in dev / on contributors' machines without Sentry keys.

## Environment Variables

```bash
# Client — required to enable Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...sentry.io/...

# Server — required for source map upload in CI
SENTRY_AUTH_TOKEN=sntrys_...
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# Optional — direct OTLP trace export
SENTRY_TRACE_EXPORTER_URL=https://...
SENTRY_TRACE_EXPORTER_SECRET_KEY=...
```

## Dependencies

```json
{
  "@sentry/nextjs": "^9.0.0",
  "@orpc/otel": "^1.13.14",
  "@kubiks/otel-drizzle": "^2.1.0",
  "@opentelemetry/exporter-trace-otlp-http": "^0.215.0"
}
```

(`@vercel/otel` is installed in the consuming apps to call `registerOTel`.)

## Related

- [App (Dashboard)](/apps/app) — wires `instrumentation.ts` and `error.tsx`
- [Analytics Package](/packages/analytics) — product analytics complement to error/trace observability
- [Sentry docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [OpenTelemetry](https://opentelemetry.io/)
