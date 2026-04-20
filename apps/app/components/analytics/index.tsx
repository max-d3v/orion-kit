"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { BarChart3, CheckCircle2, Circle, Clock, XCircle } from "lucide-react";
import { useMemo } from "react";
import { AnalyticsInsights } from "./analytics-insights";
import { AnalyticsRecentActivity } from "./analytics-recent-activity";
import { AnalyticsStats } from "./analytics-stats";
import { AnalyticsStatusBreakdown } from "./analytics-status-breakdown";
import { orpc } from "@workspace/data-layer/orpc.tanstack";

export function AnalyticsContent() {
  const { data: tasksData } = useSuspenseQuery(
    orpc.tasks.getUserTasksWithCount.queryOptions()
  );

  const tasks = tasksData.tasks ?? [];
  const totalTasks = tasks.length;

  const analytics = useMemo(() => {
    if (totalTasks === 0) {
      return null;
    }

    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const tasksThisWeek = tasks.filter(
      (t) => new Date(t.createdAt) >= last7Days
    ).length;

    const tasksThisMonth = tasks.filter(
      (t) => new Date(t.createdAt) >= last30Days
    ).length;

    const completedThisWeek = tasks.filter(
      (t) => t.status === "completed" && new Date(t.createdAt) >= last7Days
    ).length;

    const completionRate =
      totalTasks > 0
        ? Math.round((tasksData.taskCounts.completed / totalTasks) * 100)
        : 0;

    const statusBreakdown = [
      {
        status: "To Do",
        count: tasksData.taskCounts.todo,
        percentage:
          Math.round((tasksData.taskCounts.todo / totalTasks) * 100) || 0,
        color: "text-muted-foreground",
        icon: Circle,
      },
      {
        status: "In Progress",
        count: tasksData.taskCounts.inProgress,
        percentage:
          Math.round((tasksData.taskCounts.inProgress / totalTasks) * 100) || 0,
        color: "text-blue-500",
        icon: Clock,
      },
      {
        status: "Completed",
        count: tasksData.taskCounts.completed,
        percentage:
          Math.round((tasksData.taskCounts.completed / totalTasks) * 100) || 0,
        color: "text-green-500",
        icon: CheckCircle2,
      },
      {
        status: "Cancelled",
        count: tasks.filter((t) => t.status === "cancelled").length,
        percentage:
          Math.round(
            (tasks.filter((t) => t.status === "cancelled").length /
              totalTasks) *
              100
          ) || 0,
        color: "text-red-500",
        icon: XCircle,
      },
    ] as const;

    const recentActivity = [...tasks]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((task) => ({
        title: task.title,
        status: task.status,
        date: new Date(task.createdAt).toLocaleDateString(),
      }));

    return {
      tasksThisWeek,
      tasksThisMonth,
      completedThisWeek,
      completionRate,
      statusBreakdown,
      recentActivity,
    };
  }, [tasks, tasksData.taskCounts, totalTasks]);

  if (!analytics) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-primary p-3">
          <BarChart3 className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-3xl">Analytics</h1>
          <p className="text-muted-foreground">
            Track your productivity and task insights
          </p>
        </div>
      </div>

      <AnalyticsStats
        completedThisWeek={analytics.completedThisWeek}
        completionRate={analytics.completionRate}
        tasksThisMonth={analytics.tasksThisMonth}
        tasksThisWeek={analytics.tasksThisWeek}
        total={totalTasks}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsStatusBreakdown statusBreakdown={analytics.statusBreakdown} />

        <AnalyticsRecentActivity recentActivity={analytics.recentActivity} />
      </div>

      <AnalyticsInsights
        completedThisWeek={analytics.completedThisWeek}
        completionRate={analytics.completionRate}
        inProgress={tasksData.taskCounts.inProgress}
      />
    </div>
  );
}
