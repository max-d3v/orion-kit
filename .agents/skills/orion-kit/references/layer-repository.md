# Layer 3: Repository

**Package:** `@workspace/repository`
**Purpose:** Raw database access functions. One file per entity. No business
logic, no authorization — just SQL via Drizzle. Returns raw DB rows or throws
`HttpError`.

## Exports

```json
"./entities/*"  → src/entities/*.ts   (one file per entity)
```

## Full Pattern

Source: `packages/repository/src/entities/tasks.ts`

```ts
import {
  and, count, db, desc, eq, ilike, or,
} from "@workspace/database/client";
import { tasks } from "@workspace/database/schema";
import { HttpError } from "@workspace/types/errors/http";
import type {
  CreateTaskParams, DeleteTaskParams, GetTaskParams,
  ListTasksParams, TaskRawObject, UpdateTaskParams,
} from "@workspace/types/repository/tasks";

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_NUM  = 1;

// Extract search clause builder at top level — reused by list
const buildSearchClause = (search?: string) => {
  if (!search) return undefined;
  return or(
    ilike(tasks.title, `%${search}%`),
    ilike(tasks.description, `%${search}%`)
  );
};

// LIST — paginated, filterable
export const list = async (params: ListTasksParams) => {
  const {
    userId,
    search,
    pageNum  = DEFAULT_PAGE_NUM,
    pageSize = DEFAULT_PAGE_SIZE,
  } = params;

  const searchClause = buildSearchClause(search);
  const whereClause  = and(eq(tasks.userId, userId), searchClause);
  const offset       = (pageNum - 1) * pageSize;

  const [data] = await Promise.all([
    db.query.tasks.findMany({
      where: whereClause,
      orderBy: desc(tasks.createdAt),
      limit: pageSize,
      offset,
    }),
    db.select({ count: count() }).from(tasks).where(whereClause),
  ]);

  return data;
};

// GET — throws 404 if not found
export const get = async (params: GetTaskParams): Promise<TaskRawObject> => {
  const { id } = params;
  const task = await db.query.tasks.findFirst({ where: eq(tasks.id, id) });
  if (!task) throw new HttpError(404, "Task not found");
  return task;
};

// CREATE — throws 500 if insert fails
export const create = async (params: CreateTaskParams): Promise<TaskRawObject> => {
  const { userId, ...data } = params;
  const result = await db.insert(tasks).values({ ...data, userId }).returning();
  const task = result[0];
  if (!task) throw new HttpError(500, "Failed to create task");
  return task;
};

// UPDATE — throws 404 if record not found after update
export const updateOne = async (params: UpdateTaskParams): Promise<TaskRawObject> => {
  const { id, ...data } = params;
  const result = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })   // ← always set updatedAt manually
    .where(eq(tasks.id, id))
    .returning();
  const task = result[0];
  if (!task) throw new HttpError(404, "Task not found");
  return task;
};

// DELETE — throws 404 if record not found
export const deleteOne = async (params: DeleteTaskParams): Promise<TaskRawObject> => {
  const { id } = params;
  const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
  const task = result[0];
  if (!task) throw new HttpError(404, "Task not found");
  return task;
};
```

## Key Conventions

- **Function names:** `list`, `get`, `create`, `updateOne`, `deleteOne` (always these exact names)
- **Object params:** every function takes a single params object, never positional args
- **`updatedAt`:** set manually in `updateOne` — `set({ ...data, updatedAt: new Date() })`
- **`buildSearchClause`:** define as a module-level const, not inside the list function
- **`Promise.all`** for parallel queries (e.g. data + count) — never sequential awaits for independent queries
- **`HttpError` codes:** 404 for not found, 500 for failed insert, 403 is reserved for authorization (core layer)
- **No authorization here:** never check `userId` ownership in the repository. That belongs in `packages/core/src/authorization/`
- **`returning()`:** always call `.returning()` on insert/update/delete to get the affected row back

## What Goes in Repository vs Core

| Concern | Repository | Core |
|---|---|---|
| Raw SQL / Drizzle queries | ✅ | ❌ |
| Ownership checks | ❌ | ✅ |
| Business rule composition | ❌ | ✅ |
| Fetching a record before mutating it | ❌ | ✅ (use case calls `get` first) |
| Pagination / search | ✅ | ❌ |
