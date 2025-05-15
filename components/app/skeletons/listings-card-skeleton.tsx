"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function ListingsCardSkeleton() {
  return (
    <article className="flex w-full flex-col items-stretch gap-4 rounded-md border px-3 pt-3 pb-4">
      {/* Image skeleton */}
      <Skeleton className="aspect-auto h-50 w-full rounded-md" />

      {/* Location and title section */}
      <section className="flex flex-col gap-2">
        {/* Location with icon */}
        <div className="flex gap-2">
          <Skeleton className="size-6 rounded-full" /> {/* Location icon */}
          <Skeleton className="h-6 w-24" /> {/* Location text */}
        </div>

        {/* Title */}
        <Skeleton className="h-8 w-3/4" />
      </section>

      {/* Price and button section */}
      <section className="flex items-center justify-between gap-2 text-sm">
        {/* Price */}
        <Skeleton className="h-7 w-20" />

        {/* View Details button */}
        <Skeleton className="h-12 w-32 rounded-sm" />
      </section>
    </article>
  );
}
