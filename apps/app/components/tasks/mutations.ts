"use client";

import type { QueryClient } from "@tanstack/react-query";
import { orpc } from "@workspace/data-layer/orpc.tanstack";
import { toast } from "sonner";

export function updateTask(queryClient: QueryClient) {
  return orpc.tasks.update.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.tasks.getUserTasksWithCount.key(),
      });
      toast.success("Task updated successfully!");
    },
  });
}

export function deleteTask(queryClient: QueryClient) {
  return orpc.tasks.delete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.tasks.getUserTasksWithCount.key(),
      });
      toast.success("Task deleted successfully!");
    },
  });
}

export function createTask(queryClient: QueryClient) {
  return orpc.tasks.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.tasks.getUserTasksWithCount.key(),
      });
    },
  });
}
