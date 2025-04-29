"use client";

// UTILITIES
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { navLinks } from "@/lib/app.config";

// COMPONENTS
import Link from "next/link";
import Image from "next/image";
import { UserMenuBar } from "@/components/app/user-menu-bar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { MobileNav } from "./mobile-nav";

// ASSETS
import logoMain from "@/public/logos/logo-mark-red.svg";
import notificationIcon from "@/public/icons/icon-notifications.svg";

//
import { useUser } from "@/hooks/tanstack/use-user";
import { useUserProfile } from "@/hooks/tanstack/use-user-profile";
import { useUserActiveSubscription } from "@/hooks/tanstack/use-active-subscription";
import BuyCredits from "./buy-credits";
import { useUserCredits } from "@/hooks/tanstack/use-user-credits";
import { useMobileNavState } from "@/lib/store/mobile-nav-state-store";
import { NotificationsIcon } from "@/public/icons/notifications-icon";
import { HamburgerIcon } from "@/public/icons/hamburger-icon";

export default function Navigation() {
  const { data: user } = useUser();
  const userId = user?.id;
  const { data: creditRecord } = useUserCredits(userId);
  const { data: userProfile } = useUserProfile(userId);
  const { data: userActiveSubscription } = useUserActiveSubscription(userId);

  const hasActiveSubscription = !!userActiveSubscription;
  const creditAmount = creditRecord?.remaining_credits;
  const [clicked, setIsClicked] = useState(false);

  const { isMobileNavOpen, setIsMobileNavOpen } = useMobileNavState();

  const pathName = usePathname();
  return (
    <nav className="bg-background border-b-foreground/10 sticky top-0 flex h-16 w-full justify-center border-b">
      <div className="flex w-full max-w-screen-2xl items-center justify-between p-4 text-sm lg:px-6 lg:pt-6 lg:pb-0">
        <div className="flex items-center gap-5 font-semibold">
          <Link href={!user ? "/" : "/listings"}>
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
          {/* {userActiveSubscription ? ( */}
          <BuyCredits
            showBalance
            isClickable
            disabled={hasActiveSubscription}
          />
          {/* ) : ( */}
          {/* <CreditBalanceSkeleton /> */}
          {/* )} */}

          {/* <Separator orientation="vertical" className="hidden h-4 lg:block" /> */}

          {/* TODO: REVISIT THIS DUPLICATION */}
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
