import { tasksRepository } from "@workspace/repository";
import type { TaskRawObject } from "@workspace/types/repository/tasks";
import type { GetUserTasksInput } from "@workspace/types/use-cases/tasks";

const countTasksByStatus = (tasks: TaskRawObject[]) => ({
  completed: tasks.filter((t) => t.status === "completed").length,
  inProgress: tasks.filter((t) => t.status === "in-progress").length,
  todo: tasks.filter((t) => t.status === "todo").length,
});

export const getUserTasks = async (params: GetUserTasksInput) => {};

export const getUserTasksWithCount = async (params: GetUserTasksInput) => {
  const { userId } = params;
  const tasks = await tasksRepository.find(userId);
  const taskCounts = countTasksByStatus(tasks);
  return { tasks, taskCounts };
};
