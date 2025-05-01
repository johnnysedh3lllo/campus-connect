"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserProfileCardProps } from "@/lib/prop.types";

export function UserProfileCard({ participants }: UserProfileCardProps) {
  const participant =
    participants && participants.length > 0 ? participants[0] : null;

  return (
    <main className="profile-card-details flex h-[75vh] flex-col gap-6 overflow-y-auto">
      <figure className="flex flex-col items-center gap-6">
        <Avatar className="size-32.5 text-2xl">
          <AvatarImage src="" alt="avatar" />
          <AvatarFallback>{participant?.users?.first_name?.[0]}</AvatarFallback>
        </Avatar>

        <p className="text-text-primary text-2xl leading-8 font-semibold">
          {participant?.users?.first_name} {participant?.users?.last_name}
        </p>
      </figure>

      <div className="">
        <section className="flex flex-col gap-2">
          <h2 className="text-text-primary text-sm leading-6 font-medium">
            About
          </h2>

          <p className="text-text-secondary text-sm leading-6">
            Student of the Harvard university, Currently studying Architecture,
            im easing going, love to play chess and i enjoy cycling in my free
            time.
          </p>
        </section>
      </div>
    </main>
  );
}
