import { Skeleton } from "@/components/ui/skeleton";

export function MessageListItemSkeleton() {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-sm px-3 py-4 transition-all duration-300">
      {/* Avatar skeleton */}
      <Skeleton className="size-10 rounded-full" />

      <div className="flex w-full justify-between gap-6">
        <section className="flex flex-col justify-between gap-2">
          {/* Name skeleton */}
          <Skeleton className="h-6 w-32 lg:h-8" />

          {/* Message preview skeleton */}
          <Skeleton className="h-5 w-28" />
        </section>

        <div className="flex flex-col items-end justify-between gap-2">
          {/* Timestamp skeleton */}
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
    </div>
  );
}
