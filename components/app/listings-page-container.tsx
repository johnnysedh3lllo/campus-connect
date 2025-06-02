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

const listingsSearchStore = createSearchStore();

type ListingsPageContainerProps = UseGetListingsType & {
  getCount: (count: number | undefined) => void;
};

export function ListingsPageContainer({
  pubStatus,
  currStatus,
  userId,
  userRoleId,
}: UseGetListingsType) {
  const searchTerm = useStore(listingsSearchStore, (s) => s.query);
  const setSearchTerm = useStore(listingsSearchStore, (s) => s.setQuery);

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

  const isLandlord = hasRole(userRoleId ?? null, "LANDLORD");
  const isStudent = hasRole(userRoleId ?? null, "TENANT");

  return (
    <section className="flex flex-col items-center gap-6">
      <div
        className={`max-w-screen-max-xl sticky z-15 mx-auto flex w-full justify-end bg-white px-6 pt-6 pb-2 ${isLandlord ? "top-[178px] sm:top-[198px] lg:top-[199px]" : "top-[100px] sm:top-[105px]"}`}
      >
        <SearchBar
          collection="listings"
          className="w-full lg:max-w-80"
          query={searchTerm}
          setQuery={setSearchTerm}
        />
      </div>
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
      ) : isStudent ? (
        <EmptyPageState
          imageSrc={listingIllustration.src}
          title="There are no listings available yet"
        />
      ) : (
        <EmptyPageState
          imageSrc={listingIllustration.src}
          title="You have no listings yet"
          subTitle="Kick start your journey with us by making your first listing. Clicking the button below"
          button={<CreateListingsButton />}
        />
      )}
    </section>
  );
}
