"use client";
import { useUserStore } from "@/lib/store/user-store";
import { EmptyPageState } from "./empty-page-state";
import { Header } from "./header";
import { RoleGate } from "./role-gate";
import listingIllustration from "@/public/illustrations/illustration-listings.png";

export function ListingContainerTenant() {
  const { userId, userRoleId } = useUserStore();

  return (
    <RoleGate userRoleId={userRoleId} role="TENANT">
      <Header
        title="Listings"
        subTitle="Search and connect based on your preferences"
      />
      <div className="flex items-center justify-center px-4 pt-4 pb-8">
        <EmptyPageState
          imageSrc={listingIllustration.src}
          title="There are no listings available yet"
        />
      </div>
    </RoleGate>
  );
}
