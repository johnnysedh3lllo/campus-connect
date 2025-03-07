export default function ChatSkeleton() {
  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-white">
      {/* Header skeleton */}
      <div className="flex items-center border-b p-4">
        <div className="h-12 w-12 rounded-full bg-gray-200"></div>
        <div className="ml-3 flex-1">
          <div className="h-5 w-40 rounded bg-gray-200"></div>
        </div>
        <div className="h-6 w-6 rounded bg-gray-200"></div>
      </div>

      {/* Chat area skeleton */}
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <div className="flex justify-center">
          <div className="h-4 w-20 rounded bg-gray-200"></div>
        </div>

        {/* Sender message skeleton */}
        <div className="flex items-start gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          <div className="flex flex-col">
            <div className="h-10 w-48 rounded-lg bg-gray-200"></div>
            <div className="mt-1 h-3 w-16 rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Receiver message skeleton */}
        <div className="flex flex-col items-end">
          <div className="h-10 w-48 rounded-lg bg-gray-200"></div>
          <div className="mt-1 h-3 w-16 self-end rounded bg-gray-200"></div>
        </div>

        {/* Sender message skeleton */}
        <div className="flex items-start gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          <div className="flex flex-col">
            <div className="h-10 w-48 rounded-lg bg-gray-200"></div>
            <div className="mt-1 h-3 w-16 rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Receiver message skeleton */}
        <div className="flex flex-col items-end">
          <div className="h-10 w-48 rounded-lg bg-gray-200"></div>
          <div className="mt-1 h-3 w-16 self-end rounded bg-gray-200"></div>
        </div>

        {/* Receiver message skeleton */}
        <div className="flex flex-col items-end">
          <div className="h-10 w-48 rounded-lg bg-gray-200"></div>
          <div className="mt-1 h-3 w-16 self-end rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Message input skeleton */}
      <div className="flex items-center gap-2 border-t p-3">
        <div className="size-10 rounded-full bg-gray-200"></div>
        <div className="h-10 flex-1 rounded-full bg-gray-200"></div>
        <div className="size-10 rounded bg-gray-200"></div>
      </div>
    </div>
  );
}
