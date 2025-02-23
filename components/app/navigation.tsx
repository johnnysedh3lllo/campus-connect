"use client";

// UTILITIES
import { User } from "@supabase/supabase-js";

// COMPONENTS
import Link from "next/link";
import Image from "next/image";
import { UserMenuBar } from "@/components/app/user-menu-bar";
import { Button } from "../ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// ASSETS
import logoMain from "@/public/logos/logo-primary.svg";
import notificationIcon from "@/public/icons/icon-notifications.svg";
import hamburgerIcon from "@/public/icons/icon-hamburger.svg";
import verticalLine from "@/public/icons/icon-v-line.svg";
import creditChip from "@/public/icons/icon-credit-chip.svg";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";

export default function Navigation({ user }: { user: User | null }) {
  const pathName = usePathname();
  console.log(pathName);

  const navLinks = [
    { href: "/listings", text: "Listings" },
    { href: "/inquires", text: "Inquires" },
    { href: "/dashboard/messages", text: "Messages" },
    { href: "/profile", text: "Profile" },
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
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription className="text-foreground">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Separator orientation="vertical" className="hidden h-4 lg:block" />

          <UserMenuBar user={user} />
        </div>
      </div>
    </nav>
  );
}
