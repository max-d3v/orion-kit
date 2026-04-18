import billingRouter from "./routers/billing";
import preferencesRouter from "./routers/preferences";
import tasksRouter from "./routers/tasks";
import usersRouter from "./routers/users";

export const router = {
  tasks: tasksRouter,
  preferences: preferencesRouter,
  billing: billingRouter,
  users: usersRouter,
};
