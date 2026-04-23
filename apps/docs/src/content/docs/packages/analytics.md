---
title: Analytics
description: PostHog product analytics, Vercel Analytics, optional Google Analytics, and a typed event/metric structure
---

The Analytics package (`@workspace/analytics`) wraps **PostHog** for product analytics, **Vercel Analytics** for performance monitoring, and optionally **Google Analytics** for traffic tracking. It also ships an opinionated, typed structure for **events**, **North Star**, **Activation**, and **Retention** metrics.

**Service:** PostHog + Vercel Analytics (+ optional Google Analytics)
**Type:** Auxiliary
**Consumed by:** Apps (`app`, `web`)

## Package Exports

```json
{
  "exports": {
    "./provider": "./src/provider.tsx",
    "./server": "./src/server.ts",
    "./client": "./src/client.ts",
    "./instrumentation-client": "./src/instrumentation-client.ts",
    "./events": "./src/structure/events.ts",
    "./keys": "./src/keys.ts"
  }
}
```

| Export | Purpose |
| ------ | ------- |
| `./provider` | `AnalyticsProvider` — Vercel Analytics + optional Google Analytics |
| `./server` | Server-only PostHog client + typed `capture()` helper (`flushAt: 1` for serverless) |
| `./client` | Browser PostHog instance (re-exported from `posthog-js`) |
| `./instrumentation-client` | `initializeAnalytics()` — wires up PostHog on the client |
| `./events` | Typed `EVENTS` registry and `Event` union |
| `./keys` | t3-env validation for PostHog + GA envs |

There is **no root (`.`) export** — import from the specific subpath you need.

## Runtime Wiring

### Client (browser)

Apps call `initializeAnalytics()` from their [`instrumentation-client.ts`](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation#instrumentation-client):

```ts
// apps/app/instrumentation-client.ts
import { initializeAnalytics } from "@workspace/analytics/instrumentation-client";

initializeAnalytics();
```

`initializeAnalytics` is a no-op when `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` are missing, so the package is safe to leave installed even before PostHog is configured.

### Provider (React tree)

```tsx
// apps/app/app/providers.tsx
import { AnalyticsProvider } from "@workspace/analytics/provider";

<AnalyticsProvider>{children}</AnalyticsProvider>;
```

Renders Vercel Analytics and — when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set — Google Analytics via `@next/third-parties/google`.

### Server

```ts
import { analytics, capture } from "@workspace/analytics/server";
import { EVENTS } from "@workspace/analytics/events";

await capture({
  event: EVENTS.task_completed,
  userId,
  details: { taskId, durationMs },
});
```

- `analytics` is `undefined` when PostHog envs are missing.
- `capture()` logs a warning and no-ops instead of throwing when analytics isn't initialized.
- `event` is typed to the `EVENTS` registry — unknown strings won't type-check.

### Client-side capture

```ts
import { analytics } from "@workspace/analytics/client";
analytics.capture("task_completed", { taskId });
```

## Event & Metric Structure

The package ships a small, opinionated structure under `src/structure/` for defining product metrics. The goal is to keep metric definitions **in code** so they stay versioned and typed, while keeping **dashboards vendor-specific** (build them in PostHog).

### Events registry

```ts
// packages/analytics/src/structure/events.ts
export const EVENTS = {
  user_created: "user_created",
  user_pageview: "user_pageview",
  task_created: "task_created",
  task_completed: "task_completed",
} as const;

export type Event = (typeof EVENTS)[keyof typeof EVENTS];
```

All server-side `capture()` calls are constrained to this union — add new events here first.

### North Star

```ts
// packages/analytics/src/structure/north-star.ts
export const NORTH_STAR_METRICS = {
  task_completed: {
    events: [EVENTS.user_created, EVENTS.task_created, EVENTS.task_completed],
  },
};
```

The **North Star Metric** is the event sequence that represents the core value your product delivers. Visualize it as a funnel to find drop-offs.

### Activation

```ts
// packages/analytics/src/structure/activation.ts
export const ACTIVATION_METRICS = {
  task_created: {
    events: [EVENTS.user_created, EVENTS.task_created],
  },
};
```

**Activation** is the first meaningful interaction — not a signup. Optionally gated by a threshold (e.g. "5 actions").

### Retention

```ts
// packages/analytics/src/structure/retention.ts
export const RETENTION_METRICS = {
  basic_retention: {
    baselineEvent: EVENTS.user_created,
    retentionEvent: EVENTS.user_pageview,
    timeframe: "daily",
  },
};
```

Defined by a **baseline event**, a **return event**, and a **timeframe** (daily / weekly / monthly).

See `packages/analytics/src/structure/philosophy.md` for the full reasoning. There is also an `analytics-tracking` skill under `.agents/skills/` that can implement these automatically once you've declared your North Star and Activation criteria.

## Naming Conventions

- Use **intent-driven** names: `ride_requested`, not `button_clicked`.
- Keep names **consistent and explicit**.
- Every tracked event should map to a **business outcome**.
- Revenue is tracked via **Stripe** — don't duplicate it in PostHog unless you need product correlation.

## Environment Variables

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...                    # Optional — starts with phc_
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # Optional — required with key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...                # Optional — starts with G-
```

All three are optional. Missing envs cause the matching integration to no-op cleanly.

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

- [App (Dashboard)](/apps/app) — uses `AnalyticsProvider` and `initializeAnalytics`
- [Observability Package](/packages/observability) — Sentry error + tracing complement to analytics
