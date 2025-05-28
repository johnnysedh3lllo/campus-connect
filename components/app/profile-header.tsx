"use client";
import { ProfilePictureUpload } from "./profile-picture-upload";
import { ProfileHeaderProps } from "@/types/prop.types";

export function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  const fullName = userProfile?.full_name;
  const emailAddress = userProfile?.email;
  const avatarUrl = userProfile?.avatar_url;
  // const userId = userProfile?.id;

  return (
    <div className="flex flex-1 shrink-0 items-center gap-7 sm:gap-5">
      <ProfilePictureUpload initialAvatarUrl={avatarUrl} />

      <section>
        <h1 className="text-2xl leading-10 font-semibold capitalize sm:text-4xl sm:leading-11">
          {fullName}
        </h1>
        <p className="text-text-secondary text-sm leading-6">{emailAddress}</p>
      </section>
    </div>
  );
}
