import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-4 pb-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function ImageGallerySkeleton() {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  );
}

export function PropertyHighlightsSkeleton() {
  return (
    <div className="border-line w-full overflow-hidden rounded-lg border bg-white shadow-sm md:max-w-82">
      <div className="bg-background-secondary border-line border-b p-4">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <section className="px-4 py-5 sm:px-12 sm:py-10 md:px-16 md:py-12">
      <HeaderSkeleton />
      <section className="grid grid-cols-1 gap-6 md:grid-cols-[3fr_1fr]">
        <div className="flex flex-col items-start gap-6">
          <ImageGallerySkeleton />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <div className="flex w-full flex-col items-center justify-start">
          <PropertyHighlightsSkeleton />
        </div>
      </section>
    </section>
  );
}