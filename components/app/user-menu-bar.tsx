"use client";

import { signOutAction } from "@/app/actions";
import { Button } from "../ui/button";
import { userRoles, UserRoles } from "@/lib/data-storage";
import Image from "next/image";

import { User, UserMetadata } from "@supabase/supabase-js";

import Link from "next/link";

import settingsIcon from "@/public/icons/icon-settings.svg";
import logOutIcon from "@/public/icons/icon-log-out.svg";
import iconDown from "@/public/icons/icon-arrow-down.svg";

import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";
import { MenubarItem } from "@radix-ui/react-menubar";
import { useState } from "react";
import { UserPill } from "./user-pill";

export function UserMenuBar({ user }: { user: User | null }) {
  const [clicked, setClicked] = useState(false);

  const userMetaData = user?.user_metadata as UserMetadata;

  function handleMenuClick() {
    setClicked(!clicked);
  }

  if (user) {
    return (
      <div className="hidden lg:flex lg:items-center lg:gap-2">
        <Menubar className="p-0">
          <MenubarMenu>
            <MenubarTrigger
              onClick={handleMenuClick}
              className="flex cursor-pointer items-center gap-2 p-0"
            >
              <UserPill userMetaData={userMetaData} />

              <Image
                className={`${clicked ? "-rotate-180" : ""} transition-all duration-150`}
                src={iconDown}
                width={24}
                height={24}
                alt="chevon icon down"
              />
            </MenubarTrigger>

            <MenubarContent className="flex max-w-40 flex-col items-start gap-1">
              <MenubarItem className="w-full outline-0">
                <Button
                  variant={"ghost"}
                  className="flex w-full justify-start p-2"
                >
                  <Link
                    className="flex items-start gap-2"
                    href="/dashboard/settings"
                    type="submit"
                  >
                    <Image
                      src={settingsIcon}
                      width={24}
                      height={24}
                      alt="settings icon"
                    />
                    <p className="text-sm leading-6">Settings</p>
                  </Link>
                </Button>
              </MenubarItem>

              <form className="w-full" action={signOutAction}>
                <Button
                  variant={"ghost"}
                  className="flex w-full cursor-pointer justify-start gap-2 p-2"
                  type="submit"
                >
                  <Image
                    src={logOutIcon}
                    width={24}
                    height={24}
                    alt="log out icon"
                  />
                  <p className="text-sm leading-6">Log Out</p>
                </Button>
              </form>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    );
  } else {
    return (
      <div className="flex gap-2">
        <p>user not logged in</p>
      </div>
    );
  }
}
