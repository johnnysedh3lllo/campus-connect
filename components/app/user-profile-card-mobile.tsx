import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { LeftChevonIcon } from "@/public/icons/left-chevon-icon";
import { UserProfileCard } from "./user-profile-card";

export function UserProfileCardMobile({
  isOpen,
  onClose,
  participants,
}: {
  isOpen: boolean;
  onClose: () => void;
  participants: ConvoParticipant[] | undefined;
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="h-full w-full p-6 pb-0 sm:w-1/2">
        <SheetHeader className="flex w-full flex-row justify-start p-0 sm:justify-end">
          <SheetClose className="hover:bg-background-secondary flex size-10 items-center justify-center rounded-sm sm:hidden">
            <LeftChevonIcon />
          </SheetClose>

          <SheetClose className="hover:bg-background-secondary hidden size-10 items-center justify-center rounded-sm sm:flex">
            <CloseIconNoBorders />
          </SheetClose>
        </SheetHeader>

        <div>
          <SheetTitle className="sr-only">user profile</SheetTitle>
          <SheetDescription className="sr-only">
            this is the user's profile
          </SheetDescription>

          <UserProfileCard participants={participants} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
