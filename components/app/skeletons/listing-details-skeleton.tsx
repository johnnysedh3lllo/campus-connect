"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ListingDetailSkeleton() {
  return (
    <div className="max-w-screen-max-xl z-10 mx-auto flex flex-col gap-6 px-4 pb-5 sm:px-12 sm:pb-10 lg:px-6 lg:pb-12">
      {/* Header Section */}
      <section className="flex flex-col-reverse items-center justify-between gap-3 lg:flex-row">
        <section className="flex w-full gap-3">
          {/* Back button - hidden on mobile, visible on desktop */}
          <div className="hidden size-10 items-center justify-center lg:flex">
            <Skeleton className="h-5 w-5" />
          </div>

          <header className="flex flex-col gap-3">
            {/* Title skeleton */}
            <Skeleton className="h-10 w-48 sm:h-12 sm:w-64" />

            {/* Location skeleton */}
            <div className="flex gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-6 w-36" />
            </div>
          </header>
        </section>

        <div className="flex w-full items-center justify-between gap-6 lg:w-fit">
          {/* Back button - visible on mobile, hidden on desktop */}
          <div className="flex size-10 items-center justify-center lg:hidden">
            <Skeleton className="h-5 w-5" />
          </div>

          <div className="flex gap-3">
            {/* Status toggle buttons skeleton */}
            <Skeleton className="h-10 w-48 rounded-sm" />

            {/* More options button skeleton */}
            <Skeleton className="size-10 rounded-sm" />
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_1fr]">
        {/* Left Column - Images and Description */}
        <section className="flex flex-3 flex-col gap-6">
          {/* Images Grid Skeleton */}
          <div className="grid h-[300px] w-full grid-cols-[3fr_1.5fr] grid-rows-2 gap-2 sm:h-[400px] md:h-[500px]">
            {/* Main large image */}
            <Skeleton className="col-start-1 col-end-2 row-span-3 h-full" />

            {/* Top right image */}
            <Skeleton className="col-start-2 row-start-1 row-end-2 h-full" />

            {/* Bottom right image */}
            <Skeleton className="col-start-2 row-start-2 row-end-3 h-full" />
          </div>

          {/* Description skeleton */}
          <Skeleton className="h-20 w-full" />
        </section>

        {/* Right Column - Property Highlights and Map */}
        <section className="flex flex-1 flex-col gap-6">
          {/* Property Highlights Card */}
          <div className="border-line w-full min-w-fit overflow-hidden rounded-md border bg-white">
            {/* Card header */}
            <div className="bg-background-secondary p-4">
              <Skeleton className="h-8 w-48" />
            </div>

            <div className="bg-border h-[0.6px] w-full" />

            {/* Price section */}
            <div className="flex items-center gap-3 p-4">
              <Skeleton className="size-6 rounded-full" />
              <section className="flex flex-col gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-7 w-32" />
              </section>
            </div>

            <div className="bg-border h-[0.6px] w-full" />

            {/* Bedrooms section */}
            <div className="flex items-center gap-3 p-4">
              <Skeleton className="size-6 rounded-full" />
              <section className="flex flex-col gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-24" />
              </section>
            </div>

            <div className="bg-border h-[0.6px] w-full" />

            {/* Home type section */}
            <div className="flex items-center gap-3 p-4">
              <Skeleton className="size-6 rounded-full" />
              <section className="flex flex-col gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-28" />
              </section>
            </div>
          </div>

          {/* Map skeleton */}
          <Skeleton className="h-[200px] w-full rounded-md" />
        </section>
      </section>
    </div>
  );
}
