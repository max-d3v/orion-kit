"use client";

import type { QueryClient } from "@tanstack/react-query";
import { orpc } from "@workspace/data-layer/orpc.tanstack";
import { toast } from "sonner";

export function updatePreferences(queryClient: QueryClient) {
  return orpc.preferences.update.mutationOptions({
    meta: { errorTitle: "Failed to save settings" },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.preferences.get.key(),
      });
      toast.success("Settings saved successfully!");
    },
  });
}

export function updateProfile(queryClient: QueryClient) {
  return orpc.users.updateProfile.mutationOptions({
    meta: { errorTitle: "Failed to update profile" },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.users.getUser.key(),
      });
      toast.success("Profile updated successfully!");
    },
  });
}

export function deleteAccount(_queryClient: QueryClient) {
  return orpc.users.deleteAccount.mutationOptions({
    meta: { errorTitle: "Failed to delete account" },
    onSuccess: () => {
      window.location.href = "/";
    },
  });
}
