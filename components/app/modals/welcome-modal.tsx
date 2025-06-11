"use client";

import { ModalProps } from "@/types/prop.types";
import { Button } from "../../ui/button";
import Image from "next/image";
import { PlusIcon } from "@/public/icons/plus-icon";
import welcomeIllustration from "@/public/illustrations/welcome-illustration.png";
import { ChevronRightIcon } from "@/public/icons/chevron-right-icon";
import { useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/lib/store/user/user-store";
import { RoleGate } from "../role-gate";
import Modal from "./modal";

export function WelcomeModal() {
  const { userRoleId } = useUserStore();
  const [open, setOpen] = useState<boolean>(false);

  const LandlordWelcomeModalProps: ModalProps = {
    modalId: "welcome",
    variant: "default",
    title: "Welcome",
    description:
      "Easily list your properties, connect with tenants, and manage rentals hassle-free.",
    modalImage: (
      <Image
        src={welcomeIllustration.src}
        width={welcomeIllustration.width}
        height={welcomeIllustration.height}
        alt="welcome illustration"
      />
    ),
    clearParamAfterOpen: true,
    open: open,
    setOpen: setOpen,
  };

  const StudentWelcomeModalProps: ModalProps = {
    modalId: "welcome",
    variant: "default",
    title: "Welcome",
    description:
      "Check out the various luxury yet affordable apartments we have on Campus Connect.",
    modalImage: (
      <Image
        src={welcomeIllustration.src}
        width={welcomeIllustration.width}
        height={welcomeIllustration.height}
        alt="welcome illustration"
      />
    ),
    clearParamAfterOpen: true,
    open: open,
    setOpen: setOpen,
  };

  return (
    <>
      <RoleGate userRoleId={userRoleId} role="LANDLORD">
        <Modal {...LandlordWelcomeModalProps}>
          <div className="flex w-full flex-col gap-6">
            <Link href="/listings/create" className="w-full">
              <Button
                onClick={() => setOpen(false)}
                className="hidden h-full w-full cursor-pointer gap-3 px-7.5 py-3 text-base leading-6 sm:flex"
              >
                <p>Create a listing</p>
                {<PlusIcon />}
              </Button>
            </Link>

            <div className="flex flex-col items-center gap-2">
              <p className="text-text-primary text-sm leading-6">
                Not ready yet?
              </p>

              <Link href="/profile" className="w-fit">
                <Button
                  onClick={() => setOpen(false)}
                  className="text-text-accent flex gap-3 text-base leading-6"
                  variant="link"
                >
                  Go to Dashboard
                  <ChevronRightIcon />
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      </RoleGate>

      <RoleGate userRoleId={userRoleId} role="TENANT">
        <Modal {...StudentWelcomeModalProps}>
          <Link href="/listings" className="w-full">
            <Button
              onClick={() => setOpen(false)}
              className="hidden h-full w-full cursor-pointer gap-3 px-7.5 py-3 text-base leading-6 sm:flex"
            >
              <p>Go to Listings</p>
              <ChevronRightIcon />
            </Button>
          </Link>
        </Modal>
      </RoleGate>
    </>
  );
}
