import { EVENTS } from "@workspace/analytics/events";
import { capture } from "@workspace/analytics/server";
import {
  create,
  deleteOne,
  list,
  updateOne,
} from "@workspace/repository/entities/tasks";
import { getOrCreate } from "@workspace/repository/entities/user-preferences";
import type { TaskRawObject } from "@workspace/types/repository/tasks";
import type {
  CompleteTask,
  CreateTask,
  DeleteTask,
  GetUserTasksInput,
  UpdateTask,
} from "@workspace/types/use-cases/tasks";

const countTasksByStatus = (tasks: TaskRawObject[]) => ({
  completed: tasks.filter((t) => t.status === "completed").length,
  inProgress: tasks.filter((t) => t.status === "in-progress").length,
  todo: tasks.filter((t) => t.status === "todo").length,
});

export const getUserTasks = async (params: GetUserTasksInput) => {
  const { userId } = params;
  //throw new HttpError(500, "test error")
  return await list({ userId });
};

export const getUserTasksWithCount = async (params: GetUserTasksInput) => {
  const { userId } = params;
  const tasks = await list({ userId });
  const taskCounts = countTasksByStatus(tasks);
  return { tasks, taskCounts };
};

export const createTask = async (params: CreateTask) => {
  const { userId, title, description } = params;

  const preferences = await getOrCreate({ userId });
  const defaultStatus =
    (preferences.defaultTaskStatus as TaskRawObject["status"]) ?? "todo";

  capture({
    event: EVENTS.task_created,
    userId,
    details: {
      title,
      description,
    },
  });

  return create({
    userId,
    title,
    description: description ?? null,
    status: defaultStatus,
  });
};

export const completeTask = async (params: CompleteTask) => {
  const { userId, taskId } = params;

  capture({
    event: EVENTS.task_completed,
    userId,
    details: {
      taskId,
    },
  });

  return await updateOne({ id: taskId, userId, status: "completed" });
};

export const updateTask = async (params: UpdateTask) => {
  const { userId, taskId, data } = params;

  return await updateOne({ id: taskId, userId, ...data });
};

export const deleteTask = async (params: DeleteTask) => {
  const { userId, taskId } = params;

  return await deleteOne({ id: taskId, userId });
};
