"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateTaskInput } from "@workspace/types/use-cases/tasks";
import { createTaskInputSchema } from "@workspace/types/use-cases/tasks";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTasksContext } from "./context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "./mutations";

export function CreateTaskDialog() {  
  const queryClient = useQueryClient();

  const { isCreateDialogOpen, setCreateDialogOpen } = useTasksContext();
  const createTaskMutation = useMutation(createTask(queryClient));

  const form = useForm({
    resolver: zodResolver(createTaskInputSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleSubmit = async (data: CreateTaskInput) => {
    await createTaskMutation.mutateAsync(data);
    form.reset();
    setCreateDialogOpen(false);
  };

  return (
    <Dialog onOpenChange={setCreateDialogOpen} open={isCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your list. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="create-task-title">Title</Label>
            <Input
              id="create-task-title"
              {...form.register("title")}
              placeholder="Enter task title"
            />
            {form.formState.errors.title && (
              <p className="text-destructive text-sm">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="create-task-description">Description</Label>
            <Textarea
              id="create-task-description"
              {...form.register("description")}
              className="resize-none"
              placeholder="Enter task description (optional)"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={createTaskMutation.isPending || form.formState.isSubmitting}
            onClick={form.handleSubmit(handleSubmit)}
            type="button"
          >
            {createTaskMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
          <DialogClose asChild>
            <Button onClick={() => form.reset()} variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
