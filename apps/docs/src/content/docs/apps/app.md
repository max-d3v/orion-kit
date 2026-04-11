---
title: App (Dashboard)
description: Main user-facing dashboard with tasks, billing, analytics, and settings
---

:::caution[Current State]
The dashboard app is in active migration. Some pages (dashboard, tasks) use the current architecture with server-side prefetching and oRPC. Other pages still have older patterns with client-only hooks. The patterns documented here reflect the target architecture as implemented in the dashboard and tasks pages.
:::

**Framework:** Next.js (App Router)
**Port:** 3001
**Auth:** Clerk (via `@workspace/auth`)
**Data:** oRPC client + TanStack Query
**Styling:** Tailwind CSS v4 + shadcn/ui

## Technology

- **Next.js** with App Router and React 19
- **oRPC** for type-safe RPC calls to the API
- **TanStack Query** (React Query) for server state and caching
- **Clerk** for authentication (sign-in, sign-up, session management)
- **React Hook Form** + Zod for form handling and validation
- **shadcn/ui** components with Radix UI primitives
- **Sonner** for toast notifications

## Data Layer

The app uses a **server-first data pattern**: server components prefetch data into the TanStack Query cache, then client components hydrate from that cache. This means pages render with data already available -- no loading spinners on initial load.

### Server Layer (Prefetch + Static Shell)

Server components fetch data and pass it to the client via `HydrateClient`:

```typescript
// app/dashboard/tasks/page.tsx (Server Component)
import { getQueryClient, HydrateClient } from "@workspace/data-layer/hydration";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";

export default async function TasksPage() {
  const queryClient = getQueryClient();

  // Prefetch on the server -- no HTTP call, runs directly
  void queryClient.prefetchQuery(
    orpc.tasks.getUserTasksWithCount.queryOptions()
  );

  return (
    <HydrateClient>
      <TasksContent />
    </HydrateClient>
  );
}
```

How this works:
1. `getQueryClient()` uses React's `cache()` to create a per-request QueryClient
2. `orpc.tasks.getUserTasksWithCount.queryOptions()` generates the query config from the oRPC router
3. `prefetchQuery` runs the query on the server using the oRPC server client (no HTTP, direct function call)
4. `HydrateClient` serializes the QueryClient state into the HTML via `HydrationBoundary`
5. The client picks up the prefetched data without any loading state

### Client Layer (Hydration + Mutations)

Client components consume the prefetched data and handle mutations:

```typescript
// components/tasks/tasks-content.tsx ("use client")
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";

export function TasksContent() {
  const queryClient = useQueryClient();

  // Data is already in the cache from server prefetch
  const { data: tasksData } = useSuspenseQuery(
    orpc.tasks.getUserTasksWithCount.queryOptions()
  );

  // Mutations invalidate the cache to refetch
  const { mutateAsync: createTask } = useMutation(
    createTaskMutation(queryClient)
  );

  // Client-side filtering and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    return tasksData.tasks.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()))
        return false;
      return true;
    });
  }, [tasksData.tasks, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <TasksStats data={tasksData} />
      <TasksFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <TasksTable tasks={filteredTasks} />
    </div>
  );
}
```

### Mutation Pattern

Mutations are defined in a separate file with cache invalidation:

```typescript
// components/tasks/mutations.ts
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";
import type { QueryClient } from "@tanstack/react-query";

export const createTaskMutation = (queryClient: QueryClient) =>
  orpc.tasks.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.tasks.getUserTasksWithCount.queryOptions().queryKey,
      });
    },
  });

export const updateTaskMutation = (queryClient: QueryClient) =>
  orpc.tasks.update.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.tasks.getUserTasksWithCount.queryOptions().queryKey,
      });
    },
  });
```

### QueryClient Configuration

The QueryClient is configured for oRPC compatibility:

```typescript
// @workspace/data-layer/src/query-client.ts
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 60 seconds before refetch
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        serializeData: serializer.serialize,
      },
      hydrate: {
        deserializeData: serializer.deserialize,
      },
    },
    queryKeyHashFn: (queryKey) => {
      return JSON.stringify(queryKey, (_, value) => {
        return serializer.serialize(value);
      });
    },
  });
```

## Structure

