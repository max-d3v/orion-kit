import accountRouter from "./routers/account";
import billingRouter from "./routers/billing";
import preferencesRouter from "./routers/preferences";
import tasksRouter from "./routers/tasks";

export const router = {
  tasks: tasksRouter,
  preferences: preferencesRouter,
  account: accountRouter,
  billing: billingRouter,
};
