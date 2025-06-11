"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function PackagesSkeleton() {
  return (
    <section className="lg max-w-screen-max-xl mx-auto grid grid-cols-1 gap-6 lg:flex lg:flex-row lg:items-center lg:gap-x-6 lg:gap-y-0">
      {/* Generate 3 package card skeletons */}
      {Array.from({ length: 3 }).map((_, index) => (
        <PackageCardSkeleton key={index} />
      ))}
    </section>
  );
}

function PackageCardSkeleton() {
  return (
    <div className="relative flex flex-1 flex-col justify-between gap-6 rounded-md border border-gray-600/50 px-4 py-5">
      <div className="z-1 flex flex-col gap-6">
        {/* Title and price section */}
        <section className="flex flex-col gap-2">
          {/* Package title skeleton */}
          <Skeleton className="h-8 w-24" />

          {/* Price skeleton */}
          <Skeleton className="h-11 w-20" />
        </section>

        {/* Features list skeleton */}
        <ul className="flex flex-col gap-3">
          {/* Generate 4 feature items */}
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-start gap-1">
              {/* Check icon skeleton */}
              <Skeleton className="size-6 flex-shrink-0 rounded-full" />

              {/* Feature text skeleton with varying widths */}
              <Skeleton
                className={`h-6 flex-1 ${i === 0 ? "w-full" : i === 1 ? "w-5/6" : i === 2 ? "w-4/5" : "w-3/4"}`}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Button skeleton */}
      <Skeleton className="h-12 w-full rounded-sm" />

      {/* Optional image skeleton in top-right corner */}
      <Skeleton className="absolute top-4 right-4 h-16 w-16 rounded-md opacity-30" />
    </div>
  );
}
