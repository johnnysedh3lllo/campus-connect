"use client";
import { Button } from "@/components/ui/button";
import { RoleGate } from "../../role-gate";
import Link from "next/link";
import { PlusIcon } from "@/public/icons/plus-icon";
import { CreateListingsButton } from "../../action-buttons";
import { EmptyPageState } from "../../empty-page-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "../../header";
import { useUserStore } from "@/lib/store/user-store";
import { useGetPublishedListings } from "@/hooks/tanstack/use-get-published-listings";
import { useGetUnpublishedListings } from "@/hooks/tanstack/use-get-unpublished-listings";
import { useGetDraftListings } from "@/hooks/tanstack/use-get-draft-listings";
import ListingCard from "../../listing-card";
import listingIllustration from "@/public/illustrations/illustration-listings.png";
import { PublicationStatusType } from "@/lib/form.types";
import { useRouter, useSearchParams } from "next/navigation";
import { ListingsCardGridSkeleton } from "../../skeletons/listings-card-grid-skeleton";
import { useGetActiveSubscription } from "@/hooks/tanstack/use-get-active-subscription";
import { PremiumBanner } from "../../premium-banner";

export function ListingsPageLandlord() {
  const { userId, userRoleId } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = (searchParams.get("tab") ??
    "published") as PublicationStatusType;

  const { data: activeSubscription } = useGetActiveSubscription(
    userId || undefined,
    userRoleId,
  );

  const { data: publishedListings, isLoading: isPublishedLoading } =
    useGetPublishedListings(userId || undefined, activeTab);

  const { data: unPublishedListings, isLoading: isUnpublishedLoading } =
    useGetUnpublishedListings(userId || undefined, userRoleId, activeTab);

  const { data: draftListings, isLoading: isDraftLoading } =
    useGetDraftListings(userId || undefined, userRoleId, activeTab);

  const publishedListingsData = publishedListings?.data;
  const unPublishedListingsData = unPublishedListings?.data;
  const draftListingsData = draftListings?.data;

  const isAnyLoading =
    isPublishedLoading || isUnpublishedLoading || isDraftLoading;

  const allQueriesFinished = !isAnyLoading;
  const allTabsEmpty =
    (!publishedListingsData || publishedListingsData.length === 0) &&
    (!unPublishedListingsData || unPublishedListingsData.length === 0) &&
    (!draftListingsData || draftListingsData.length === 0);

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
          className="w-full gap-6 pb-6"
        >
          {/* TODO: DEVISE A WAY TO REMOVE ACHIEVE STICKY WITHOUT THIS ARBITRARY top-[105px] */}
          <TabsList className="bg-background-secondary sticky top-[105px] z-20 w-full items-end justify-start gap-3 rounded-none border-b p-0 pt-6 sm:top-[125px]">
            <div className="max-w-screen-max-xl mx-auto w-full">
              <div className="listing-image-preview-container flex h-full w-full max-w-fit items-end gap-3 overflow-x-auto px-4 sm:px-6">
                {tabData.map((tab) => (
                  <TabsTrigger
                    className="cursor-pointer capitalize"
                    key={tab.value}
                    value={tab.value}
                  >
                    {tab.label} {tab.count ? `(${tab.count})` : "(-)"}
                  </TabsTrigger>
                ))}
              </div>
            </div>
          </TabsList>

          {isAnyLoading ? (
            <ListingsCardGridSkeleton />
          ) : allQueriesFinished && allTabsEmpty ? (
            <div className="flex items-center justify-center px-4 pt-4 pb-8">
              <EmptyPageState
                imageSrc={listingIllustration.src}
                title="You have no listings yet"
                subTitle="Kick start your journey with us by making your first listing. Clicking the button below"
                button={<CreateListingsButton />}
              />
            </div>
          ) : (
            tabData.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.content && tab.content.length > 0 ? (
                  <div className="max-w-screen-max-xl mx-auto grid grid-cols-1 justify-items-center gap-4 px-4 sm:grid-cols-2 sm:px-12 lg:grid-cols-3 xl:grid-cols-4">
                    {tab.content.map((listing) => (
                      <ListingCard listing={listing} key={listing.uuid} />
                    ))}
                  </div>
                ) : (
                  <div className="max-w-screen-max-xl mx-auto w-full text-center">
                    <p className="">You don't have any listings here</p>
                  </div>
                )}
              </TabsContent>
            ))
          )}
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
