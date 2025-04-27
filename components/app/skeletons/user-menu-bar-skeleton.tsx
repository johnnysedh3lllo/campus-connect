"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function UserMenuBarSkeleton() {
  return (
    <div className="hidden gap-2 lg:flex lg:items-center">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-20 rounded-xs" />
    </div>
  );
}
