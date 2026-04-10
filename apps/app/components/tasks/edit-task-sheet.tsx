"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateTaskInput } from "@workspace/types/use-cases/tasks";
import {
  updateTaskInputSchema,
} from "@workspace/types/use-cases/tasks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasksContext } from "./context";
import { useQueryClient } from "@tanstack/react-query";
import { StatusIcon, statusConfig } from "./task-status-config";
import { updateTask as updateTaskMutation, deleteTask as deleteTaskMutation } from "@/components/tasks/mutations";
import { useMutation } from "@tanstack/react-query";

export function EditTaskSheet() {
  const queryClient = useQueryClient();

  const { selectedTask: task, setSelectedTask } = useTasksContext();
  const open = task !== null;
  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedTask(null);
    }
  };
  const { mutateAsync: updateTask, isPending: isUpdatingTask } = useMutation(
    updateTaskMutation(queryClient)
  );
  const { mutateAsync: deleteTask, isPending: isDeletingTask } = useMutation(
    deleteTaskMutation(queryClient)
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateTaskInputSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo" as const,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
      });
    }
  }, [task, form]);

  const handleSubmit = async (data: Partial<CreateTaskInput>) => {
    if (!task) {
      return;
    }
    await updateTask({
      id: task.id,
      ...data,
    });
    setSelectedTask(null);
  };

  const handleDelete = async () => {
    if (!task) {
      return;
    }

    await deleteTask({ id: task.id });
    setShowDeleteDialog(false);
    setSelectedTask(null);
  };

  if (!task) {
    return null;
  }

  const formStatus = form.watch("status");

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>
            Make changes to your task here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
          <div className="grid gap-3">
            <Label htmlFor="edit-task-title">Title</Label>
            <Input
              id="edit-task-title"
              {...form.register("title")}
              placeholder="Enter task title"
            />
            {form.formState.errors.title && (
              <p className="text-destructive text-sm">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="edit-task-description">Description</Label>
            <Textarea
              id="edit-task-description"
              {...form.register("description")}
              className="resize-none"
              placeholder="Enter task description (optional)"
              rows={4}
            />
          </div>
          <div className="grid gap-3">
            <Label>Status</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="justify-start gap-2" variant="outline">
                  {formStatus ? (
                    <StatusIcon status={formStatus} />
                  ) : (
                    <Circle className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  {formStatus
                    ? statusConfig[formStatus].label
                    : "Select status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem
                  onClick={() => form.setValue("status", "todo")}
                >
                  <Circle className="mr-2 h-4 w-4 text-muted-foreground" />
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => form.setValue("status", "in-progress")}
                >
                  <Clock className="mr-2 h-4 w-4 text-blue-500" />
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => form.setValue("status", "completed")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => form.setValue("status", "cancelled")}
                >
                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid gap-3 border-t pt-6" />
        </div>
        <SheetFooter className="gap-2">
          <Button
            disabled={isUpdatingTask || form.formState.isSubmitting}
            onClick={form.handleSubmit(handleSubmit)}
            type="button"
          >
            {isUpdatingTask ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
          <Button
            className="w-full"
            disabled={isDeletingTask}
            onClick={() => setShowDeleteDialog(true)}
            size="sm"
            variant="destructive"
          >
            {isDeletingTask ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </>
            )}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>

      <AlertDialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingTask}
              onClick={handleDelete}
            >
              {isDeletingTask ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Task"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
