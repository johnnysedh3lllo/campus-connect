"use client";

import { signOut } from "@/app/actions";
import Image from "next/image";

import type { UserMetadata } from "@supabase/supabase-js";

import Link from "next/link";

import { SettingsIcon } from "@/public/icons/settings-icon";

import iconDown from "@/public/icons/icon-arrow-down.svg";
import { UserPill } from "./user-pill";
import type { UserMenuBarProps } from "@/lib/component-prop-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut } from "@/public/icons/log-out-icon";

export function UserMenuBar({ user, isOpen, onClose }: UserMenuBarProps) {
  const userMetaData = user?.user_metadata as UserMetadata;

  if (user) {
    return (
      <div className="hidden p-0 focus-visible:outline-0 lg:flex lg:items-center lg:gap-2">
        <DropdownMenu onOpenChange={(open) => onClose(!open)}>
          <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 p-0 select-none">
            <UserPill userMetaData={userMetaData} />
            <Image
              className={`${isOpen ? "" : "-rotate-180"} transition-all duration-150`}
              src={iconDown || "/placeholder.svg"}
              width={24}
              height={24}
              alt="chevon icon down"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-40">
            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="flex w-full cursor-pointer items-center gap-2 p-2"
              >
                <SettingsIcon className="size-6" />
                <span className="text-sm leading-6">Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <form className="w-full" action={signOut}>
                <button
                  className="flex w-full cursor-pointer items-center gap-2 p-2"
                  type="submit"
                >
                  <LogOut className="size-6" />
                  <span className="text-sm leading-6">Log Out</span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
