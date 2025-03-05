"use client";

import { useProfileViewStore } from "@/lib/store/profile-view-store";
import { Button } from "./button";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";

export function UserProfileCardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isProfileOpen, closeProfile } = useProfileViewStore();

  return (
    <div
      className={`absolute inset-y-0 right-0 hidden w-3/10 px-4 py-6 transition-transform duration-300 lg:flex lg:flex-col lg:gap-4 ${isProfileOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <header className="flex w-full justify-end">
        <Button
          onClick={closeProfile}
          variant={"ghost"}
          className="hover:bg-background-secondary hidden size-10 items-center justify-center rounded-sm sm:flex"
        >
          <CloseIconNoBorders />
        </Button>
      </header>

      {children}
    </div>
  );
}
