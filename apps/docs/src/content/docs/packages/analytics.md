---
title: Analytics
description: PostHog product analytics, Vercel Analytics, and optional Google Analytics
---

The Analytics package (`@workspace/analytics`) integrates PostHog for product analytics, Vercel Analytics for performance monitoring, and optionally Google Analytics for traffic tracking.

**Service:** PostHog + Vercel Analytics
**Type:** Auxiliary
**Consumed by:** Apps (app, web)

## Package Exports

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./provider": "./src/provider.tsx",
    "./server": "./src/server.ts",
    "./instrumentation-client": "./src/instrumentation-client.ts",
    "./keys": "./src/keys.ts"
  }
}
```

| Export | Purpose |
| ------ | ------- |
| `.` | PostHog client + AnalyticsProvider |
| `./provider` | React provider with Vercel Analytics + Google Analytics |
| `./server` | Server-side PostHog instance (flushAt: 1 for serverless) |
| `./instrumentation-client` | PostHog client initialization |
| `./keys` | t3-env validation |

## PostHog Integration

### Client-side

```typescript
// src/instrumentation-client.ts
import posthog from "posthog-js";

posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
});
```

### Server-side

```typescript
// src/server.ts
import "server-only";
import { PostHog } from "posthog-node";

export const analytics = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  host: env.NEXT_PUBLIC_POSTHOG_HOST,
  flushAt: 1,        // Flush immediately (serverless)
  flushInterval: 0,  // No batching delay
});
```

### Provider

```typescript
// src/provider.tsx ("use client")
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";

export function AnalyticsProvider({ children }) {
  return (
    <>
      {children}
      <VercelAnalytics />
      {env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </>
  );
}
```

## Environment Variables

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...          # Required (starts with phc_)
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # Required
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...      # Optional (starts with G-)
```

## Dependencies

```json
{
  "posthog-js": "^1.359.1",
  "posthog-node": "^5.28.0",
  "@vercel/analytics": "^1.6.1",
  "@next/third-parties": "16.1.6"
}
```

## Related

- [App (Dashboard)](/apps/app) - Uses analytics provider
- [Observability Package](/packages/observability) - Logging complement to analytics
