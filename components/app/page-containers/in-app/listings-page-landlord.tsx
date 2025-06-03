"use client";
import { Button } from "@/components/ui/button";
import { RoleGate } from "../../role-gate";
import Link from "next/link";
import { PlusIcon } from "@/public/icons/plus-icon";
import { CreateListingsButton } from "../../action-buttons";
import { EmptyPageState } from "../../empty-page-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import listingIllustration from "@/public/illustrations/illustration-listings.png";
import { Header } from "../../header";
import { useUserStore } from "@/lib/store/user-store";
import { PublicationStatusType } from "@/types/form.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetActiveSubscription } from "@/hooks/tanstack/use-get-active-subscription";
import { PremiumBanner } from "../../premium-banner";
import { useGetListings } from "@/hooks/tanstack/use-get-listings";
import { useEffect } from "react";
import { SearchBar } from "../../search-bar";
import { useStore } from "zustand";
import { createSearchStore } from "@/lib/store/search-store";
import { useInView } from "react-intersection-observer";
import { ListingsCardGridSkeleton } from "../../skeletons/listings-card-grid-skeleton";
import { ListingsCardContainer } from "../../listings-card-container";
import { Loader2 } from "lucide-react";

const listingsSearchStore = createSearchStore();
export function ListingsPageLandlord() {
  const { userId, userRoleId } = useUserStore();
  const router = useRouter();
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();

  const searchTerm = useStore(listingsSearchStore, (s) => s.query);
  const setSearchTerm = useStore(listingsSearchStore, (s) => s.setQuery);

  const activeTab = (searchParams.get("tab") ??
    "published") as PublicationStatusType;

  const { data: activeSubscription } = useGetActiveSubscription(
    userId || undefined,
    userRoleId,
  );

  // QUERIES
  const {
    data: publishedListings,
    isLoading: isPublishedLoading,
    hasNextPage: hasNextPublishedPage,
    fetchNextPage: fetchNextPublishedPage,
    isFetchingNextPage: isFetchingNextPublishedPage,
  } = useGetListings({
    currStatus: activeTab,
    pubStatus: "published",
    userId: userId ?? undefined,
    searchTerm: searchTerm,
  });

  const {
    data: unPublishedListings,
    isLoading: isUnpublishedLoading,
    hasNextPage: hasNextUnpublishedPage,
    fetchNextPage: fetchNextUnpublishedPage,
    isFetchingNextPage: isFetchingNextUnpublishedPage,
  } = useGetListings({
    currStatus: activeTab,
    pubStatus: "unpublished",
    userId: userId ?? undefined,
    userRoleId: userRoleId ?? undefined,
    searchTerm: searchTerm,
  });

  const {
    data: draftListings,
    isLoading: isDraftLoading,
    hasNextPage: hasNextDraftPage,
    fetchNextPage: fetchNextDraftPage,
    isFetchingNextPage: isFetchingNextDraftPage,
  } = useGetListings({
    currStatus: activeTab,
    pubStatus: "draft",
    userId: userId ?? undefined,
    userRoleId: userRoleId ?? undefined,
    searchTerm: searchTerm,
  });

  useEffect(() => {
    if (inView && hasNextPublishedPage) {
      fetchNextPublishedPage();
    }
    if (inView && hasNextUnpublishedPage) {
      fetchNextUnpublishedPage();
    }
    if (inView && hasNextDraftPage) {
      fetchNextDraftPage();
    }
  }, [inView, hasNextPublishedPage, hasNextUnpublishedPage, hasNextDraftPage]);

  const publishedListingsData = publishedListings?.pages?.flatMap(
    (page) => page?.data ?? [],
  );
  const unPublishedListingsData = unPublishedListings?.pages?.flatMap(
    (page) => page?.data ?? [],
  );
  const draftListingsData = draftListings?.pages?.flatMap(
    (page) => page?.data ?? [],
  );

  const isAnyLoading =
    isPublishedLoading || isUnpublishedLoading || isDraftLoading;

  const isFetchingNextPage =
    isFetchingNextPublishedPage ||
    isFetchingNextUnpublishedPage ||
    isFetchingNextDraftPage;

  const allQueriesFinished = !isAnyLoading;
  const hasData =
    !!publishedListingsData?.length ||
    !!unPublishedListingsData?.length ||
    !!draftListingsData?.length;

  const tabData = [
    {
      label: "Published",
      value: "published",
      count: publishedListingsData?.length,
      content: publishedListingsData,
      isLoading: isPublishedLoading,
    },
    {
      label: "unpublished",
      value: "unpublished",
      count: unPublishedListingsData?.length,
      content: unPublishedListingsData,
      isLoading: isUnpublishedLoading,
    },
    {
      label: "Drafts",
      value: "draft",
      count: draftListingsData?.length,
      content: draftListingsData,
      isLoading: isDraftLoading,
    },
  ];

  const updateActiveTab = (value: PublicationStatusType) => {
    router.push(`?tab=${value}`);
  };

  return (
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

      <section>
        <Header
          title="Listings"
          subTitle="Here are all the houses you have listed"
        >
          <CreateListingsButton />
        </Header>

        <Tabs
          value={activeTab}
          onValueChange={(value: string) =>
            updateActiveTab(value as PublicationStatusType)
          }
          className="w-full gap-0 pb-6"
        >
          {/* TODO: DEVISE A WAY TO REMOVE ACHIEVE STICKY WITHOUT THIS ARBITRARY top-[105px] */}
          <TabsList className="bg-background-secondary sticky top-[105px] z-20 w-full items-end justify-start gap-3 rounded-none border-b p-0 pt-6 sm:top-[125px]">
            <div className="max-w-screen-max-xl mx-auto w-full">
              <div className="listing-image-preview-container flex h-full w-full max-w-fit items-end gap-3 overflow-x-auto px-4 sm:px-6">
                {tabData.map((tab) => {
                  return (
                    <TabsTrigger
                      className="data-[state=active]:bg-background-accent-secondary focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring hover:bg-background-accent-secondary/50 data-[state=active]:border-text-disabled data-[state=active]:text-text-accent text-text-secondary p-3 capitalize focus-visible:ring-[3px] focus-visible:outline-1"
                      key={tab.value}
                      value={tab.value}
                    >
                      {tab.label} {tab.count ? `(${tab.count})` : "(-)"}
                    </TabsTrigger>
                  );
                })}
              </div>
            </div>
          </TabsList>

          {tabData.map((tab) => {
            const listings = tab.content;
            const hasListings = !!listings?.length;

            return (
              <TabsContent key={`${tab.value}`} value={tab.value}>
                <div
                  className={`max-w-screen-max-xl sticky top-[178px] z-15 mx-auto flex w-full justify-between bg-white px-6 pt-6 pb-2 sm:top-[198px] lg:top-[199px]`}
                >
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

                {isAnyLoading ? (
                  <ListingsCardGridSkeleton />
                ) : allQueriesFinished && hasData ? (
                  <section className="flex w-full flex-col items-center gap-4">
                    {hasListings ? (
                      <ListingsCardContainer listings={listings} />
                    ) : (
                      <div className="flex w-full justify-center p-4">
                        <p className="italic">No listings here yet...</p>
                      </div>
                    )}

                    <div className="flex justify-center" ref={ref}>
                      {isFetchingNextPage && (
                        <Loader2 className="size-8 animate-spin" />
                      )}
                    </div>
                  </section>
                ) : (
                  <EmptyPageState
                    imageSrc={listingIllustration.src}
                    title="You have no listings yet"
                    subTitle="Kick start your journey with us by making your first listing. Clicking the button below"
                    button={<CreateListingsButton />}
                  />
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        <Link href="/listings/create">
          <Button className="fixed right-4 bottom-4 z-20 rounded-md p-4 sm:hidden">
            <PlusIcon />
          </Button>
        </Link>
      </section>
    </RoleGate>
  );
}
