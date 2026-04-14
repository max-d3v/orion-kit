"use client";

import type { QueryClient } from "@tanstack/react-query";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";
import { toast } from "sonner";

export function updatePreferences(queryClient: QueryClient) {
  return orpc.preferences.update.mutationOptions({
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
    onSuccess: () => {
      window.location.href = "/";
    },
  });
}
