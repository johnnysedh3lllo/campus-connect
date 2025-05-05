"use client";

import { MobileNavProps } from "@/lib/prop.types";
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
import { UserPill } from "./user-pill";
import { Separator } from "../ui/separator";

import { usePathname } from "next/navigation";
import { navLinksMobile } from "@/lib/app.config";
import Link from "next/link";
import { LogOut } from "@/public/icons/log-out-icon";
import { CreditDisplayCard } from "./credit-display-card";
import { signOut } from "@/app/actions/supabase/onboarding";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import { useMobileNavState } from "@/lib/store/mobile-nav-state-store";
import { RoleGate } from "./role-gate";
import { useUserStore } from "@/lib/store/user-store";

export function MobileNav({ userProfile }: MobileNavProps) {
  const { userRoleId } = useUserStore();

  const pathName = usePathname();
  const { isMobileNavOpen, setIsMobileNavOpen } = useMobileNavState();

  const onClose = () => setIsMobileNavOpen(false);

  const firstName = userProfile?.first_name;
  const lastName = userProfile?.last_name;
  const avatarUrl = userProfile?.avatar_url;

  return (
    <Sheet open={isMobileNavOpen} onOpenChange={onClose}>
      <SheetContent className="h-full w-full p-4 pt-0 sm:w-1/2">
        <SheetHeader className="flex flex-row justify-end gap-4">
          <SheetTitle className="sr-only">mobile navigation menu</SheetTitle>
          <SheetDescription className="sr-only">
            this is the navigation for mobile and tablet
          </SheetDescription>
          {/* <Button
            variant={"ghost"}
            className="hover:bg-background-secondary flex size-10 items-center justify-center rounded-full p-0"
          >
            <NotificationsIcon />
          </Button> */}

          <SheetClose className="hover:bg-background-secondary flex size-10 items-center justify-center rounded-full p-0">
            <CloseIconNoBorders />
          </SheetClose>
        </SheetHeader>

        <div className="mobile-nav-menu flex h-full flex-col gap-6 overflow-y-auto">
          <div className="bg-background sticky top-0 flex flex-col gap-6">
            <UserPill
              firstName={firstName ?? null}
              lastName={lastName ?? null}
              avatarUrl={avatarUrl ?? null}
            />

            <Separator />
          </div>

          <div className="flex h-full flex-col justify-between gap-6">
            <ul className="flex h-fit gap-4 flex-col justify-between">
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

            <RoleGate userRoleId={userRoleId} role="LANDLORD">
              <CreditDisplayCard />
            </RoleGate>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
