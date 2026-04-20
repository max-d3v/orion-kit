import {
  createTask,
  deleteTask,
  getUserTasks,
  getUserTasksWithCount,
  updateTask,
} from "@workspace/core/use-cases/tasks";
import {
  createTaskInputSchema,
  deleteTaskInputSchema,
  updateTaskInputSchema,
} from "@workspace/types/use-cases/tasks";
import { authenticatedProcedure } from "../base";

const tasksRouter = {
  getUserTasksWithCount: authenticatedProcedure.handler(async ({ context }) => {
    const { id } = context.user;
    const { tasks, taskCounts } = await getUserTasksWithCount({ userId: id });
    return { tasks, taskCounts };
  }),
  getUserTasks: authenticatedProcedure.handler(async ({ context }) => {
    const { id } = context.user;
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    return await getUserTasks({ userId: id });
  }),
  create: authenticatedProcedure
    .input(createTaskInputSchema)
    .handler(async ({ context, input }) => {
      const { id } = context.user;
      return await createTask({ userId: id, ...input });
    }),

  update: authenticatedProcedure
    .input(updateTaskInputSchema)
    .handler(async ({ context, input }) => {
      const { id: userId } = context.user;
      const { id: taskId, ...data } = input;
      return await updateTask({ userId, taskId, data });
    }),

  delete: authenticatedProcedure
    .input(deleteTaskInputSchema)
    .handler(async ({ context, input }) => {
      const { id: userId } = context.user;
      return await deleteTask({ userId, taskId: input.id });
    }),
};

export default tasksRouter;
