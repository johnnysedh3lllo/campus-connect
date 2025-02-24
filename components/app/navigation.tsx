"use client";

// UTILITIES
import { User, UserMetadata } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

// COMPONENTS
import Link from "next/link";
import Image from "next/image";
import { UserMenuBar } from "@/components/app/user-menu-bar";
import { Button } from "../ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "../ui/separator";

// ASSETS
import logoMain from "@/public/logos/logo-primary.svg";
import notificationIcon from "@/public/icons/icon-notifications.svg";
import hamburgerIcon from "@/public/icons/icon-hamburger.svg";
import creditChip from "@/public/icons/icon-credit-chip.svg";
import closeIconNoBorders from "@/public/icons/icon-close-no-borders.svg";

import listingIcon from "@/public/icons/icon-listings.svg";
import inquiriesIcon from "@/public/icons/icon-inquires.svg";
import messagesIcon from "@/public/icons/icon-message.svg";
import profileIcon from "@/public/icons/icon-profile.svg";
import settingsIcon from "@/public/icons/icon-settings.svg";
import logOutIcon from "@/public/icons/icon-log-out.svg";

import { UserPill } from "./user-pill";
import { signOutAction } from "@/app/actions";

export default function Navigation({ user }: { user: User | null }) {
  const pathName = usePathname();
  console.log(pathName);

  const navLinks = [
    { href: "/listings", text: "Listings" },
    { href: "/inquires", text: "Inquires" },
    { href: "/dashboard/messages", text: "Messages" },
    { href: "/profile", text: "Profile" },
  ];

  const navLinksMobile = [
    { href: "/listings", text: "Listings", icon: listingIcon },
    { href: "/inquires", text: "Inquires", icon: inquiriesIcon },
    { href: "/dashboard/messages", text: "Messages", icon: messagesIcon },
    { href: "/profile", text: "Profile", icon: profileIcon },
    { href: "/settings", text: "Settings", icon: settingsIcon },
  ];

  return (
    <nav className="bg-background border-b-foreground/10 sticky top-0 flex h-16 w-full justify-center border-b">
      <div className="flex w-full max-w-screen-2xl items-center justify-between p-4 text-sm lg:px-6 lg:pt-6 lg:pb-0">
        <div className="flex items-center gap-5 font-semibold">
          <Link href={!user ? "/" : "/dashboard"}>
            <Image
              src={logoMain}
              alt="primary campus connect logo"
              width={75}
              height={25}
            />
          </Link>
        </div>

        <ul className="hidden lg:flex lg:gap-6 lg:text-sm lg:leading-6 lg:font-medium">
          {navLinks.map((link) => {
            return (
              <li key={link.text} className="relative lg:pb-3">
                <Link href={link.href}>{link.text}</Link>
                <span
                  className={`bg-primary ${pathName.includes(link.href) ? "opacity-100" : "opacity-0"} absolute bottom-0 left-1/2 block h-0.5 w-4/5 -translate-x-1/2 rounded-xs transition-all duration-300`}
                ></span>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 lg:pb-3">
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            <Image width={24} height={24} alt="credit chip" src={creditChip} />
            <p className="text-sm leading-6 font-medium">800 Credits</p>
          </div>

          <Separator orientation="vertical" className="hidden h-4 lg:block" />

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

          <Sheet>
            <SheetTrigger asChild={true}>
              <Button
                variant={"ghost"}
                className="hover:bg-background-secondary flex h-10 w-10 items-center justify-center rounded-full p-0 lg:hidden"
              >
                <Image
                  src={hamburgerIcon}
                  width={24}
                  height={24}
                  alt="navigation menu icon"
                />
              </Button>
            </SheetTrigger>

            <SheetContent className="h-full w-full p-4 pt-0 sm:w-1/2">
              <SheetHeader className="flex flex-row justify-end gap-4">
                <SheetTitle className="sr-only">navigation menu</SheetTitle>
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

              <div className="flex h-full flex-col justify-between">
                <div className="flex flex-col gap-6">
                  <UserPill
                    userMetaData={user?.user_metadata as UserMetadata}
                  />
                  <Separator />

                  <ul className="flex flex-col overflow-y-auto h-7/10 gap-4">
                    {navLinksMobile.map((link, index) => {
                      return (
                        <li key={index}>
                          <Link
                            className={`flex items-center ${pathName.includes(link.href) ? "bg-background-accent-secondary border-primary border-b-1" : ""} gap-2 px-2 py-3`}
                            href={link.href}
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

          <Separator orientation="vertical" className="hidden h-4 lg:block" />

          <UserMenuBar user={user} />
        </div>
      </div>
    </nav>
  );
}
