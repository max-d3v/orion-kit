"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { orpc } from "@workspace/data-layer/orpc.tanstack";
import type { Task } from "@workspace/types/use-cases/tasks";
import { useEffect, useMemo, useState } from "react";
import { updateTask as updateTaskMutation } from "@/components/tasks/mutations";
import type { StatusFilter } from "@/components/tasks/task-status-config";
import { TasksFilters } from "@/components/tasks/tasks-filters";
import { TasksStats } from "@/components/tasks/tasks-stats";
import { TasksTable } from "@/components/tasks/tasks-table";
import { useTasksContext } from "./context";

export function TasksContent() {
  const queryClient = useQueryClient();
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setTotalPages,
    setSelectedTask,
    setCreateDialogOpen,
  } = useTasksContext();

  const { data: tasksData } = useSuspenseQuery(
    orpc.tasks.getUserTasksWithCount.queryOptions()
  );

  const { mutateAsync: updateTask } = useMutation(
    updateTaskMutation(queryClient)
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const tasks = tasksData.tasks ?? [];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [tasks, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setTotalPages(totalPages);
  }, [totalPages, setTotalPages]);

  const handleStatusChange = async (task: Task, newStatus: Task["status"]) => {
    await updateTask({ id: task.id, status: newStatus });
  };

  return (
    <>
      <TasksStats
        data={{
          data: tasks,
          total: tasks.length,
          completed: tasksData.taskCounts.completed,
          inProgress: tasksData.taskCounts.inProgress,
          todo: tasksData.taskCounts.todo,
        }}
      />

      <TasksFilters
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        onStatusFilterChange={(f) => {
          setStatusFilter(f);
          setCurrentPage(1);
        }}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
      />

      <TasksTable
        filteredTasks={paginatedTasks}
        onCreateTask={() => setCreateDialogOpen(true)}
        onEditTask={setSelectedTask}
        onStatusChange={handleStatusChange}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        tasks={tasks}
      />
    </>
  );
}
