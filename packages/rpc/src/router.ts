import billingRouter from "./routers/billing";
import preferencesRouter from "./routers/preferences";
import tasksRouter from "./routers/tasks";
import usersRouter from "./routers/users";
import webhookRouter from "./routers/webhook";

export const router = {
  tasks: tasksRouter,
  preferences: preferencesRouter,
  billing: billingRouter,
  users: usersRouter,
  webhook: webhookRouter,
};
