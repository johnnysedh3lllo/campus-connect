import { Skeleton } from "@/components/ui/skeleton";
export function ListingLandlordProfileSkeleton() {
  return (
    <div className="border-line border-b-0.6 lg:border-r-0.6 pb-4 lg:min-h-screen lg:pr-4">
      <div className="flex flex-col gap-6">
        {/* Profile info */}
        <div className="flex flex-col items-center gap-2">
          {/* Avatar skeleton */}
          <Skeleton className="size-22 rounded-full sm:size-35" />

          <section className="flex flex-col items-center gap-2">
            {/* Name skeleton */}
            <Skeleton className="h-8 w-40" />

            {/* Properties count skeleton */}
            <Skeleton className="h-6 w-24" />
          </section>
        </div>

        {/* Divider - hidden on mobile */}
        <div className="bg-border hidden h-[0.6px] w-full lg:block" />

        {/* Message button skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
