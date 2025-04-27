"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function CreditDisplayCardSkeleton() {
  return (
    <div className="border-border flex flex-col gap-6 rounded-md border p-4">
      <div className="flex items-start gap-3">
        {/* Logo/badge skeleton */}
        <Skeleton className="size-11 rounded-full" />

        <section className="flex flex-col gap-2">
          {/* Credits title skeleton */}
          <Skeleton className="h-8 w-32" />

          {/* Description skeleton */}
          <Skeleton className="h-5 w-64" />
        </section>
      </div>

      {/* Button skeleton */}
      <Skeleton className="h-12 w-full sm:w-36" />
    </div>
  );
}
