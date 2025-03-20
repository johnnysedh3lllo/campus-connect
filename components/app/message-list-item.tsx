import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MessageListItemProps } from "@/lib/component-prop-types";



export function MessageListItem({ conversationId, participants }: MessageListItemProps) {
  const participant =
    participants && participants.length > 0 ? participants[0] : null;

  return (
    <Link
      href={`/messages/${conversationId}`}
      className="hover:bg-background-secondary grid grid-cols-[auto_1fr] items-center gap-3 rounded-sm px-3 py-4 transition-all duration-300"
      key={conversationId}
    >
      <Avatar className="size-10">
        {/* <AvatarImage src="" alt="avatar" /> */}
        <AvatarFallback>{participant?.first_name?.[0]}</AvatarFallback>
      </Avatar>

      <div className="flex w-full gap-6 justify-between">
        <section className="flex flex-col justify-between gap-2">
          <h2 className="text-text-primary text-base leading-6 font-semibold whitespace-nowrap lg:text-2xl lg:leading-8">
            {participants && participants.length > 0
              ? `${participant?.first_name} ${participant?.last_name}`
              : ""}
          </h2>
          <p className="text-text-secondary max-w-[15ch] truncate text-sm leading-6 sm:line-clamp-2 sm:max-w-full lg:line-clamp-3">
            supposed last message
          </p>
        </section>

        <div className="flex flex-col items-end justify-between gap-2">
          <div className="text-text-inverse bg-background-accent flex size-5 items-center justify-center rounded-full text-xs leading-4 font-medium">
            <p>5</p>
          </div>
          <p className="text-text-secondary text-sm leading-6">1 min ago</p>
        </div>
      </div>
    </Link>
  );
}
