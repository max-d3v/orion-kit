import { CardContent } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function ProfileContentSkeleton() {
  return (
    <CardContent className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <Separator />
      <div className="grid gap-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </CardContent>
  );
}
