"use client";

import type { Task } from "@workspace/types/use-cases/tasks";
import { createContext, useContext, useState } from "react";

interface TasksContextValue {
  currentPage: number;
  isCreateDialogOpen: boolean;
  itemsPerPage: number;
  selectedTask: Task | null;
  setCreateDialogOpen: (open: boolean) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (n: number) => void;
  setSelectedTask: (task: Task | null) => void;
  setTotalPages: (pages: number) => void;
  totalPages: number;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }
  return context;
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPageRaw] = useState(10);

  const setItemsPerPage = (n: number) => {
    setItemsPerPageRaw(n);
    setCurrentPage(1);
  };

  return (
    <TasksContext.Provider
      value={{
        isCreateDialogOpen,
        setCreateDialogOpen,
        selectedTask,
        setSelectedTask,
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        itemsPerPage,
        setItemsPerPage,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
