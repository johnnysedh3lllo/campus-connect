import { CameraIcon } from "@/public/icons/camera-icon";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { UserIcon } from "@/public/icons/user-icon";

export function ProfilePictureUpload() {
  return (
    <Avatar className="items-center justify-center rounded-full bg-gray-100 sm:size-22">
      {/* <AvatarImage src={image} alt="Profile picture" /> */}
      <AvatarFallback className="size-9 bg-transparent sm:size-full">
        <UserIcon />
      </AvatarFallback>

      <div className="bg-background shadow-lg-2 absolute -right-2 -bottom-3 flex size-8 items-center justify-center rounded-full">
        <CameraIcon />
      </div>
    </Avatar>
  );
}
