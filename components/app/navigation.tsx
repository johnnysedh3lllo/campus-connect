"use client";

// UTILITIES
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/lib/config/app.config";

// COMPONENTS
import Link from "next/link";
import Image from "next/image";
import { UserMenuBar } from "@/components/app/user-menu-bar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { MobileNav } from "./mobile-nav";

// ASSETS
import logoMain from "@/public/logos/logo-mark-red.svg";

//
import { useGetUserPublic } from "@/lib/hooks/tanstack/queries/use-get-user-public";
import { useGetActiveSubscription } from "@/lib/hooks/tanstack/queries/use-get-active-subscription";
import BuyCredits from "./buy-credits";
import { useMobileNavState } from "@/lib/store/ui/mobile-nav-state-store";
import { HamburgerIcon } from "@/public/icons/hamburger-icon";
import { useUserStore } from "@/lib/store/user/user-store";
import { RoleGate } from "./role-gate";

export default function Navigation() {
  const { userId, userRoleId } = useUserStore();
  const { data: userProfile } = useGetUserPublic(userId || undefined);

  const { data: userActiveSubscription } = useGetActiveSubscription(
    userId || undefined,
    userRoleId,
  );

  const hasActiveSubscription = !!userActiveSubscription;
  const [clicked, setIsClicked] = useState(false);

  const { setIsMobileNavOpen } = useMobileNavState();

  const pathName = usePathname();
  return (
    <nav className="bg-background border-b-foreground/10 sticky top-0 z-30 flex h-16 w-full justify-center border-b">
      <div className="flex w-full max-w-screen-2xl items-center justify-between p-4 text-sm lg:px-6 lg:pt-6 lg:pb-0">
        <div className="flex items-center gap-5 font-semibold">
          <Link href="/listings">
            <Image
              src={logoMain}
              alt="primary campus connect logo"
              width={40}
              height={24}
            />
          </Link>
        </div>

        <ul className="hidden lg:flex lg:gap-6 lg:text-sm lg:leading-6 lg:font-medium">
          {navLinks.map((link) => {
            const isCurrentLink = pathName.includes(link.href);
            return (
              <li key={link.text} className="relative lg:pb-3">
                <Link
                  className={`${isCurrentLink ? "text-primary" : ""}`}
                  href={link.href}
                >
                  {link.text}
                </Link>
                <span
                  className={`bg-primary ${isCurrentLink ? "opacity-100" : "opacity-0"} absolute bottom-0 left-1/2 block h-0.5 w-4/5 -translate-x-1/2 rounded-xs transition-all duration-300`}
                ></span>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 lg:pb-3">
          {/* TODO: REVISIT THE HYDRATION ISSUE HERE. */}

          <RoleGate userRoleId={userRoleId} role="LANDLORD">
            <BuyCredits
              showBalance
              isClickable
              disabled={hasActiveSubscription}
            />
          </RoleGate>

          {/* TODO: DEDUPLICATION */}
          {/* IT IS HERE BECAUSE THE NOTIFICATION DISPLAY WOULD BE DIFFERENT ON VIEWPORTS */}
          {/* <Button
            variant={"ghost"}
            className="hover:bg-background-secondary hidden size-10 items-center justify-center rounded-full p-0 lg:flex"
          >
            <NotificationsIcon />
          </Button>

          <Button
            variant={"ghost"}
            className="hover:bg-background-secondary flex size-10 items-center justify-center rounded-full p-0 lg:hidden"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <NotificationsIcon />
          </Button> */}

          <Button
            variant={"ghost"}
            className="hover:bg-background-secondary flex size-10 items-center justify-center rounded-full p-0 lg:hidden"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <HamburgerIcon />
          </Button>

          <Separator orientation="vertical" className="hidden h-4 lg:block" />

          <UserMenuBar
            userProfile={userProfile}
            isOpen={clicked}
            onClose={setIsClicked}
          />
        </div>
      </div>

      <MobileNav userProfile={userProfile} />
    </nav>
  );
}
