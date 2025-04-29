import { Skeleton } from "@/components/ui/skeleton";

export function UserPillSkeleton() {
  return (
    <figure className="flex items-center gap-2">
      <Skeleton className="size-10 rounded-full" />
      <Skeleton className="h-6 w-32 rounded-sm" />
    </figure>
  );
}
