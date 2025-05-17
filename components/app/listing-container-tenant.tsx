"use client";
import { useUserStore } from "@/lib/store/user-store";
import { EmptyPageState } from "./empty-page-state";
import { Header } from "./header";
import { RoleGate } from "./role-gate";
import listingIllustration from "@/public/illustrations/illustration-listings.png";
import { useGetPublishedListings } from "@/hooks/tanstack/use-get-published-listings";
import { ListingsCardGridSkeleton } from "./skeletons/listings-card-grid-skeleton";
import ListingCard from "./listing-card";

export function ListingContainerTenant() {
  const { userId, userRoleId } = useUserStore();

  const { data, isLoading } = useGetPublishedListings();

  const publishedListings = data?.data;

  return (
    <RoleGate userRoleId={userRoleId} role="TENANT">
      <Header
        title="Listings"
        subTitle="Search and connect based on your preferences"
      />

      {isLoading ? (
        <ListingsCardGridSkeleton />
      ) : !publishedListings || publishedListings?.length === 0 ? (
        <div className="flex items-center justify-center px-4 pt-4 pb-8">
          <EmptyPageState
            imageSrc={listingIllustration.src}
            title="There are no listings available yet"
          />
        </div>
      ) : (
        <div className="max-w-screen-max-xl mx-auto grid grid-cols-1 justify-items-center gap-4 px-4 py-6 sm:grid-cols-2 sm:px-12 lg:grid-cols-3 xl:grid-cols-4">
          {publishedListings?.map((listing) => (
            <ListingCard listing={listing} key={listing.uuid} />
          ))}
        </div>
      )}
    </RoleGate>
  );
}
