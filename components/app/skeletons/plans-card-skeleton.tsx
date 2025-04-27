"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PlansCardSkeleton() {
  return (
    <section className="text-text-accent bg-background max-w-[586px] border-line flex w-full flex-col gap-6 rounded-md border p-6">
      <div className="flex flex-col gap-4">
        <section className="flex flex-col gap-2 lg:gap-3">
          <Skeleton className="h-8 w-24 rounded-sm" />
          <Skeleton className="h-6 w-16 rounded-sm" />
        </section>

        <section className="flex flex-col gap-3">
          <Skeleton className="h-6 w-28 rounded-sm" />
          <ul className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="flex items-start gap-1">
                <Skeleton className="h-6 w-6 rounded-sm" />
                <Skeleton className="h-6 w-full max-w-[300px] rounded-sm" />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-2">
        <Skeleton className="h-12 w-full rounded-sm sm:w-36" />
      </div>
    </section>
  );
}
