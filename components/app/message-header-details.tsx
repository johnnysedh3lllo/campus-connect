"use client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function MessageHeaderDetails({
  participant,
}: {
  participant: ConvoParticipant["users"] | undefined | null;
}) {
  const chatName = participant ? participant?.full_name : "";

  return (
    <section className="flex items-center gap-4.5">
      <Avatar>
        <AvatarImage
          className="rounded-full"
          src={participant?.avatar_url ?? undefined}
          alt="avatar"
        />
        <AvatarFallback className="capitalize">{participant?.first_name?.[0]}</AvatarFallback>
      </Avatar>
      <h2 className="text-lg capitalize font-bold">{chatName}</h2>
    </section>
  );
}
