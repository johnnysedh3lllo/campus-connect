"use client";
import { Button } from "@/components/ui/button";
import { RoleGate } from "../role-gate";
import Link from "next/link";
import { PlusIcon } from "@/public/icons/plus-icon";
import { CreateListingsButton } from "../action-buttons";
import { EmptyPageState } from "../empty-page-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "../header";
import { useUserStore } from "@/lib/store/user-store";
import { useState } from "react";
import { useGetPublishedListings } from "@/hooks/tanstack/use-get-published-listings";
import { useGetUnpublishedListings } from "@/hooks/tanstack/use-get-unpublished-listings";
import { useGetDraftListings } from "@/hooks/tanstack/use-get-draft-listings";
import ListingCard from "../listing-card";
import listingIllustration from "@/public/illustrations/illustration-listings.svg";
import { PublicationStatusType } from "@/lib/form.types";
import { useRouter, useSearchParams } from "next/navigation";

export function ListingContainerLandlord() {
  const { userId, userRoleId } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = (searchParams.get("tab") ??
    "published") as PublicationStatusType;

  const { data: publishedListings, isLoading: isPublishedLoading } =
    useGetPublishedListings(userId || undefined, activeTab);

  const { data: unPublishedListings, isLoading: isUnpublishedLoading } =
    useGetUnpublishedListings(userId || undefined, userRoleId, activeTab);

  const { data: draftListings, isLoading: isDraftLoading } =
    useGetDraftListings(userId || undefined, userRoleId, activeTab);

  const publishedListingsData = publishedListings?.data;
  const unPublishedListingsData = unPublishedListings?.data;
  const draftListingsData = draftListings?.data;

  const hasPublishedListings =
    publishedListingsData && publishedListingsData.length > 0;
  const hasUnPublishedListings =
    unPublishedListingsData && unPublishedListingsData.length > 0;
  const hasDraftListings = draftListingsData && draftListingsData.length > 0;

  const hasListings =
    hasPublishedListings || hasUnPublishedListings || hasDraftListings;

  const tabData = [
    {
      label: "Published",
      value: "published",
      count: publishedListingsData?.length,
      content: publishedListingsData,
      isLoading: isPublishedLoading,
    },
    {
      label: "unPublished",
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
      <Header
        title="Listings"
        subTitle="Here are all the houses you have listed"
      >
        <CreateListingsButton />
      </Header>

      <>
        {hasListings ? (
          <Tabs
            value={activeTab}
            onValueChange={(value: string) =>
              updateActiveTab(value as PublicationStatusType)
            }
            className="w-full gap-6 pb-6"
          >
            {/* TODO: DEVISE A WAY TO REMOVE ACHIEVE STICKY WITHOUT THIS ARBITRARY top-[125px] */}
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

            {tabData.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.isLoading ? (
                  <div className="max-w-screen-max-xl mx-auto w-full text-center">
                    <p className="">Loading.....</p>
                  </div>
                ) : tab.content && tab.content.length > 0 ? (
                  <div className="max-w-screen-max-xl mx-auto grid grid-cols-1 justify-items-center gap-4 px-4 sm:grid-cols-2 sm:px-12 md:grid-cols-3 lg:grid-cols-4">
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
            ))}
          </Tabs>
        ) : (
          <div className="flex items-center justify-center px-4 pt-4 pb-8">
            <EmptyPageState
              imageSrc={listingIllustration}
              title="You have no listings yet"
              subTitle="Kick start your journey with us by making your first listing. Clicking the button below"
              button={<CreateListingsButton />}
            />
          </div>
        )}
      </>

      <Link href="/listings/create">
        <Button className="fixed right-4 bottom-4 z-20 rounded-md p-4 sm:hidden">
          <PlusIcon />
        </Button>
      </Link>
    </RoleGate>
  );
}
