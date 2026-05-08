import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { CheckCircle2 } from "lucide-react";
import { TaskStatusSelect } from "./task-status-select";

interface SettingsTaskPreferencesProps {
  readonly defaultStatus: string | null | undefined;
}

export function SettingsTaskPreferences({
  defaultStatus,
}: SettingsTaskPreferencesProps) {
  const currentStatus =
    defaultStatus === "in-progress" ? "in-progress" : "todo";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Task Preferences
        </CardTitle>
        <CardDescription>
          Customize how you create and manage tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <Label>Default Status for New Tasks</Label>
          <TaskStatusSelect defaultStatus={currentStatus} />
        </div>
      </CardContent>
    </Card>
  );
}
