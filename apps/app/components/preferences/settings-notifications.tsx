import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Bell } from "lucide-react";
import { NotificationToggle } from "./notification-toggle";

interface SettingsNotificationsProps {
  readonly emailNotifications: string | null | undefined;
  readonly taskReminders: string | null | undefined;
  readonly weeklyDigest: string | null | undefined;
}

export function SettingsNotifications({
  emailNotifications,
  taskReminders,
  weeklyDigest,
}: SettingsNotificationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium text-sm">Email Notifications</div>
            <div className="text-muted-foreground text-sm">
              Get notified about important updates
            </div>
          </div>
          <NotificationToggle
            enabled={emailNotifications === "enabled"}
            field="emailNotifications"
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium text-sm">Task Reminders</div>
            <div className="text-muted-foreground text-sm">
              Reminders for tasks with due dates
            </div>
          </div>
          <NotificationToggle
            enabled={taskReminders === "enabled"}
            field="taskReminders"
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium text-sm">Weekly Digest</div>
            <div className="text-muted-foreground text-sm">
              Summary of your tasks every Monday
            </div>
          </div>
          <NotificationToggle
            enabled={weeklyDigest === "enabled"}
            field="weeklyDigest"
          />
        </div>
      </CardContent>
    </Card>
  );
}
