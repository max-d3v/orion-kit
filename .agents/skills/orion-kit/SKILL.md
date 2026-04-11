---
name: orion-kit
description: >
  Use this skill when adding a new feature, entity, or CRUD resource to this
  monorepo. Also use it when working in any of these directories or files:
  packages/database, packages/types, packages/repository, packages/core,
  packages/rpc, packages/data-layer, apps/app/components/*/mutations.ts,
  apps/app/app/dashboard/*/page.tsx. Covers the full 7-layer clean architecture
  (Database → Types → Repository → Core → RPC → Data Layer → App), oRPC router
  authoring, server prefetch + client hydration, mutation patterns,
  authorization, and import/export boundary rules.
---

# Orion Kit — Architecture & Feature Scaffolding

## Architecture Overview

This monorepo uses a strict 7-layer clean architecture. Data flows in one
direction; each layer only imports from the layers below it.

```
┌─────────────────────────────────────────────────────────┐
│  Layer          │  Package                  │  Purpose  │
├─────────────────┼───────────────────────────┼───────────┤
│  1. Database    │  @workspace/database      │  Schema,  │
│                 │                           │  client,  │
│                 │                           │  Drizzle  │
├─────────────────┼───────────────────────────┼───────────┤
│  2. Types       │  @workspace/types         │  Zod      │
│                 │                           │  schemas, │
│                 │                           │  TS types │
├─────────────────┼───────────────────────────┼───────────┤
│  3. Repository  │  @workspace/repository    │  Raw DB   │
│                 │                           │  access,  │
│                 │                           │  no auth  │
├─────────────────┼───────────────────────────┼───────────┤
│  4. Core        │  @workspace/core          │  Use      │
│                 │                           │  cases +  │
│                 │                           │  authz    │
├─────────────────┼───────────────────────────┼───────────┤
│  5. RPC         │  @workspace/rpc           │  oRPC     │
│                 │                           │  routers  │
│                 │                           │  (HTTP)   │
├─────────────────┼───────────────────────────┼───────────┤
│  6. Data Layer  │  @workspace/data-layer    │  TanStack │
│                 │                           │  Query +  │
│                 │                           │  oRPC     │
├─────────────────┼───────────────────────────┼───────────┤
│  7. App         │  apps/app                 │  Next.js  │
│                 │                           │  pages +  │
│                 │                           │  UI       │
└─────────────────┴───────────────────────────┴───────────┘
```

**Dependency arrows (allowed imports):**

```
App → data-layer, ui, types
Data Layer → rpc (for router type only)
RPC → core/use-cases
Core → repository/entities, types
Repository → database, types
Database → (external: drizzle-orm, @neondatabase/serverless)
Types → database (for drizzle-zod inference)
```

**Apps never import from repository or core directly.** All server-side
business logic reaches the client via oRPC through `@workspace/data-layer`.

---

## Decision Tree

| Question | Action |
|---|---|
| Adding a new entity (full CRUD)? | Follow → `references/scaffolding-checklist.md` (all 10 steps) |
| Adding a field to an existing entity? | See **Adding a Field** below |
| Understanding a specific layer? | See `references/layer-<name>.md` |
| Writing a new page in `apps/app`? | See `references/layer-app.md` |
| Writing a mutation component? | See **Mutations Pattern** in this file |
| Unsure what imports to use? | See **Import Boundaries** in this file |

### Adding a Field (4 steps)

1. **Database** — add column to table in `packages/database/src/schema.ts`, run `bun db:generate && bun db:migrate`
2. **Types** — `createInsertSchema`/`createUpdateSchema` auto-pick up new columns; add it to the use-case Zod schema in `packages/types/src/use-cases/<entity>.ts` if it should be user-editable
3. **Repository** — no changes needed unless the field requires special query logic
4. **App** — update form components and display components in `apps/app/components/<entity>/`

---

## Critical Conventions

### Import Boundaries

```
# ALLOWED
apps/app → @workspace/data-layer/hydration
apps/app → @workspace/data-layer/orpc-tanstack-util
apps/app → @workspace/data-layer/client
apps/app → @workspace/ui/components/*
apps/app → @workspace/types/use-cases/*

# FORBIDDEN — will break the architecture
apps/app → @workspace/repository      ❌
apps/app → @workspace/core            ❌
apps/app → @workspace/database        ❌
packages/core → @workspace/rpc        ❌
packages/repository → @workspace/core ❌
```

### Export Patterns

All packages use **wildcard path exports**, not barrel files:

```json
// packages/repository/package.json
"exports": {
  "./entities/*": "./src/entities/*.ts"
}

// packages/core/package.json
"exports": {
  "./use-cases/*": "./src/use-cases/*.ts"
}

// packages/types/package.json
"exports": {
  "./repository/*": "./src/repository/*.ts",
  "./use-cases/*":  "./src/use-cases/*.ts",
  "./errors/*":     "./src/errors/*.ts"
}
```

Do **not** create `index.ts` barrel files in these packages.

### No `loading.tsx` Rule

Never create `loading.tsx` files. Use explicit `<Suspense>` boundaries with
fallback components instead. Loading boundaries assume all page data is a
blocker — that's never true here.

