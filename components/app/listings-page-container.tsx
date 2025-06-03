"use client";

import { ListingsCardContainer } from "./listings-card-container";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import {
  useGetListings,
  UseGetListingsType,
} from "@/hooks/tanstack/use-get-listings";
import { ListingsCardGridSkeleton } from "./skeletons/listings-card-grid-skeleton";
import { EmptyPageState } from "./empty-page-state";
import listingIllustration from "@/public/illustrations/illustration-listings.png";

export function ListingsPageContainer({
  pubStatus,
  currStatus,
  userId,
  userRoleId,
  searchTerm,
}: UseGetListingsType) {
  const { ref, inView } = useInView();

  let getListingsProps = {
    currStatus,
    pubStatus,
    searchTerm,
  } as UseGetListingsType;

  if (userId) {
    getListingsProps.userId = userId;
  }

  if (userRoleId) {
    getListingsProps.userRoleId = userRoleId;
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetListings(getListingsProps);

  const listings = data?.pages.flatMap((page) => page?.data ?? []);
  const hasListing = !!listings?.length;

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <>
      {isLoading ? (
        <ListingsCardGridSkeleton />
      ) : hasListing ? (
        <section className="flex w-full flex-col gap-4">
          <ListingsCardContainer listings={listings} />
          <div className="flex justify-center" ref={ref}>
            {isFetchingNextPage && <Loader2 className="size-8 animate-spin" />}
          </div>
        </section>
      ) : (
        <EmptyPageState
          imageSrc={listingIllustration.src}
          title="There are no listings available yet"
        />
      )}
    </>
  );
}

// : (
//   <EmptyPageState
//     imageSrc={listingIllustration.src}
//     title="You have no listings yet"
//     subTitle="Kick start your journey with us by making your first listing. Clicking the button below"
//     button={<CreateListingsButton />}
//   />
// )
