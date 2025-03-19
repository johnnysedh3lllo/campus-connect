"use client";

import { getUserProfile, signOut } from "@/app/actions/actions";
import Image from "next/image";

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
import { useQuery } from "@tanstack/react-query";

export function UserMenuBar({ user, isOpen, onClose }: UserMenuBarProps) {
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: () => getUserProfile(user?.id!),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // cache data for 5 minutes
  });

  const firstName: string | null | undefined = userProfile?.first_name;
  const lastName: string | null | undefined = userProfile?.last_name;
  const avatarUrl = userProfile?.avatar_url;

  if (user) {
    return (
      <div className="hidden p-0 focus-visible:outline-0 lg:flex lg:items-center lg:gap-2">
        <DropdownMenu onOpenChange={(open) => onClose(!open)}>
          <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 p-0 select-none">
            <UserPill
              firstName={firstName}
              lastName={lastName}
              avatarUrl={avatarUrl}
            />
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
