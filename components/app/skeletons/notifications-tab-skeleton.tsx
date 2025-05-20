import { Skeleton } from "@/components/ui/skeleton";

export function NotificationsTabSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Heading skeleton */}
      <Skeleton className="h-6 w-40" />

      <div className="flex flex-col gap-6">
        {/* First toggle item */}
        <div className="flex flex-row items-center gap-3">
          {/* Toggle switch skeleton */}
          <Skeleton className="h-6 w-10 rounded-full" />

          <div className="flex flex-col gap-1">
            {/* Label skeleton */}
            <Skeleton className="h-6 w-36" />

            {/* Description skeleton */}
            <Skeleton className="h-5 w-64" />
          </div>
        </div>

        {/* Second toggle item */}
        <div className="flex flex-row items-center gap-3">
          {/* Toggle switch skeleton */}
          <Skeleton className="h-6 w-10 rounded-full" />

          <div className="flex flex-col gap-1">
            {/* Label skeleton */}
            <Skeleton className="h-6 w-24" />

            {/* Description skeleton */}
            <Skeleton className="h-5 w-72" />
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <Skeleton className="h-12 w-32 rounded-sm" />
    </div>
  );
}
