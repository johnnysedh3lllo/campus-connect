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

import { createSearchStore } from "@/lib/store/search-store";
import { useStore } from "zustand";
import { SearchBar } from "./search-bar";

import { EmptyPageState } from "./empty-page-state";
import listingIllustration from "@/public/illustrations/illustration-listings.png";
import { hasRole } from "@/lib/utils";
import { CreateListingsButton } from "./action-buttons";

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

  const listingPages = data?.pages;

  const hasListingPages = !!(listingPages?.length && listingPages[0]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <section className="flex flex-col items-center gap-6">
      {isLoading ? (
        <ListingsCardGridSkeleton />
      ) : hasListingPages ? (
        <section className="flex w-full flex-col gap-4">
          {listingPages?.map((page, index) => {
            const pageData = page?.data;

            return <ListingsCardContainer key={index} pageData={pageData} />;
          })}

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
    </section>
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
