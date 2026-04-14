"use client";

import type { QueryClient } from "@tanstack/react-query";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";
import { toast } from "sonner";

export function cancelSubscription(queryClient: QueryClient) {
  return orpc.billing.cancelSubscription.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.billing.getSubscription.key(),
      });
      toast.success(
        "Subscription canceled. It will end at the end of the billing period."
      );
    },
  });
}
