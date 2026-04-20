import {
  create,
  deleteOne,
  get,
  list,
  updateOne,
} from "@workspace/repository/entities/tasks";
import { getOrCreate } from "@workspace/repository/entities/user-preferences";
import type { TaskRawObject } from "@workspace/types/repository/tasks";
import type { GetUserTasksInput } from "@workspace/types/use-cases/tasks";
import { assertTaskOwnership } from "../authorization/tasks";

const countTasksByStatus = (tasks: TaskRawObject[]) => ({
  completed: tasks.filter((t) => t.status === "completed").length,
  inProgress: tasks.filter((t) => t.status === "in-progress").length,
  todo: tasks.filter((t) => t.status === "todo").length,
});

export const getUserTasks = async (params: GetUserTasksInput) => {
  const { userId } = params;
  return await list({ userId });
};

export const getUserTasksWithCount = async (params: GetUserTasksInput) => {
  const { userId } = params;
  const tasks = await list({ userId });
  const taskCounts = countTasksByStatus(tasks);
  return { tasks, taskCounts };
};

export const createTask = async (params: {
  userId: string;
  title: string;
  description?: string | null;
}) => {
  const { userId, title, description } = params;

  const preferences = await getOrCreate({ userId });
  const defaultStatus =
    (preferences.defaultTaskStatus as TaskRawObject["status"]) ?? "todo";

  return create({
    userId,
    title,
    description: description ?? null,
    status: defaultStatus,
  });
};

export const updateTask = async (params: {
  userId: string;
  taskId: string;
  data: {
    title?: string;
    description?: string | null;
    status?: TaskRawObject["status"];
    dueDate?: Date | null;
    completedAt?: Date | null;
  };
}) => {
  const { userId, taskId, data } = params;

  const task = await get({ id: taskId });
  assertTaskOwnership(task, userId);

  return updateOne({ id: taskId, ...data });
};

export const deleteTask = async (params: {
  userId: string;
  taskId: string;
}) => {
  const { userId, taskId } = params;

  const task = await get({ id: taskId });
  assertTaskOwnership(task, userId);

  return deleteOne({ id: taskId });
};
