"use client";
import { useUser } from "@/hooks/use-user";
import { ProfilePictureUpload } from "./profile-picture-upload";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/app/actions/actions";

export function ProfileHeader() {
  const { data: user } = useUser();
  const userId = user?.id;

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // cache data for 5 minutes
  });

  const firstName: string | null | undefined = userProfile?.first_name;
  const lastName: string | null | undefined = userProfile?.last_name;
  const emailAddress: string | null | undefined = userProfile?.email;
  const avatarUrl = userProfile?.avatar_url;

  if (!userId) return null;

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
