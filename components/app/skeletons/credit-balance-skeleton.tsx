"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CreditBalanceSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="size-7 rounded-full" />
      <Skeleton className="h-4 w-18 rounded-sm" />
    </div>
  );
}
