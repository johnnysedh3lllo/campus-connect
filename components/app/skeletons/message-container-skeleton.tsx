import { Skeleton } from "@/components/ui/skeleton";

export function MessageContainerSkeleton() {
  return (
    <section className="relative flex h-[89vh] w-full flex-col justify-between px-4 transition-all duration-300 ease-in-out lg:w-full">
      {/* Header */}
      <div className="bg-background sticky top-0 z-10 flex items-center justify-between py-4">
        <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center">
          <Skeleton className="h-2 w-3" />
          <div className="flex w-full items-center justify-between">
            <section className="flex items-center gap-4.5">
              <Skeleton className="size-14 rounded-full" />
              <Skeleton className="h-7 w-36" />
            </section>
            <button className="focus-visible:ring-ring hover:bg-background-secondary flex size-10 cursor-pointer items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm leading-6 font-semibold whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-6 [&_svg]:shrink-0">
              <Skeleton className="h-6 w-6 rounded-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Message Container */}
      <div className="messaging-container border-border h-full flex-1 overflow-y-auto scroll-smooth border-y-1 p-4">
        {/* Yesterday's messages */}
        <div>
          <div className="flex items-center justify-center py-4">
            <Skeleton className="h-5 w-20 rounded-sm" />
          </div>
          <div className="flex flex-col gap-2">
            {/* Sent message */}
            <div className="flex w-fit max-w-[70%] flex-col items-end gap-2 self-end">
              <div className="flex items-end gap-2">
                <Skeleton className="h-12 w-32 rounded-md rounded-br-sm" />
              </div>
              <Skeleton className="h-4 w-16 self-end" />
            </div>
          </div>
        </div>

        {/* Today's messages */}
        <div>
          <div className="flex items-center justify-center py-4">
            <Skeleton className="h-5 w-16 rounded-sm" />
          </div>
          <div className="flex flex-col gap-2">
            {/* Sent messages */}
            <div className="flex w-fit max-w-[70%] flex-col items-end gap-2 self-end">
              <div className="flex items-end gap-2">
                <Skeleton className="h-12 w-24 rounded-md rounded-br-sm" />
              </div>
              <Skeleton className="h-4 w-16 self-end" />
            </div>
            <div className="flex w-fit max-w-[70%] flex-col items-end gap-2 self-end">
              <div className="flex items-end gap-2">
                <Skeleton className="h-12 w-48 rounded-md rounded-br-sm" />
              </div>
              <Skeleton className="h-4 w-16 self-end" />
            </div>
            <div className="flex w-fit max-w-[70%] flex-col items-end gap-2 self-end">
              <div className="flex items-end gap-2">
                <Skeleton className="h-12 w-28 rounded-md rounded-br-sm" />
              </div>
              <Skeleton className="h-4 w-16 self-end" />
            </div>

            {/* Received message */}
            <div className="flex w-fit max-w-[70%] flex-col items-start gap-2 self-start">
              <div className="flex items-end gap-2">
                <Skeleton className="size-7.5 rounded-full" />
                <Skeleton className="h-12 w-40 rounded-md rounded-bl-sm" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Sent message */}
            <div className="flex w-fit max-w-[70%] flex-col items-end gap-2 self-end">
              <div className="flex items-end gap-2">
                <Skeleton className="h-12 w-52 rounded-md rounded-br-sm" />
              </div>
              <Skeleton className="h-4 w-16 self-end" />
            </div>

            {/* Received message */}
            <div className="flex w-fit max-w-[70%] flex-col items-start gap-2 self-start">
              <div className="flex items-end gap-2">
                <Skeleton className="size-7.5 rounded-full" />
                <Skeleton className="h-12 w-36 rounded-md rounded-bl-sm" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Message Input Form */}
      <div className="bg-background-secondary mt-6 flex gap-2 rounded-xl p-2 pl-6">
        <Skeleton className="h-10 flex-1" />
        <div className="bg-muted flex size-10 items-center justify-center rounded-full">
          <Skeleton className="size-10 rounded-full" />
        </div>
      </div>
    </section>
  );
}
