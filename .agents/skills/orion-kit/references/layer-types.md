# Layer 2: Types

**Package:** `@workspace/types`
**Purpose:** Shared TypeScript types and Zod schemas. Split into two
sub-namespaces: `repository` (DB-level, auto-generated) and `use-cases`
(user-facing, hand-crafted with business rules).

## Exports

```json
"./repository/*"  → src/repository/*.ts   (drizzle-zod schemas, raw DB types)
"./use-cases/*"   → src/use-cases/*.ts    (user-facing Zod schemas)
"./errors/*"      → src/errors/*.ts       (HttpError class)
```

## Repository Types Pattern

Source: `packages/types/src/repository/tasks.ts`

```ts
import { createInsertSchema, createUpdateSchema } from "@workspace/database/drizzle-zod";
import { tasks } from "@workspace/database/schema";
import { z } from "zod";
import { listBaseParamsSchema } from "./base";   // pageNum, pageSize, search

// Auto-generated from Drizzle table — no manual column listing needed
export const createTaskInputSchema = createInsertSchema(tasks);
export const updateTaskInputSchema = createUpdateSchema(tasks).extend({
  id: z.string().uuid(),   // updateSchema doesn't include PK by default
});
export const getTaskInputSchema = z.object({ id: z.string() });
export const listTasksParamsSchema = listBaseParamsSchema.extend({
  userId: z.string(),
});
export const deleteTaskParamsSchema = z.object({ id: z.string() });

// The canonical raw type — mirrors the DB row exactly
export type TaskRawObject = typeof tasks.$inferSelect;

// Derived param types for function signatures in repository
export type CreateTaskParams = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskParams = z.infer<typeof updateTaskInputSchema>;
export type GetTaskParams    = z.infer<typeof getTaskInputSchema>;
export type ListTasksParams  = z.infer<typeof listTasksParamsSchema>;
export type DeleteTaskParams = z.infer<typeof deleteTaskParamsSchema>;
```

## Use Case Types Pattern

Source: `packages/types/src/use-cases/tasks.ts`

These schemas are **stricter** than repository schemas — they enforce business
rules like required fields and tighter string constraints.

```ts
import { z } from "zod";
import type { TaskRawObject } from "../repository/tasks";

// Response shapes (may differ from raw DB rows)
export type Task = TaskRawObject;   // same here, but can be a subset
export type TasksListResponse = {
  data: TaskRawObject[];
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
};

// User-facing input schemas — used in RPC routers and forms
export const createTaskInputSchema = z.object({
  title: z.string().min(1),                // stricter than DB (which allows any varchar)
  description: z.string().nullable().optional(),
});

export const updateTaskInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["todo", "in-progress", "completed", "cancelled"]).optional(),
  dueDate: z.coerce.date().nullable().optional(),
  completedAt: z.coerce.date().nullable().optional(),
});

export const deleteTaskInputSchema = z.object({ id: z.string().uuid() });

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskInputSchema>;
```

## Key Conventions

- **Two schemas per entity:** one in `repository/` (DB-generated), one in `use-cases/` (hand-crafted)
- **`$inferSelect` for the raw type:** `typeof tasks.$inferSelect` gives the exact TypeScript type for a DB row
- **`updateSchema` needs `id`:** `createUpdateSchema` makes all columns optional and omits the PK — always `.extend({ id: z.string().uuid() })`
- **`listBaseParamsSchema`:** always extend it for list params: `listBaseParamsSchema.extend({ userId: z.string() })`
- **No barrel index.ts:** the wildcard exports in `package.json` handle module resolution

## `listBaseParamsSchema`

From `packages/types/src/repository/base.ts`:

```ts
export const listBaseParamsSchema = z.object({
  pageNum:  z.number().optional(),
  pageSize: z.number().optional(),
  search:   z.string().optional(),
});
```
