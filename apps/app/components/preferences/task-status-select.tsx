"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updatePreferences as updatePreferencesMutation } from "./mutations";

type TaskStatus = "todo" | "in-progress";

interface TaskStatusSelectProps {
  readonly defaultStatus: TaskStatus;
}

export function TaskStatusSelect({ defaultStatus }: TaskStatusSelectProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(defaultStatus);

  const { mutateAsync, isPending } = useMutation(
    updatePreferencesMutation(queryClient)
  );

  const handleChange = async (status: TaskStatus) => {
    const previous = currentStatus;
    setCurrentStatus(status);
    try {
      await mutateAsync({ defaultTaskStatus: status });
      router.refresh();
    } catch {
      setCurrentStatus(previous);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="justify-start"
          disabled={isPending}
          variant="outline"
        >
          {currentStatus === "todo" ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
              To Do
            </>
          ) : (
            <>
              <Clock className="mr-2 h-4 w-4 text-blue-500" />
              In Progress
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleChange("todo")}>
          <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
          To Do
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange("in-progress")}>
          <Clock className="mr-2 h-4 w-4 text-blue-500" />
          In Progress
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
