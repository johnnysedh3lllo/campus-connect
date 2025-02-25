"use client";

// UTILITIES
import { User, UserMetadata } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

// COMPONENTS
import Link from "next/link";
import Image from "next/image";
import { UserMenuBar } from "@/components/app/user-menu-bar";
import { Button } from "../ui/button";

import { Separator } from "../ui/separator";

// ASSETS
import logoMain from "@/public/logos/logo-primary.svg";
import notificationIcon from "@/public/icons/icon-notifications.svg";
import hamburgerIcon from "@/public/icons/icon-hamburger.svg";
import creditChip from "@/public/icons/icon-credit-chip.svg";

import { UserPill } from "./user-pill";
import { signOutAction } from "@/app/actions";
import { NavigationProps } from "@/lib/component-prop-types";
import { MobileNav } from "./mobile-nav";
import { useState } from "react";
import { navLinks } from "@/lib/data-storage";

export default function Navigation({ user }: NavigationProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathName = usePathname();
  console.log(pathName);

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

          <Button
            variant={"ghost"}
            className="hover:bg-background-secondary flex h-10 w-10 items-center justify-center rounded-full p-0 lg:hidden"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <Image
              src={hamburgerIcon}
              width={24}
              height={24}
              alt="navigation menu icon"
            />
          </Button>

          <Separator orientation="vertical" className="hidden h-4 lg:block" />
          <MobileNav
            user={user}
            isOpen={isMobileNavOpen}
            onClose={() => setIsMobileNavOpen(false)}
          />
          <UserMenuBar user={user} />
        </div>
      </div>
    </nav>
  );
}
