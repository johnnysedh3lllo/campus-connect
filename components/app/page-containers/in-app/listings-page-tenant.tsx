"use client";
import { EmptyPageState } from "../../empty-page-state";
import { Header } from "../../header";
import { ListingsCardGridSkeleton } from "../../skeletons/listings-card-grid-skeleton";
import { PremiumBanner } from "../../premium-banner";
import { useGetPackageRecord } from "@/lib/hooks/tanstack/queries/use-get-package-record";
import { useUserStore } from "@/lib/store/user/user-store";
import { RoleGate } from "../../role-gate";
import listingIllustration from "@/public/illustrations/illustration-listings.png";
import { useGetListings } from "@/lib/hooks/tanstack/queries/use-get-listings";
import { SearchBar } from "../../search-bar";
import { useStore } from "zustand";
import { createSearchStore } from "@/lib/store/global/search-store";
import { ListingsCardContainer } from "../../listings-card-container";
import { InfiniteScrollTrigger } from "../../infinite-scroll-trigger";

const listingsSearchStore = createSearchStore();
export function ListingsPageTenant() {
  const { userId, userRoleId } = useUserStore();

  const searchTerm = useStore(listingsSearchStore, (s) => s.query);
  const setSearchTerm = useStore(listingsSearchStore, (s) => s.setQuery);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetListings({
      pubStatus: "published",
      activeStatus: "published",
      searchTerm: searchTerm,
    });

  const listings = data?.pages?.flatMap((page) => page?.data ?? []);
  const hasListings = !!listings?.length;

  const { data: currentPackage } = useGetPackageRecord(
    userId || undefined,
    userRoleId,
  );

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

      <section className="py-6">
        <Header
          title="Listings"
          subTitle="Search and connect based on your preferences"
        />
        <div className="max-w-screen-max-xl sticky top-[100px] z-15 mx-auto flex w-full items-center justify-between bg-white px-6 pt-6 pb-2 sm:top-[105px]">
          <div>
            {searchTerm && (
              <p className="text-sm">
                Showing search results for:{" "}
                <span className="text-base font-medium italic">
                  {searchTerm}
                </span>
              </p>
            )}
          </div>

          <SearchBar
            collection="listings"
            className="w-full lg:max-w-80"
            query={searchTerm}
            setQuery={setSearchTerm}
          />
        </div>

        {isLoading ? (
          <ListingsCardGridSkeleton />
        ) : hasListings ? (
          <section className="flex w-full flex-col items-center gap-4 pt-4">
            <ListingsCardContainer listings={listings} />

            {hasNextPage && (
              <InfiniteScrollTrigger
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                type="button"
              />
            )}
          </section>
        ) : (
          <div className="flex items-center justify-center px-4 pt-4 pb-8">
            <EmptyPageState
              imageSrc={listingIllustration.src}
              title="There are no listings available yet"
            />
          </div>
        )}
      </section>
    </RoleGate>
  );
}
