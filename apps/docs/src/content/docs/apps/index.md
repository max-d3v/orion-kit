---
title: Applications
description: Overview of all apps in the monorepo, their technologies, data layers, and structure
---

:::tip[TL;DR]
Five apps, each with a clear purpose. The dashboard app uses Next.js with oRPC + TanStack Query for data. The API app serves oRPC procedures with Clerk auth. Web is a static landing page. Studio runs Drizzle Studio. Docs uses Astro Starlight.
:::

## Apps at a Glance

| App | Purpose | Technology | Port | Data Layer |
| --- | ------- | ---------- | ---- | ---------- |
| [**app**](/apps/app) | User dashboard | Next.js + TanStack Query | 3001 | Server prefetch + client hydration via oRPC |
| [**api**](/apps/api) | oRPC server | Next.js + oRPC handler | 3002 | Serves RPC procedures with Clerk auth |
| [**web**](/apps/web) | Marketing site | Next.js (static) | 3000 | None (static content) |
| [**studio**](/apps/studio) | Database browser | Drizzle Studio | 3003 | Direct database connection |
| [**docs**](/apps/docs) | Documentation | Astro + Starlight | 3004 | None (static content) |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         APPLICATIONS                            │
├──────────┬──────────┬──────────┬──────────┬─────────────────────┤
│   web    │   app    │   api    │  studio  │       docs          │
│  :3000   │  :3001   │  :3002   │  :3003   │      :3004          │
│          │          │          │          │                     │
│ Landing  │Dashboard │  oRPC    │ Drizzle  │  Astro              │
│ page     │ + Tasks  │  Server  │ Studio   │  Starlight          │
│          │          │          │          │                     │
│ Static   │ oRPC     │ Clerk    │ Direct   │  Static             │
│ content  │ client   │ auth     │ DB conn  │  HTML               │
└──────────┴────┬─────┴────┬─────┴──────────┴─────────────────────┘
                │          │
                │  oRPC    │
                └────┬─────┘
                     │
        ┌────────────▼────────────────────┐
        │        SHARED PACKAGES          │
        │                                 │
        │  rpc    core    repository      │
        │  data-layer  auth  database     │
        │  types  ui    payment  email    │
        │  analytics  observability  jobs │
        └────────────┬────────────────────┘
                     │
        ┌────────────▼────────────────────┐
        │       EXTERNAL SERVICES         │
        │                                 │
        │  Clerk     Neon     PostHog     │
        │  Stripe    Axiom    Resend      │
        │  Trigger.dev       Vercel       │
        └─────────────────────────────────┘
```

## Data Flow

The dashboard app (`apps/app`) communicates with the API app (`apps/api`) exclusively through oRPC. The flow is:

```
Server Component (page.tsx)
  └─> getQueryClient().prefetchQuery(orpc.tasks...queryOptions())
      └─> oRPC server client (runs on the server, no HTTP)
          └─> RPC procedure -> Core use case -> Repository -> Database

  └─> <HydrateClient>
        └─> Client Component (tasks-content.tsx)
            └─> useSuspenseQuery(orpc.tasks...queryOptions())
                └─> Data already in cache from server prefetch
                └─> Subsequent fetches go through oRPC browser client
                    └─> HTTP POST /rpc -> API app -> same flow
```

## The No-Loading-Boundary Rule

:::caution[Architecture Rule]
Every page renders in a static shell first, then triggers data fetches. Never use Next.js `loading.tsx` files. A loading boundary assumes the page has blockers, which means the user sees nothing until data arrives. Instead, use explicit `<Suspense>` boundaries around specific data-dependent sections.
:::

The correct pattern:

```typescript
// app/dashboard/tasks/page.tsx (Server Component)
export default async function TasksPage() {
  const queryClient = getQueryClient();

  // Prefetch data on the server (non-blocking)
  void queryClient.prefetchQuery(
    orpc.tasks.getUserTasksWithCount.queryOptions()
  );

  // Return the shell immediately with hydrated data
  return (
    <HydrateClient>
      <Suspense fallback={<TasksSkeleton />}>
        <TasksContent />
      </Suspense>
    </HydrateClient>
  );
}
```

What this achieves:
- The page shell renders instantly (layout, sidebar, header)
- Data is prefetched on the server and serialized into the HTML
- The client component picks up the prefetched data without a loading state
- If the prefetch is slow, only the specific `<Suspense>` boundary shows a skeleton
- The rest of the page remains interactive

What to avoid:

```typescript
// app/dashboard/tasks/loading.tsx
// DO NOT CREATE THIS FILE
// It blocks the entire page until data loads
export default function Loading() {
  return <FullPageSpinner />;
}
```

## Port Configuration

| App | Development | Production |
| --- | ----------- | ---------- |
| **web** | `localhost:3000` | `orion-kit-web.vercel.app` |
| **app** | `localhost:3001` | `orion-kit-app.vercel.app` |
| **api** | `localhost:3002` | `orion-kit-api.vercel.app` |
| **studio** | `local.drizzle.studio?port=3003` | Local only |
| **docs** | `localhost:3004` | `orion-kit-docs.vercel.app` |

## Development

```bash
# Start all apps
bun dev

# Start individual apps
bun dev --filter app
bun dev --filter api
bun dev --filter web
bun dev --filter docs
bun db:studio
```

## Related

- [App (Dashboard)](/apps/app) - Dashboard architecture and data patterns
- [API (oRPC Server)](/apps/api) - oRPC handler and Clerk middleware
- [Clean Architecture](/architecture/clean-architecture) - Package layer design