```tsx
// ✅ CORRECT — explicit Suspense, header renders immediately
export default async function NotesPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(orpc.notes.list.queryOptions());

  return (
    <NotesProvider>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-3xl">Notes</h1>
          <CreateNoteDialog />
        </div>
        <Suspense fallback={<NotesLoading />}>
          <HydrateClient client={queryClient}>
            <NotesContent />
          </HydrateClient>
        </Suspense>
      </div>
    </NotesProvider>
  );
}

// ❌ WRONG — no loading.tsx, no wrapping entire page in Suspense
```

### Server Prefetch Pattern

Pages are **async Server Components** that prefetch data on the server, then
pass the pre-populated query client to the client via `HydrateClient`.

```tsx
// apps/app/app/dashboard/<entity>/page.tsx
import { getQueryClient, HydrateClient } from "@workspace/data-layer/hydration";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";
import { Suspense } from "react";

export default async function EntityPage() {
  const queryClient = getQueryClient();

  // void = fire-and-forget. Do NOT await. React streams the shell immediately.
  void queryClient.prefetchQuery(
    orpc.<entity>.list.queryOptions()
  );

  return (
    <EntityProvider>
      <Suspense fallback={<EntityLoading />}>
        <HydrateClient client={queryClient}>
          <EntityContent />
        </HydrateClient>
      </Suspense>
    </EntityProvider>
  );
}
```

Key details:
- `getQueryClient()` returns a **per-request** query client (not the browser singleton)
- `void` the prefetch — don't await it; the client will deduplicate
- `HydrateClient` takes `client={queryClient}` (not `queryClient={queryClient}`)
- `<Suspense>` wraps only `<HydrateClient>` + content; UI outside Suspense renders without waiting

### Client Data Pattern

Inside a `"use client"` component under a `<Suspense>` boundary, always use
`useSuspenseQuery`. Never use plain `useQuery` — it won't suspend and you'll
get undefined data before the query settles.

```tsx
"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";

export function EntityContent() {
  const { data } = useSuspenseQuery(orpc.<entity>.list.queryOptions());
  // data is guaranteed non-null here
}
```

### Mutations Pattern

Mutations live in `apps/app/components/<entity>/mutations.ts`. Each export is
a **factory function** that takes `QueryClient` and returns `mutationOptions`.
This keeps mutation logic out of components and makes invalidation explicit.

```ts
// apps/app/components/<entity>/mutations.ts
"use client";

import type { QueryClient } from "@tanstack/react-query";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";
import { toast } from "sonner";

export function updateEntity(queryClient: QueryClient) {
  return orpc.<entity>.update.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.<entity>.list.key(),    // ← .key(), NOT .queryOptions().queryKey
      });
      toast.success("Updated successfully!");
    },
  });
}
```

Consume in a component:

```tsx
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEntity } from "@/components/<entity>/mutations";

export function EntityRow() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(updateEntity(queryClient));
  // ...
}
```

### Context Pattern

UI state (dialog open/close, selected item, pagination) lives in a React
context file at `apps/app/components/<entity>/context.tsx`. Data state (the
actual records) lives in TanStack Query — never mix them.

```tsx
// apps/app/components/<entity>/context.tsx
"use client";
import { createContext, useContext, useState } from "react";

interface EntityContextValue {
  isCreateDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  selectedEntity: Entity | null;
  setSelectedEntity: (e: Entity | null) => void;
}

const EntityContext = createContext<EntityContextValue | null>(null);

export function useEntityContext() {
  const context = useContext(EntityContext);
  if (!context) throw new Error("useEntityContext must be used within EntityProvider");
  return context;
}

export function EntityProvider({ children }: { children: React.ReactNode }) {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  return (
    <EntityContext.Provider value={{ isCreateDialogOpen, setCreateDialogOpen, selectedEntity, setSelectedEntity }}>
      {children}
    </EntityContext.Provider>
  );
}
```

`<EntityProvider>` wraps the entire page (not just the content component) so
that dialogs outside `<Suspense>` can access context too.

### Authorization Pattern

Authorization lives in `packages/core/src/authorization/<entity>.ts` and is
called **inside use cases**, never in RPC handlers or the repository.

```ts
// packages/core/src/authorization/<entity>.ts
import { HttpError } from "@workspace/types/errors/http";
import type { EntityRawObject } from "@workspace/types/repository/<entity>";

export const assertEntityOwnership = (
  entity: EntityRawObject,
  userId: string
): void => {
  if (entity.userId !== userId) {
    throw new HttpError(403, "Forbidden");
  }
};
```

Authorization files are **not exported** from the core package — they are
only imported with relative paths from within `packages/core/src/use-cases/`.

### RPC Router Pattern

