"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-1 shrink-0 items-center gap-7 sm:gap-5">
      <Skeleton className="relative flex size-14 items-center justify-center rounded-full sm:size-22" />

      <section>
        <Skeleton className="mb-2 h-8 w-40 sm:h-10 sm:w-56" />
        <Skeleton className="h-5 w-56" />
      </section>
    </div>
  );
}
