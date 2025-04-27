"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Pencil } from "lucide-react";

export function ProfileInfoSkeleton() {
  return (
    <section className="flex flex-col gap-3">
      <header className="flex w-full items-center justify-between">
        {/* Title skeleton */}
        <Skeleton className="h-7 w-32" />

        {/* Edit button skeleton */}
        <Skeleton className="flex size-10 items-center justify-center rounded-full">
          <Pencil size={20} className="text-muted-foreground opacity-30" />
        </Skeleton>
      </header>

      <section className="flex flex-col gap-6">
        {/* Name row */}
        <div className="flex items-center gap-2">
          <User className="text-muted-foreground size-6 opacity-50" />
          <Skeleton className="h-5 w-36" />
        </div>

        {/* Email row */}
        <div className="flex items-center gap-2">
          <Mail className="text-muted-foreground size-6 opacity-50" />
          <Skeleton className="h-5 w-56" />
        </div>
      </section>
    </section>
  );
}