```ts
// packages/rpc/src/routers/<entity>.ts
import { create<Entity>, update<Entity>, delete<Entity> } from "@workspace/core/use-cases/<entity>";
import { create<Entity>InputSchema, update<Entity>InputSchema } from "@workspace/types/use-cases/<entity>";
import { authenticatedProcedure } from "../base";

const <entity>Router = {
  list: authenticatedProcedure.handler(async ({ context }) => {
    return await get<Entity>s({ userId: context.user.id });
  }),
  create: authenticatedProcedure
    .input(create<Entity>InputSchema)
    .handler(async ({ context, input }) => {
      return await create<Entity>({ userId: context.user.id, ...input });
    }),
  update: authenticatedProcedure
    .input(update<Entity>InputSchema)
    .handler(async ({ context, input }) => {
      const { id, ...data } = input;
      return await update<Entity>({ userId: context.user.id, entityId: id, data });
    }),
  delete: authenticatedProcedure
    .input(delete<Entity>InputSchema)
    .handler(async ({ context, input }) => {
      return await delete<Entity>({ userId: context.user.id, entityId: input.id });
    }),
};

export default <entity>Router;   // ← MUST be export default, not named export
```

After creating the router file, register it in `packages/rpc/src/index.ts`:

```ts
import <entity>Router from "./routers/<entity>";

export const router = {
  // ...existing routers
  <entity>s: <entity>Router,
};
```

---

## Scaffolding Quick Reference

When adding a new entity, complete these 10 steps **in order**. Each step
depends on the one above it. Full code templates are in
`references/scaffolding-checklist.md`.

| # | Layer | File(s) | Key action |
|---|---|---|---|
| 1 | Database | `packages/database/src/schema.ts` | Add table + optional enum |
| 2 | Database | Terminal | `bun db:generate && bun db:migrate` |
| 3 | Types/Repo | `packages/types/src/repository/<entity>.ts` | drizzle-zod schemas + `$inferSelect` type |
| 4 | Types/UC | `packages/types/src/use-cases/<entity>.ts` | User-facing Zod schemas (stricter) |
| 5 | Repository | `packages/repository/src/entities/<entity>.ts` | `list`, `get`, `create`, `updateOne`, `deleteOne` |
| 6 | Core/Authz | `packages/core/src/authorization/<entity>.ts` | `assert<Entity>Ownership` |
| 7 | Core/UC | `packages/core/src/use-cases/<entity>.ts` | Business logic, compose authz + repository |
| 8 | RPC | `packages/rpc/src/routers/<entity>.ts` | `authenticatedProcedure` router, `export default` |
| 9 | RPC | `packages/rpc/src/index.ts` | Register router in aggregation object |
| 10 | App | `apps/app/app/dashboard/<entity>s/page.tsx` | Server prefetch page |
| 11 | App | `apps/app/components/<entity>s/` | context, mutations, content, dialogs |

---

## Anti-Patterns

### ❌ Creating `loading.tsx`
Use explicit `<Suspense fallback={<XLoading />}>` instead. `loading.tsx` is a
Next.js convention that wraps the entire segment — that's too coarse.

### ❌ Importing repository or core from the app
```ts
// FORBIDDEN
import { list } from "@workspace/repository/entities/notes"; // ❌
import { getUserNotes } from "@workspace/core/use-cases/notes"; // ❌
```
All data access flows through `@workspace/data-layer/orpc-tanstack-util`.

### ❌ Putting authorization in RPC handlers
```ts
// WRONG — auth check in RPC layer
handler(async ({ context, input }) => {
  if (entity.userId !== context.user.id) throw new Error("Forbidden"); // ❌
})
```
Authorization belongs in `packages/core/src/authorization/`.

### ❌ Using `useQuery` instead of `useSuspenseQuery`
```tsx
const { data } = useQuery(orpc.notes.list.queryOptions()); // ❌ data may be undefined
const { data } = useSuspenseQuery(orpc.notes.list.queryOptions()); // ✅ always defined
```

### ❌ Creating barrel files
```ts
// packages/repository/src/entities/index.ts  ← DO NOT CREATE
export * from "./notes";
export * from "./tasks";
```
The wildcard path exports in `package.json` handle this already.

### ❌ Inlining mutations in components
```tsx
// WRONG — mutation config defined inline
const { mutate } = useMutation({
  mutationFn: (data) => client.notes.create(data), // ❌
});
```
Put mutations in `components/<entity>/mutations.ts` so they can be reused and
tested independently.

### ❌ Named export from router files
```ts
export const notesRouter = { ... }; // ❌
export default notesRouter;         // ✅
```

### ❌ Using `.queryOptions().queryKey` for invalidation
```ts
// WRONG
queryClient.invalidateQueries({ queryKey: orpc.notes.list.queryOptions().queryKey }); // ❌
// CORRECT
queryClient.invalidateQueries({ queryKey: orpc.notes.list.key() }); // ✅
```

---

## Reference Files

For detailed layer-specific patterns with full code examples:

- `references/layer-database.md` — schema, enums, migration workflow
- `references/layer-types.md` — drizzle-zod, use-case schemas, type exports
- `references/layer-repository.md` — CRUD functions, `buildSearchClause`, `HttpError`
- `references/layer-core.md` — use cases, authorization, composition
- `references/layer-rpc.md` — procedures, middleware, router registration
- `references/layer-data-layer.md` — query client, hydration, `orpc` util
- `references/layer-app.md` — page structure, context, content, dialogs
- `references/scaffolding-checklist.md` — full code templates for all 10 steps
