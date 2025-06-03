"use client";

import { Separator } from "@/components/ui/separator";
import { BackButton, MessageLandlordButton } from "../../action-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "@/public/icons/user-icon";
import { useGetUserPublic } from "@/hooks/tanstack/use-get-user-public";
import { ListingLandlordProfileSkeleton } from "../../skeletons/listing-landlord-id-page-skeleton";
import { ListingsCardSkeleton } from "../../skeletons/listings-card-skeleton";
import { useGetListings } from "@/hooks/tanstack/use-get-listings";
import { SearchBar } from "../../search-bar";
import { useStore } from "zustand";
import { createSearchStore } from "@/lib/store/search-store";
import ListingCard from "../../listing-card";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const listingsSearchStore = createSearchStore();
export function ListingLandlordIdPageBody({
  landlordId,
}: {
  landlordId: string;
}) {
  const { ref, inView } = useInView();

  const searchTerm = useStore(listingsSearchStore, (s) => s.query);
  const setSearchTerm = useStore(listingsSearchStore, (s) => s.setQuery);

  const { data: landlordProfile, isLoading: isUserProfileLoading } =
    useGetUserPublic(landlordId || undefined);

  const {
    data: listingData,
    isLoading: isPublishedListingsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetListings({
    currStatus: "published",
    pubStatus: "published",
    userId: landlordId,
    searchTerm: searchTerm,
  });

  const fullName = landlordProfile?.full_name;
  const avatarUrl = landlordProfile?.avatar_url;

  const publishedListings = listingData?.pages?.flatMap(
    (page) => page?.data ?? [],
  );
  const hasListings = !!publishedListings?.length;
  const numOfListings = publishedListings?.length;

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <section>
      <section className="max-w-screen-max-xl mx-auto flex w-full gap-3 p-4">
        <BackButton className="flex" route="/listings" />
        <header className="flex flex-col gap-3">
          <h1 className="text-2xl leading-10 font-semibold capitalize sm:text-4xl sm:leading-11">
            Landlord’s Profile
          </h1>
          <p className="text-text-secondary flex gap-2 text-sm leading-6">
            Have a look at this landlord’s property listings
          </p>
        </header>
      </section>
      <Separator />
      <section className="max-w-screen-max-xl mx-auto w-full px-4 py-6 sm:grid sm:grid-cols-[0.75fr_2.25fr] sm:gap-6 sm:py-12 lg:px-10 xl:px-4">
        {isUserProfileLoading ? (
          <ListingLandlordProfileSkeleton />
        ) : (
          <div className="border-line border-b-0.6 lg:border-r-0.6 pb-4 lg:border-b-0 lg:pr-4">
            <div className="sticky top-0 flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="size-22 items-center justify-center overflow-hidden rounded-full bg-gray-100 sm:size-35">
                  <AvatarImage
                    src={avatarUrl ?? undefined}
                    alt="Profile picture"
                  />
                  <AvatarFallback className="size-9 overflow-hidden bg-transparent sm:size-full">
                    <UserIcon className="text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <section className="flex flex-col items-center gap-2">
                  <h3 className="text-text-primary text-2xl leading-8 font-semibold capitalize">
                    {fullName}
                  </h3>

                  <p className="text-text-secondary text-sm leading-6 capitalize">
                    {numOfListings} Properties
                  </p>
                </section>
              </div>

              <Separator className="hidden lg:block" />

              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <MessageLandlordButton landlordId={landlordId} />

                {/* <Link href={`/listings/landlord/${landlordId}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </Link> */}
              </div>
            </div>
          </div>
        )}

        <section className="flex flex-col gap-4 py-6 lg:p-0">
          <div
            className={`max-w-screen-max-xl bg-background sticky -top-[1px] z-15 mx-auto flex w-full flex-col justify-between gap-2 pt-6 pb-2 sm:flex-row sm:items-center`}
          >
            <h2 className="text-text-primary flex-1 text-2xl leading-8 font-semibold">
              Listings
            </h2>
            <SearchBar
              collection="listings"
              className="w-full flex-1 lg:max-w-80"
              query={searchTerm}
              setQuery={setSearchTerm}
            />
          </div>

          {isPublishedListingsLoading ? (
            <div className="max-w-screen-max-xl grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {/* Generate 3 property card skeletons */}
              {Array.from({ length: 3 }).map((_, index) => (
                <ListingsCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="max-w-screen-max-xl mx-auto grid w-full grid-cols-1 justify-items-center gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {publishedListings?.map((listing) => (
                  <ListingCard listing={listing} key={listing.uuid} />
                ))}
              </div>

              <div className="flex justify-center" ref={ref}>
                {isFetchingNextPage && (
                  <Loader2 className="size-8 animate-spin" />
                )}
              </div>
            </>
          )}
        </section>
      </section>
      )
    </section>
  );
}
