import { CameraIcon } from "@/public/icons/camera-icon";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { UserIcon } from "@/public/icons/user-icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function ProfilePictureUpload() {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer" asChild>
        <Avatar className="items-center justify-center rounded-full bg-gray-100 sm:size-22">
          {/* <AvatarImage src={image} alt="Profile picture" /> */}
          <AvatarFallback className="size-9 bg-transparent sm:size-full">
            <UserIcon />
          </AvatarFallback>

          <div className="bg-background shadow-lg-2 absolute -right-2 -bottom-3 flex size-8 items-center justify-center rounded-full">
            <CameraIcon />
          </div>
        </Avatar>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div> */}
        <DialogFooter>
          <p>Button</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
