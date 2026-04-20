import { getQueryClient, HydrateClient } from "@workspace/data-layer/hydration";
import { orpc } from "@workspace/data-layer/orpc.tanstack";
import { Suspense } from "react";
import { BillingContent } from "@/components/billing";
import { Skeleton } from "@/components/boneyard-skeleton";

const BILLING_REFETCH_INTERVAL = 30_000;

export default async function BillingPage() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    orpc.billing.getSubscription.queryOptions({
      refetchInterval: BILLING_REFETCH_INTERVAL,
    })
  );

  return (
    <Suspense
      fallback={
        <Skeleton loading={true} name="billing">
          <BillingContent />
        </Skeleton>
      }
    >
      <HydrateClient client={queryClient}>
        <BillingContent />
      </HydrateClient>
    </Suspense>
  );
}
