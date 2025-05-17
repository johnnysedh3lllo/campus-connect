"use client";
import { UserIcon } from "@/public/icons/user-icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { MessageLandlordButton } from "./action-buttons";
import { BadgeIcon } from "@/public/illustrations/badge-icon";
import { ModalProps } from "@/lib/prop.types";
import { useState } from "react";
import Modal from "./modals/modal";
import { useGetPackageRecord } from "@/hooks/tanstack/use-get-package-record";
import { useUserStore } from "@/lib/store/user-store";

export function ListingLandlordProfileCard({
  landlord,
}: {
  landlord:
    | Pick<
        UserPublic,
        "id" | "first_name" | "last_name" | "role_id" | "avatar_url"
      >
    | undefined;
}) {
  const landlordId = landlord?.id;
  const landlordName = `${landlord?.first_name} ${landlord?.last_name}`;
  const landlordAvatarUrl = landlord?.avatar_url;

  return (
    <section className="border-line flex flex-col gap-4 rounded-md border p-4">
      <div className="flex items-center gap-4 lg:flex-col">
        <Avatar className="size-16 items-center justify-center overflow-hidden rounded-full bg-gray-100">
          <AvatarImage
            src={landlordAvatarUrl || undefined}
            alt="Profile picture"
          />
          <AvatarFallback className="size-9 overflow-hidden bg-transparent sm:size-full">
            <UserIcon className="text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <section className="flex flex-col lg:items-center">
          <h3 className="text-text-primary text-2xl leading-8 font-semibold capitalize">
            {landlordName}
          </h3>

          <p className="text-text-secondary text-sm leading-6">Landlord</p>
        </section>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
        <MessageLandlordButton landlordId={landlordId} />

        <Link href={`/listings/landlord/${landlordId}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
      </div>
    </section>
  );
}
