import { getQueryClient } from "@workspace/data-layer/hydration";
import { orpc } from "@workspace/data-layer/orpc.tanstack";
import { Settings } from "lucide-react";
import { SettingsNotifications } from "./settings-notifications";
import { SettingsTaskPreferences } from "./settings-task-preferences";

export async function SettingsContent() {
  const queryClient = getQueryClient();

  const preferences = await queryClient.fetchQuery(
    orpc.preferences.get.queryOptions()
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-primary p-3">
          <Settings className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-3xl">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and task preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* <SettingsProfile user={user} /> */}

        <SettingsTaskPreferences
          defaultStatus={preferences?.defaultTaskStatus}
        />

        <SettingsNotifications
          emailNotifications={preferences?.emailNotifications}
          taskReminders={preferences?.taskReminders}
          weeklyDigest={preferences?.weeklyDigest}
        />
      </div>
    </div>
  );
}
