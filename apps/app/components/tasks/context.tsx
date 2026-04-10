"use client";

import { createContext, useContext, useState } from "react";
import type { Task } from "@workspace/types/use-cases/tasks";

interface TasksContextValue {
  isCreateDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (n: number) => void;
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
