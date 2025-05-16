"use client";
import { ListingsCardSkeleton } from "./listings-card-skeleton";

export function ListingsCardGridSkeleton() {
  return (
    <div className="max-w-screen-max-xl mx-auto grid w-full grid-cols-1 justify-items-center gap-4 px-4 py-6 sm:grid-cols-2 sm:px-12 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <ListingsCardSkeleton key={index} />
      ))}
    </div>
  );
}
