"use client";

import { cn } from "@/lib/utils/app/utils";

export function EmptyImageCarousel({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-0.6 border-input/50 rounded-sm px-4 py-12",
        className,
      )}
    >
      <p className="text-center text-2xl leading-6 font-medium text-gray-700">
        {text}
      </p>
    </div>
  );
}