```
apps/app/
├── app/
│   ├── layout.tsx                    # Root layout (providers, fonts, globals)
│   ├── providers.tsx                 # "use client" - QueryClient, Auth, Themes
│   ├── page.tsx                      # Welcome/landing with sign-in links
│   ├── login/page.tsx                # Clerk SignIn component
│   ├── signup/page.tsx               # Clerk SignUp component
│   └── dashboard/
│       ├── layout.tsx                # Dashboard shell (sidebar + header)
│       ├── page.tsx                  # Dashboard home (server prefetch)
│       ├── tasks/page.tsx            # Tasks page (server prefetch)
│       ├── analytics/page.tsx        # Analytics page
│       ├── billing/page.tsx          # Billing page
│       └── settings/page.tsx         # Settings page
├── components/
│   ├── dashboard/
│   │   ├── dashboard-server.tsx      # Server: prefetches + renders stats
│   │   ├── dashboard-layout-client.tsx # Client: sidebar layout shell
│   │   ├── dashboard-stats.tsx       # Client: task count cards
│   │   ├── dashboard-tasks-preview.tsx # Client: recent tasks list
│   │   ├── app-sidebar.tsx           # Client: navigation sidebar
│   │   └── dashboard-header.tsx      # Client: breadcrumbs + theme toggle
│   ├── tasks/
│   │   ├── tasks-content.tsx         # Client: main tasks UI
│   │   ├── context.tsx               # Client: pagination/modal context
│   │   ├── create-task-dialog.tsx    # Client: task creation form
│   │   ├── edit-task-sheet.tsx       # Client: task editing sheet
│   │   ├── mutations.ts             # Mutation definitions
│   │   ├── tasks-table.tsx           # Client: data table
│   │   ├── tasks-pagination.tsx      # Client: pagination controls
│   │   └── tasks-filters.tsx         # Client: search + status filters
│   ├── analytics/                    # Analytics feature components
│   ├── billing/                      # Billing feature components
│   └── settings/                     # Settings feature components
├── hooks/
│   └── use-tasks.ts                  # Legacy hooks (being replaced by oRPC)
├── lib/
│   ├── api/                          # Legacy API client (being replaced)
│   └── errors.ts                     # Error handling utilities
├── instrumentation.ts                # Registers oRPC server on nodejs runtime
├── proxy.ts                          # Clerk middleware for /dashboard, /rpc
└── keys.ts                           # t3-env client env validation
```

### Feature-Based Component Organization

Components are grouped by feature, not by type. Each feature folder contains all the components needed for that page:

```
components/tasks/
├── tasks-content.tsx       # Main orchestrator component
├── context.tsx             # Feature-specific React context
├── mutations.ts            # TanStack Query mutations
├── create-task-dialog.tsx  # Create form
├── edit-task-sheet.tsx     # Edit form
├── tasks-table.tsx         # Data display
├── tasks-filters.tsx       # Filtering UI
└── tasks-pagination.tsx    # Pagination UI
```

## Authentication Flow

1. Clerk middleware in `proxy.ts` protects `/dashboard/*` and `/rpc/*` routes
2. Unauthenticated users are redirected to `/login`
3. The Clerk `SignIn` and `SignUp` components handle the auth UI
4. After sign-in, Clerk sets a session cookie
5. Server components access the session via `auth()` from `@workspace/auth/server`
6. oRPC auth middleware extracts `userId` from the Clerk session for every RPC call

## Providers

The root providers wrap the entire app:

```typescript
// app/providers.tsx ("use client")
export function Providers({ children }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
```

- **AuthProvider** - Clerk session provider with theme support
- **QueryClientProvider** - TanStack Query with oRPC-compatible serialization
- **ThemeProvider** - next-themes for dark/light mode
- **AnalyticsProvider** - PostHog + Vercel Analytics

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_AXIOM_TOKEN=xaat_...
NEXT_PUBLIC_AXIOM_DATASET=orion-kit
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## Related

- [API Application](/apps/api) - The oRPC server this app talks to
- [Data Layer Package](/packages/data-layer) - QueryClient and hydration
- [RPC Package](/packages/rpc) - Procedure definitions
- [Clean Architecture](/architecture/clean-architecture) - Layer responsibilities
