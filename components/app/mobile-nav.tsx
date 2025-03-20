"use client";

import { MobileNavProps } from "@/lib/component-prop-types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import Image from "next/image";
import { UserPill } from "./user-pill";
import { Separator } from "../ui/separator";

import closeIconNoBorders from "@/public/icons/icon-close-no-borders.svg";
import notificationIcon from "@/public/icons/icon-notifications.svg";

import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/actions";
import { navLinksMobile } from "@/lib/data-storage";
import Link from "next/link";
import { LogOut } from "@/public/icons/log-out-icon";
import { CreditDisplayCard } from "./credit-display-card";

export function MobileNav({ userProfile, isOpen, onClose }: MobileNavProps) {
  const pathName = usePathname();

  const firstName = userProfile?.first_name;
  const lastName = userProfile?.last_name;
  const avatarUrl = userProfile?.avatar_url;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="h-full w-full p-4 pt-0 sm:w-1/2">
        <SheetHeader className="flex flex-row justify-end gap-4">
          <SheetTitle className="sr-only">mobile navigation menu</SheetTitle>
          <SheetDescription className="sr-only">
            this is the navigation for mobile and tablet
          </SheetDescription>
          <Button
            variant={"ghost"}
            className="hover:bg-background-secondary flex size-10 items-center justify-center rounded-full p-0"
          >
            <Image
              src={notificationIcon}
              width={24}
              height={24}
              alt="notification icon"
            />
          </Button>

          <SheetClose className="hover:bg-background-secondary flex size-10 items-center justify-center rounded-full p-0">
            <Image
              src={closeIconNoBorders}
              width={24}
              height={24}
              alt="close nav menu icon"
            />
          </SheetClose>
        </SheetHeader>

        <div className="flex h-full flex-col justify-between gap-6">
          <div className="flex h-full flex-col justify-between gap-6">
            <UserPill
              firstName={firstName ?? null}
              lastName={lastName ?? null}
              avatarUrl={avatarUrl ?? null}
            />

            <Separator />

            <ul className="flex h-full flex-col flex-wrap justify-between">
              {navLinksMobile.map((link, index) => {
                const LinkIcon = link.icon;
                return (
                  <li key={index}>
                    <Link
                      className={`hover:bg-background-secondary flex items-center ${pathName.includes(link.href) ? "bg-background-accent-secondary border-primary text-primary border-b-1" : ""} gap-2 px-2 py-3`}
                      href={link.href}
                      onClick={onClose}
                    >
                      {/* <Image
                        className="text-primary"
                        src={link.icon}
                        width={24}
                        height={24}
                        alt={`${link.text} icon`}
                      /> */}
                      <LinkIcon />
                      {link.text}
                    </Link>
                  </li>
                );
              })}

              <form className="w-full" action={signOut}>
                <Button
                  variant={"ghost"}
                  className="flex h-full w-full cursor-pointer justify-start gap-2 rounded-none px-2 py-3 font-normal"
                  type="submit"
                >
                  <LogOut />
                  <p className="text-sm leading-6">Log Out</p>
                </Button>
              </form>
            </ul>
          </div>

          <CreditDisplayCard />
        </div>
      </SheetContent>
    </Sheet>
  );
}
