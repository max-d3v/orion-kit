"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdatePreferencesInput } from "@workspace/types/use-cases/preferences";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updatePreferences as updatePreferencesMutation } from "./mutations";

type NotificationField = keyof Pick<
  UpdatePreferencesInput,
  "emailNotifications" | "taskReminders" | "weeklyDigest" | "pushNotifications"
>;

interface NotificationToggleProps {
  readonly enabled: boolean;
  readonly field: NotificationField;
}

export function NotificationToggle({
  enabled,
  field,
}: NotificationToggleProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(enabled);

  const { mutateAsync, isPending } = useMutation(
    updatePreferencesMutation(queryClient)
  );

  const handleToggle = async () => {
    const next = !isEnabled;
    setIsEnabled(next);
    try {
      await mutateAsync({ [field]: next ? "enabled" : "disabled" });
      router.refresh();
    } catch {
      setIsEnabled(!next);
    }
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleToggle}
      size="sm"
      variant={isEnabled ? "default" : "outline"}
    >
      {isEnabled ? "Enabled" : "Disabled"}
    </Button>
  );
}
