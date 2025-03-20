"use client";
import { ProfileInfoProps } from "@/lib/component-prop-types";
import { MessagesIcon } from "@/public/icons/message-icon";
import { ProfileIconSmall } from "@/public/icons/profile-icon-small";

export function ProfileInfo({ userProfile }: ProfileInfoProps) {
  const firstName = userProfile?.first_name;
  const lastName = userProfile?.last_name;
  const emailAddress = userProfile?.email;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <ProfileIconSmall />
        <h2 className="text-sm leading-6 capitalize">
          {firstName} {lastName}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <MessagesIcon />
        <p className="text-sm leading-6">{emailAddress}</p>
      </div>
    </section>
  );
}
