"use client";
import { EmptyPageState } from "../../empty-page-state";
import { Header } from "../../header";
import { ListingsCardGridSkeleton } from "../../skeletons/listings-card-grid-skeleton";
import { PremiumBanner } from "../../premium-banner";
import { useGetPackageRecord } from "@/hooks/tanstack/use-get-package-record";
import { useUserStore } from "@/lib/store/user-store";
import { RoleGate } from "../../role-gate";
import { ListingsPageContainer } from "../../listings-page-container";
import { useGetListings } from "@/hooks/tanstack/use-get-listings";

export function ListingsPageTenant() {
  const { userId, userRoleId } = useUserStore();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetListings({
      pubStatus: "published",
      currStatus: "published",
    });

  const { data: currentPackage } = useGetPackageRecord(
    userId || undefined,
    userRoleId,
  );

  const listingPages = data?.pages;

  return (
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

      <section>
        <Header
          title="Listings"
          subTitle="Search and connect based on your preferences"
        />

        {/* {isLoading ? (
          <ListingsCardGridSkeleton />
        ) : !listingPages || listingPages?.length === 0 ? (
          <div className="flex items-center justify-center px-4 pt-4 pb-8">
            <EmptyPageState
              imageSrc={listingIllustration.src}
              title="There are no listings available yet"
            />
          </div>
        ) : ( */}
        <ListingsPageContainer currStatus="published" pubStatus="published" />
        {/* )} */}
      </section>
    </RoleGate>
  );
}
