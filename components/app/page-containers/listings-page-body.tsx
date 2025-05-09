"use client";
import { Header } from "../header";
import { EmptyPageState } from "../empty-page-state";
import listingIllustration from "@/public/illustrations/illustration-listings.svg";
import { RoleGate } from "../role-gate";
import { PremiumBanner } from "../premium-banner";
import { useUserStore } from "@/lib/store/user-store";
import { useGetActiveSubscription } from "@/hooks/tanstack/use-get-active-subscription";
import { useGetPackageRecord } from "@/hooks/tanstack/use-get-current-package";
import { CreateListingsButton } from "../action-buttons";

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
        <RoleGate userRoleId={userRoleId} role="LANDLORD">
          <Header
            title="Listings"
            subTitle="Here are all the houses you have listed"
            button={<CreateListingsButton />}
          />
          <div className="flex items-center justify-center px-4 pt-4 pb-8">
            <EmptyPageState
              imageSrc={listingIllustration}
              title="You have no listings yet"
              subTitle="Kick start your journey with us by making your first listing. Clicking the button below"
              button={<CreateListingsButton />}
            />
          </div>
        </RoleGate>

        <RoleGate userRoleId={userRoleId} role="TENANT">
          <Header
            title="Listings"
            subTitle="Search and connect based on your preferences"
          />
          <div className="flex items-center justify-center px-4 pt-4 pb-8">
            <EmptyPageState
              imageSrc={listingIllustration}
              title="There are no listings available yet"
            />
          </div>
        </RoleGate>
      </section>
    </>
  );
}
