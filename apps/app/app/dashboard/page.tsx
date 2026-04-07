import { getQueryClient } from "@workspace/data-layer/hydration";
import { orpc } from "@workspace/rpc/orpc/tanstack";
import { DashboardStats } from "../../components/dashboard/dashboard-stats";
import { DashboardTasksPreview } from "../../components/dashboard/dashboard-tasks-preview";
import { DashboardWelcome } from "../../components/dashboard/dashboard-welcome";

// This dashboard is read-only. so plain server rendering is fine here.

export default async function Dashboard() {
  const queryClient = getQueryClient();

  const tasks = await queryClient.fetchQuery(
    orpc.tasks.getUserTasks.queryOptions({
      refetchInterval: 10000,
    })
  )

  return (
      <div className="flex flex-1 flex-col gap-6 p-6">
          <DashboardWelcome />
          <DashboardStats tasks={tasks}/>
          <DashboardTasksPreview tasks={tasks} />
      </div>
  );
}
