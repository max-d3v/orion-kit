"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";
import type { UpdatePreferencesInput } from "@workspace/types/use-cases/preferences";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { EditProfileModal } from "./edit-profile-modal";
import { updatePreferences as updatePreferencesMutation } from "./mutations";
import { SettingsNotifications } from "./settings-notifications";
import { SettingsProfile } from "./settings-profile";
import { SettingsTaskPreferences } from "./settings-task-preferences";

export function SettingsContent() {
  const queryClient = useQueryClient();
  const { data: user } = useAuth();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const { data: preferences } = useSuspenseQuery(
    orpc.preferences.get.queryOptions()
  );

  const updatePreferences = useMutation(updatePreferencesMutation(queryClient));

  const form = useForm<UpdatePreferencesInput>({
    defaultValues: {
      defaultTaskStatus: "todo",
      emailNotifications: "enabled",
      taskReminders: "enabled",
      weeklyDigest: "disabled",
    },
  });

  useEffect(() => {
    if (preferences) {
      form.reset({
        defaultTaskStatus: preferences.defaultTaskStatus || "todo",
        emailNotifications: preferences.emailNotifications || "enabled",
        taskReminders: preferences.taskReminders || "enabled",
        weeklyDigest: preferences.weeklyDigest || "disabled",
        theme: preferences.theme || "system",
        language: preferences.language || "en",
        timezone: preferences.timezone || undefined,
        pushNotifications: preferences.pushNotifications || "disabled",
      });
    }
  }, [preferences, form]);

  const handleDefaultStatusChange = (status: "todo" | "in-progress") => {
    form.setValue("defaultTaskStatus", status);
    form.handleSubmit(onSubmit)();
  };

  const handleEmailNotificationsChange = (enabled: boolean) => {
    form.setValue("emailNotifications", enabled ? "enabled" : "disabled");
    form.handleSubmit(onSubmit)();
  };

  const handleTaskRemindersChange = (enabled: boolean) => {
    form.setValue("taskReminders", enabled ? "enabled" : "disabled");
    form.handleSubmit(onSubmit)();
  };

  const handleWeeklyDigestChange = (enabled: boolean) => {
    form.setValue("weeklyDigest", enabled ? "enabled" : "disabled");
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: UpdatePreferencesInput) => {
    await updatePreferences.mutateAsync(data);
  };

  const currentDefaultStatus = form.watch("defaultTaskStatus");
  const currentEmailNotifications = form.watch("emailNotifications");
  const currentTaskReminders = form.watch("taskReminders");
  const currentWeeklyDigest = form.watch("weeklyDigest");

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
        <SettingsProfile
          onEditProfile={() => setIsEditProfileModalOpen(true)}
          user={user}
        />

        <SettingsTaskPreferences
          defaultStatus={currentDefaultStatus}
          onDefaultStatusChange={handleDefaultStatusChange}
        />

        <SettingsNotifications
          emailNotifications={currentEmailNotifications}
          onEmailNotificationsChange={handleEmailNotificationsChange}
          onTaskRemindersChange={handleTaskRemindersChange}
          onWeeklyDigestChange={handleWeeklyDigestChange}
          taskReminders={currentTaskReminders}
          weeklyDigest={currentWeeklyDigest}
        />
      </div>

      <EditProfileModal
        onOpenChange={setIsEditProfileModalOpen}
        open={isEditProfileModalOpen}
        user={user}
      />
    </div>
  );
}
