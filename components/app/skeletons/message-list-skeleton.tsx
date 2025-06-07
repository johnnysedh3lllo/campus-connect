"use client";
import { MessageListItemSkeleton } from "./message-list-item-skeleton";

export function MessageListSkeleton() {
  return (
    <div className="message-list flex max-h-[calc(75vh-100px)] w-full flex-1 flex-col gap-4 overflow-y-auto">
      {Array.from({ length: 5 }).map((_, index) => (
        <MessageListItemSkeleton key={index} />
      ))}
    </div>
  );
}
