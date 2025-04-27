"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePlanDisplaySkeleton() {
  return (
    <header className="flex items-center justify-between">
      <section>
        {/* Title skeleton */}
        <Skeleton className="mb-2 h-7 w-32" />

        {/* Plan name skeleton */}
        <Skeleton className="h-5 w-20" />
      </section>

      {/* Button skeleton */}
      <Skeleton className="h-12 w-36" />
    </header>
  );
}
