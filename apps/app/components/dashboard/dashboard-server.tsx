import { getQueryClient } from "@workspace/data-layer/hydration";
import { orpc } from "@workspace/data-layer/orpc.tanstack";
import { DashboardStats } from "./dashboard-stats";
import { DashboardTasksPreview } from "./dashboard-tasks-preview";

export async function Dashboard() {
  const queryClient = getQueryClient();

  const DASHBOARD_REFETCH_INTERVAL = 10_000;

  const tasks = await queryClient.fetchQuery(
    orpc.tasks.getUserTasks.queryOptions({
      refetchInterval: DASHBOARD_REFETCH_INTERVAL,
    })
  );

  return (
    <>
      <DashboardStats tasks={tasks} />
      <DashboardTasksPreview tasks={tasks} />
    </>
  );
}
