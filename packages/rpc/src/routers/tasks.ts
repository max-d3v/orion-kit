import { os } from "@orpc/server";
import { getUserTasksWithCount } from "@workspace/core/use-cases/tasks";
import { authenticatedProcedure } from "../base";

const tasksRouter = {
  getUserTasksWithCount: authenticatedProcedure.handler(async ({ context }) => {
    const { id } = context.user;
    const { tasks, taskCounts } = await getUserTasksWithCount({ userId: id });
    return { tasks, taskCounts };
  }),
};

export default tasksRouter;
