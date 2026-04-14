import { Skeleton } from "boneyard-js/react";
import { Suspense } from "react";
import { Dashboard } from "@/components/dashboard/dashboard-server";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <DashboardWelcome />
      <Suspense
        fallback={
          <Skeleton loading={true} name="dashboard">
            <Dashboard />
          </Skeleton>
        }
      >
        <Dashboard />
      </Suspense>
    </div>
  );
}
