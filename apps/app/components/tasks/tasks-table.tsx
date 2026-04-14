"use client";

import type { Task } from "@workspace/types/use-cases/tasks";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  MoreVertical,
  Plus,
  XCircle,
} from "lucide-react";
import {
  type StatusFilter,
  StatusIcon,
  statusConfig,
} from "./task-status-config";

interface TasksTableProps {
  filteredTasks: Task[];
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
  onStatusChange: (task: Task, status: Task["status"]) => void;
  searchQuery: string;
  statusFilter: StatusFilter;
  tasks: Task[];
}

export function TasksTable({
  tasks,
  filteredTasks,
  statusFilter,
  searchQuery,
  onEditTask,
  onStatusChange,
  onCreateTask,
}: TasksTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {statusFilter === "all"
            ? "All Tasks"
            : `${statusConfig[statusFilter].label} Tasks`}
        </CardTitle>
        <CardDescription>
          {filteredTasks.length === 0
            ? searchQuery
              ? "No tasks match your search"
              : statusFilter === "all"
                ? "No tasks yet. Create your first task!"
                : `No ${statusConfig[statusFilter].label.toLowerCase()} tasks`
            : `Showing ${filteredTasks.length} of ${tasks.length} tasks`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredTasks.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="hidden w-[140px] sm:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="w-[100px]">Badge</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow className="group" key={task.id}>
                    <TableCell>
                      <StatusIcon status={task.status} />
                    </TableCell>
                    <TableCell>
                      <button
                        className="text-left font-medium transition-colors hover:text-primary"
                        onClick={() => onEditTask(task)}
                      >
                        {task.title}
                      </button>
                    </TableCell>
                    <TableCell className="hidden max-w-[300px] md:table-cell">
                      {task.description ? (
                        <span className="block truncate text-muted-foreground text-sm">
                          {task.description}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm italic">
                          No description
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground text-sm sm:table-cell">
                      {new Date(task.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[task.status].badgeVariant}>
                        {statusConfig[task.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="h-8 w-8 p-0"
                            size="sm"
                            variant="ghost"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditTask(task)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {task.status !== "todo" && (
                            <DropdownMenuItem
                              onClick={() => onStatusChange(task, "todo")}
                            >
                              <Circle className="mr-2 h-4 w-4" />
                              Mark as To Do
                            </DropdownMenuItem>
                          )}
                          {task.status !== "in-progress" && (
                            <DropdownMenuItem
                              onClick={() =>
                                onStatusChange(task, "in-progress")
                              }
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Mark as In Progress
                            </DropdownMenuItem>
                          )}
                          {task.status !== "completed" && (
                            <DropdownMenuItem
                              onClick={() => onStatusChange(task, "completed")}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Mark as Completed
                            </DropdownMenuItem>
                          )}
                          {task.status !== "cancelled" && (
                            <DropdownMenuItem
                              onClick={() => onStatusChange(task, "cancelled")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Mark as Cancelled
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Circle className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-medium text-lg">
              {searchQuery ? "No tasks found" : "No tasks yet"}
            </h3>
            <p className="mb-4 text-muted-foreground text-sm">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Get started by creating your first task"}
            </p>
            {!searchQuery && (
              <Button onClick={onCreateTask}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
