"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserProfileCardProps } from "@/types/prop.types";
import { RoleGate } from "./role-gate";

export function UserProfileCard({ participants }: UserProfileCardProps) {
  const participant =
    participants && participants.length > 0 ? participants[0] : null;

  const roleId = +(participant?.users?.role_id ?? 0);
  const firstName = participant?.users?.first_name ?? "";
  const fullName = participant?.users?.full_name ?? "";

  const about = participant?.users?.about ?? "Nil";
  const avatarUrl = participant?.users?.avatar_url ?? undefined;

  return (
    <main className="profile-card-details flex h-[75vh] flex-col gap-6 overflow-y-auto">
      <figure className="flex flex-col items-center gap-6">
        <div className="border-border-secondary rounded-full border p-1">
          <Avatar className="size-32.5 text-2xl">
            <AvatarImage
              className="rounded-full"
              src={avatarUrl}
              alt="avatar"
            />
            <AvatarFallback className="capitalize">{firstName[0]}</AvatarFallback>
          </Avatar>
        </div>

        <p className="text-text-primary text-2xl leading-8 font-semibold">
          {fullName}
        </p>
      </figure>

      <RoleGate userRoleId={roleId} role="TENANT">
        <section className="flex flex-col gap-2">
          <h2 className="text-text-primary text-sm leading-6 font-medium">
            About
          </h2>

          <p className="text-text-secondary text-sm leading-6">{about}</p>
        </section>
      </RoleGate>
    </main>
  );
}
