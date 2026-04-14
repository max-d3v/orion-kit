import { getQueryClient, HydrateClient } from "@workspace/data-layer/hydration";
import { orpc } from "@workspace/data-layer/orpc-tanstack-util";
import { Skeleton } from "boneyard-js/react";
import { Suspense } from "react";
import { AnalyticsContent } from "@/components/analytics";
import { AnalyticsLoading } from "@/components/analytics/analytics-loading";

const ANALYTICS_REFETCH_INTERVAL = 10_000;

export default async function AnalyticsPage() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    orpc.tasks.getUserTasksWithCount.queryOptions({
      refetchInterval: ANALYTICS_REFETCH_INTERVAL,
    })
  );

  return (
    <Suspense
      fallback={
        <Skeleton
          loading={true}
          name="analytics"
        >
          <AnalyticsContent />
        </Skeleton>
      }
    >
      <HydrateClient client={queryClient}>
        <AnalyticsContent />
      </HydrateClient>
    </Suspense>
  );
}
