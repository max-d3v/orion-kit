import {
  and,
  count,
  db,
  desc,
  eq,
  ilike,
  or,
} from "@workspace/database/client";
import { tasks } from "@workspace/database/schema";
import { HttpError } from "@workspace/types/errors/http";
import type {
  CreateTaskParams,
  DeleteTaskParams,
  GetTaskParams,
  ListTasksParams,
  TaskRawObject,
  UpdateTaskParams,
} from "@workspace/types/repository/tasks";

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_NUM = 1;

type TasksFindManyConfig = NonNullable<
  Parameters<typeof db.query.tasks.findMany>[0]
>;

const buildSearchClause = (search?: string) => {
  if (!search) {
    return undefined;
  }
  return or(
    ilike(tasks.title, `%${search}%`),
    ilike(tasks.description, `%${search}%`)
  );
};

export const list = async (
  params: ListTasksParams & { with?: TasksFindManyConfig["with"] }
) => {
  const {
    userId,
    search,
    pageNum = DEFAULT_PAGE_NUM,
    pageSize = DEFAULT_PAGE_SIZE,
    with: withConfig,
  } = params;

  const searchClause = buildSearchClause(search);
  const whereClause = and(eq(tasks.userId, userId), searchClause);
  const offset = (pageNum - 1) * pageSize;

  const [data] = await Promise.all([
    db.query.tasks.findMany({
      where: whereClause,
      orderBy: desc(tasks.createdAt),
      limit: pageSize,
      offset,
      with: withConfig,
    }),
    db.select({ count: count() }).from(tasks).where(whereClause),
  ]);

  return data;
};

export const get = async (params: GetTaskParams): Promise<TaskRawObject> => {
  const { id } = params;

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
  });

  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  return task;
};

export const find = async (userId: string): Promise<TaskRawObject[]> => {
  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.createdAt))
    .limit(1);

  return result;
};

export const create = async (
  params: CreateTaskParams
): Promise<TaskRawObject> => {
  const { userId, ...data } = params;

  const result = await db
    .insert(tasks)
    .values({ ...data, userId })
    .returning();

  const task = result[0];
  if (!task) {
    throw new HttpError(500, "Failed to create task");
  }

  return task;
};

export const updateOne = async (
  params: UpdateTaskParams
): Promise<TaskRawObject> => {
  const { id, ...data } = params;

  const result = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning();

  const task = result[0];
  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  return task;
};

export const deleteOne = async (
  params: DeleteTaskParams
): Promise<TaskRawObject> => {
  const { id } = params;

  const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();

  const task = result[0];
  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  return task;
};

export const deleteAllByUserId = async (params: {
  userId: string;
}): Promise<void> => {
  const { userId } = params;
  await db.delete(tasks).where(eq(tasks.userId, userId));
};
