"use client";
import { ProfilePictureUpload } from "./profile-picture-upload";
import { ProfileHeaderProps } from "@/lib/prop.types";

export function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  const firstName = userProfile?.first_name;
  const lastName = userProfile?.last_name;
  const emailAddress = userProfile?.email;
  const avatarUrl = userProfile?.avatar_url;
  const userId = userProfile?.id;

  return (
    <div className="flex flex-1 shrink-0 items-center gap-7 sm:gap-5">
      <ProfilePictureUpload userId={userId} initialAvatarUrl={avatarUrl} />

      <section>
        <h1 className="text-2xl leading-10 font-semibold capitalize sm:text-4xl sm:leading-11">
          {firstName} {lastName}
        </h1>
        <p className="text-text-secondary text-sm leading-6">{emailAddress}</p>
      </section>
    </div>
  );
}
