import { UserPillProps } from "@/types/prop.types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserIcon } from "@/public/icons/user-icon";

export function UserPill({ name, avatarUrl }: UserPillProps) {
  return (
    <figure className="flex items-center gap-2">
      <Avatar className="size-10 items-center justify-center overflow-hidden rounded-full bg-gray-100">
        <AvatarImage src={avatarUrl || undefined} alt="Profile picture" />
        <AvatarFallback className="size-9 overflow-hidden bg-transparent sm:size-full">
          <UserIcon className="text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <p className="text-sm leading-6 font-medium capitalize">{name}</p>
    </figure>
  );
}
