import { Suspense } from "react";
import { Skeleton } from 'boneyard-js/react'
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { Dashboard } from "@/components/dashboard/dashboard-server";



export default async function Page() {
  return (
      <div className="flex flex-1 flex-col gap-6 p-6">
          <DashboardWelcome />
          <Suspense fallback={<Skeleton loading={true}> <Dashboard /> </Skeleton> }>
            <Dashboard />
          </Suspense>
      </div>
  );
}
