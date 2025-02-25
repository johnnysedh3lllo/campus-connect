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
import { UserMetadata } from "@supabase/supabase-js";
import { UserPill } from "./user-pill";
import { Separator } from "../ui/separator";

import logOutIcon from "@/public/icons/icon-log-out.svg";
import closeIconNoBorders from "@/public/icons/icon-close-no-borders.svg";
import creditChip from "@/public/icons/icon-credit-chip.svg";
import notificationIcon from "@/public/icons/icon-notifications.svg";

import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/actions";
import { navLinksMobile } from "@/lib/data-storage";
import Link from "next/link";

export function MobileNav({ user, isOpen, onClose }: MobileNavProps) {
  const pathName = usePathname();

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
            className="hover:bg-background-secondary flex h-10 w-10 items-center justify-center rounded-full p-0"
          >
            <Image
              src={notificationIcon}
              width={24}
              height={24}
              alt="notification icon"
            />
          </Button>

          <SheetClose className="hover:bg-background-secondary flex h-10 w-10 items-center justify-center rounded-full p-0">
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
            <UserPill userMetaData={user?.user_metadata as UserMetadata} />
            <Separator />

            <ul className="flex h-full flex-col flex-wrap justify-between">
              {navLinksMobile.map((link, index) => {
                return (
                  <li key={index}>
                    <Link
                      className={`hover:bg-background-secondary flex items-center ${pathName.includes(link.href) ? "bg-background-accent-secondary border-primary text-primary border-b-1" : ""} gap-2 px-2 py-3`}
                      href={link.href}
                      onClick={onClose}
                    >
                      <Image
                        src={link.icon}
                        width={24}
                        height={24}
                        alt={`${link.text} icon`}
                      />
                      {link.text}
                    </Link>
                  </li>
                );
              })}

              <form className="w-full" action={signOutAction}>
                <Button
                  variant={"ghost"}
                  className="flex h-full w-full cursor-pointer justify-start gap-2 rounded-none px-2 py-3 font-normal"
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
            </ul>
          </div>

          <div className="border-border flex flex-col gap-6 rounded-md border-1 p-4">
            <div className="flex items-start gap-3">
              <Image
                className="h-11 w-11"
                width={24}
                height={24}
                alt="credit chip"
                src={creditChip}
              />
              <section className="flex flex-col gap-2">
                <h2 className="text-2xl leading-8 font-semibold">
                  Credits: 800
                </h2>

                <p className="text-sm leading-6">
                  Get credits to boost listings and connect with tenants!
                </p>
              </section>
            </div>
            <Button className="w-full p-6 text-base">Buy Credits</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
