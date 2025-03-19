"use client";
import { useUser } from "@/hooks/use-user";
import { MessagesIcon } from "@/public/icons/message-icon";
import { ProfileIconSmall } from "@/public/icons/profile-icon-small";

export function ProfileInfo() {
  const { data: user } = useUser();

  const userMetaData = user?.user_metadata;

  const firstName: string = userMetaData?.first_name;
  const lastName: string = userMetaData?.last_name;
  const emailAddress: string = userMetaData?.email;

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
