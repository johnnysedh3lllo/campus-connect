"use client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function MessageHeaderDetails({
  participant,
}: {
  participant: ConvoParticipant["users"] | undefined | null;
}) {
  const chatName = participant
    ? `${participant?.first_name} ${participant?.last_name}`
    : "";

  return (
    <section className="flex items-center gap-4.5">
      <Avatar>
        <AvatarImage
          className="rounded-full"
          src={participant?.avatar_url ?? undefined}
          alt="avatar"
        />
        <AvatarFallback>{participant?.first_name?.[0]}</AvatarFallback>
      </Avatar>
      <h2 className="text-lg font-bold">{chatName}</h2>
    </section>
  );
}
