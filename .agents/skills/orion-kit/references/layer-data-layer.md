# Layer 6: Data Layer

**Package:** `@workspace/data-layer`
**Purpose:** TanStack Query client setup and oRPC integration. The bridge
between the type-safe oRPC router and React components. Provides the typed
`orpc` client and hydration utilities.

## Exports

```json
"./client"            → src/query-client.ts      (getQueryClient)
"./hydration"         → src/hydration.tsx         (HydrateClient)
"./orpc-tanstack-util" → src/orpc-tanstack-util.ts (orpc client)
```

## `orpc` — the typed client

```ts
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";

// Every route on the router is available:
orpc.tasks.list.queryOptions()                  // → TanStack Query options object
orpc.tasks.list.queryOptions({ refetchInterval: 10_000 })  // → with extra options
orpc.tasks.update.mutationOptions({ onSuccess: () => {} }) // → mutation options
orpc.tasks.list.key()                           // → query key for invalidation
```

The `orpc` object is fully typed from the router defined in `@workspace/rpc`.
TypeScript will error if you access a route that doesn't exist.

## `getQueryClient` — server-side per-request client

```ts
import { getQueryClient } from "@workspace/data-layer/client";

// In a Server Component (page):
const queryClient = getQueryClient();
void queryClient.prefetchQuery(orpc.tasks.list.queryOptions());
```

`getQueryClient()` returns a **per-request** query client on the server (using
React's `cache()`). On the client it returns the singleton browser client.
Never instantiate `new QueryClient()` directly in pages.

## `HydrateClient` — dehydration bridge

```tsx
import { HydrateClient } from "@workspace/data-layer/hydration";

// In a Server Component page — after prefetching:
<HydrateClient client={queryClient}>
  <ClientComponent />
</HydrateClient>
```

`HydrateClient` serializes the prefetched data from the server query client
into the HTML stream. The browser TanStack Query client rehydrates from it,
so `useSuspenseQuery` on the client immediately resolves without a network
round-trip.

**Prop:** `client={queryClient}` — not `queryClient={queryClient}`.

## Key Conventions

- **`useSuspenseQuery`** inside Suspense boundaries, never plain `useQuery`
- **`useQueryClient()`** in client components to get the browser singleton
- **`orpc.*.key()`** for invalidation, not `.queryOptions().queryKey`
- **`void` the prefetch** — don't await it in pages:
  ```ts
  void queryClient.prefetchQuery(orpc.tasks.list.queryOptions());
  ```
- **Never import** `@workspace/rpc` directly in app components — always go through `@workspace/data-layer/orpc-tanstack-util`
