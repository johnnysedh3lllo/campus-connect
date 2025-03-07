import { UserMetadata } from "@supabase/supabase-js";

type UserPillProps = {
  userMetaData: UserMetadata;
};

export function UserPill({ userMetaData }: UserPillProps) {
  return (
    <figure className="flex items-center gap-2">
      <div className="bg-background-secondary size-10 rounded-full border-0" />
      <p className="text-sm leading-6 font-medium capitalize">{`${userMetaData.first_name} ${userMetaData.last_name}`}</p>
    </figure>
  );
}
