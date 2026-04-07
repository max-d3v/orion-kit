"use client";

import { useTasks } from "@/hooks/use-tasks";
import { DashboardError } from "./dashboard-error";
import { DashboardLoading } from "./dashboard-loading";
import { DashboardStats } from "./dashboard-stats";
import { DashboardTasksPreview } from "./dashboard-tasks-preview";
import { DashboardWelcome } from "./dashboard-welcome";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";

export function DashboardContent() {
  const { data: tasks } = useSuspenseQuery(orpc.tasks.getUserTasks.queryOptions());


  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <DashboardWelcome name={user?.name || ""} />

      {error && <DashboardError error={error} onRetry={refetch} />}

      {!error && tasks && (
        <>
          <DashboardStats
            completed={tasks.completed}
            inProgress={tasks.inProgress}
            todo={tasks.todo}
            total={tasks.total}
          />

          <DashboardTasksPreview tasks={tasks.data} />
        </>
      )}
    </div>
  );
}
