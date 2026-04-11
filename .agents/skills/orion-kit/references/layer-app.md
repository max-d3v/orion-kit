# Layer 7: App

**App:** `apps/app` (Next.js App Router)
**Purpose:** UI layer. Server Components prefetch data; Client Components
consume it via TanStack Query. Feature components are organized by entity in
`apps/app/components/<entity>/`.

## Page Structure

Source: `apps/app/app/dashboard/tasks/page.tsx`

```tsx
// apps/app/app/dashboard/<entity>s/page.tsx
import { getQueryClient, HydrateClient } from "@workspace/data-layer/hydration";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";
import { Suspense } from "react";
import { Create<Entity>Dialog } from "@/components/<entity>s/create-<entity>-dialog";
import { Edit<Entity>Sheet }    from "@/components/<entity>s/edit-<entity>-sheet";
import { <Entity>sContent }     from "@/components/<entity>s/<entity>s-content";
import { <Entity>sLoading }     from "@/components/<entity>s/<entity>s-loading";
import { <Entity>sProvider }    from "@/components/<entity>s/context";

const ENTITY_REFETCH_INTERVAL = 10_000;

export default async function <Entity>sPage() {
  const queryClient = getQueryClient();

  // Fire-and-forget — never await here
  void queryClient.prefetchQuery(
    orpc.<entity>s.list.queryOptions({
      refetchInterval: ENTITY_REFETCH_INTERVAL,
    })
  );

  return (
    // Provider wraps EVERYTHING — including elements outside Suspense
    <EntityProvider>
      <div className="flex flex-1 flex-col gap-6 p-6">

        {/* Header renders immediately — NOT inside Suspense */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl"><Entity>s</h1>
            <p className="text-muted-foreground">Manage your <entity>s</p>
          </div>
          <Create<Entity>Dialog />
        </div>

        {/* Only the content + HydrateClient are inside Suspense */}
        <Suspense fallback={<<Entity>sLoading />}>
          <HydrateClient client={queryClient}>
            <<Entity>sContent />
          </HydrateClient>
        </Suspense>

        {/* Pagination renders outside Suspense (reads from context) */}
        <div className="flex items-center justify-between">
          <<Entity>sPerPage />
          <<Entity>sPagination />
        </div>

        {/* Edit sheet also outside Suspense — renders when selectedEntity is set */}
        <Edit<Entity>Sheet />
      </div>
    </EntityProvider>
  );
}
```

## Component Folder Structure

```
apps/app/components/<entity>s/
├── context.tsx              ← UI state (dialogs, selected item, pagination)
├── mutations.ts             ← mutation factory functions (update, delete)
├── <entity>s-content.tsx    ← "use client", useSuspenseQuery, main display
├── <entity>s-loading.tsx    ← skeleton fallback for Suspense
├── <entity>s-stats.tsx      ← summary counts (optional)
├── <entity>s-filters.tsx    ← search/filter controls (optional)
├── <entity>s-table.tsx      ← table/list component
├── create-<entity>-dialog.tsx  ← form dialog for creation
└── edit-<entity>-sheet.tsx     ← form sheet for editing
```

## Context File

Source: `apps/app/components/tasks/context.tsx`

```tsx
// apps/app/components/<entity>s/context.tsx
"use client";

import { createContext, useContext, useState } from "react";
import type { Entity } from "@workspace/types/use-cases/<entity>";

interface <Entity>sContextValue {
  isCreateDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  selectedEntity: Entity | null;
  setSelectedEntity: (e: Entity | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (n: number) => void;
}

const <Entity>sContext = createContext<<Entity>sContextValue | null>(null);

export function use<Entity>sContext() {
  const context = useContext(<Entity>sContext);
  if (!context) throw new Error("use<Entity>sContext must be used within <Entity>sProvider");
  return context;
}

export function <Entity>sProvider({ children }: { children: React.ReactNode }) {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPageRaw] = useState(10);

  const setItemsPerPage = (n: number) => {
    setItemsPerPageRaw(n);
    setCurrentPage(1);   // reset to page 1 when page size changes
  };

  return (
    <<Entity>sContext.Provider
      value={{ isCreateDialogOpen, setCreateDialogOpen, selectedEntity, setSelectedEntity,
               currentPage, setCurrentPage, totalPages, setTotalPages, itemsPerPage, setItemsPerPage }}
    >
      {children}
    </<Entity>sContext.Provider>
  );
}
```

## Content Component

Source: `apps/app/components/tasks/tasks-content.tsx`

```tsx
// apps/app/components/<entity>s/<entity>s-content.tsx
"use client";

import { orpc } from "@workspace/data-layer/orpc-tanstack-util";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { updateEntity } from "@/components/<entity>s/mutations";
import { use<Entity>sContext } from "./context";

export function <Entity>sContent() {
  const queryClient = useQueryClient();
  const { currentPage, itemsPerPage, setTotalPages } = use<Entity>sContext();

  // useSuspenseQuery — always use this, never useQuery, inside a Suspense boundary
  const { data } = useSuspenseQuery(orpc.<entity>s.list.queryOptions());
  const { mutateAsync } = useMutation(updateEntity(queryClient));

  const entities = data ?? [];

  // Client-side filtering and pagination (server-fetches all, client filters)
  const filtered = entities.filter(/* ...filter logic... */);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      {/* render paginated items */}
    </>
  );
}
```

## Dialog / Form Pattern

Source: `apps/app/components/tasks/create-task-dialog.tsx`

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { create<Entity>InputSchema } from "@workspace/types/use-cases/<entity>";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@workspace/ui/components/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEntity } from "@/components/<entity>s/mutations";
import { use<Entity>sContext } from "./context";

export function Create<Entity>Dialog() {
  const queryClient = useQueryClient();
  const { isCreateDialogOpen, setCreateDialogOpen } = use<Entity>sContext();
  const { mutateAsync, isPending } = useMutation(createEntity(queryClient));

  const form = useForm({
    resolver: zodResolver(create<Entity>InputSchema),
    defaultValues: { title: "", description: "" },
  });

  const handleSubmit = async (data) => {
    await mutateAsync(data);
    form.reset();
    setCreateDialogOpen(false);
  };

  return (
    <Dialog onOpenChange={setCreateDialogOpen} open={isCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>New <Entity></Button>
      </DialogTrigger>
      <DialogContent>
        {/* form fields using form.register("fieldName") */}
        <Button disabled={isPending} onClick={form.handleSubmit(handleSubmit)}>
          {isPending ? "Creating..." : "Create <Entity>"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```

## Key Conventions

- **Form validation:** always `zodResolver(schema)` from `react-hook-form` — never manual validation
- **Form schema source:** use-case schemas (`@workspace/types/use-cases/<entity>`), not repository schemas
- **`isPending`** for loading state on the button, not `isLoading`
- **Dialog open state** lives in context, not local state — so the trigger and content can be in separate components
- **`toast.success`** (sonner) in `onSuccess` of mutations — not inline in the component
