"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePlanDisplaySkeleton() {
  return (
    <header className="flex items-center justify-between">
      <section>
        <Skeleton className="mb-2 h-7 w-32" />
        <Skeleton className="h-5 w-20" />
      </section>

      <Skeleton className="h-12 w-36" />
    </header>
  );
}
