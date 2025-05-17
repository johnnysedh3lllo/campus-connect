"use client";
import { RoleGate } from "../../role-gate";
import { PremiumBanner } from "../../premium-banner";
import { useUserStore } from "@/lib/store/user-store";
import { useGetActiveSubscription } from "@/hooks/tanstack/use-get-active-subscription";
import { useGetPackageRecord } from "@/hooks/tanstack/use-get-package-record";
import { ListingContainerLandlord } from "../../listing-container-landlord";
import { ListingContainerTenant } from "../../listing-container-tenant";

export default function ListingPageBody() {
  const { userId, userRoleId } = useUserStore();

  const { data: activeSubscription } = useGetActiveSubscription(
    userId || undefined,
    userRoleId,
  );

  const { data: currentPackage } = useGetPackageRecord(
    userId || undefined,
    userRoleId,
  );

  return (
    <>
      <RoleGate userRoleId={userRoleId} role="LANDLORD">
        {!activeSubscription && (
          <section className="lg:max-w-screen-max-xl px-4 py-6 sm:px-6 sm:pt-10 sm:pb-6 lg:mx-auto">
            <PremiumBanner
              description="Find the perfect tenants in any location you choose to list & get expert support from us!"
              buttonText="Get Premium"
              href="/plans"
            />
          </section>
        )}
      </RoleGate>

      <RoleGate userRoleId={userRoleId} role="TENANT">
        {!currentPackage && (
          <section className="lg:max-w-screen-max-xl px-4 py-6 sm:px-6 sm:pt-10 sm:pb-6 lg:mx-auto">
            <PremiumBanner
              description="Find the perfect off campus housing in any location Tailored to your preferences"
              buttonText="Upgrade Package"
              href="/packages"
            />
          </section>
        )}
      </RoleGate>

      <section>
        <ListingContainerLandlord />
        <ListingContainerTenant />
      </section>
    </>
  );
}
