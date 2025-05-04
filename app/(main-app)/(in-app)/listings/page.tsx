"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PlusIcon } from "@/public/icons/plus-icon";
import { Header } from "@/components/app/header";
import { EmptyPageState } from "@/components/app/empty-page-state";
import { fetchListings } from "@/app/actions/supabase/listings";
import listingIllustration from "@/public/illustrations/illustration-listings.svg";
import ListingCard from "@/components/app/listing-card";
import ListingCardSkeleton from "@/components/app/listing-card-skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateModal from "../../../../components/app/listings-create-modal";
import { Button } from "@/components/ui/button";
import { AddIcon } from "@/public/icons/icon-add";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export type ListingType = Listings & { listing_images: ListingsImages[] };

export default function Page() {
  const [activeTab, setActiveTab] = useState("Published");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    staleTime: 1000 * 60 * 5,
  });

  const listings = data?.listings || [];
  const publishedListing = listings.filter(
    (item) => item.publication_status === "published",
  );
  const unpublishedListing = listings.filter(
    (item) => item.publication_status === "unpublished",
  );
  const draftListing = listings.filter(
    (item) => item.publication_status === "draft",
  );

  const openCreateModal = () => setIsCreateOpen(true);

  const tabData = [
    {
      label: "Published",
      count: publishedListing.length,
      content: (
        <>
          {publishedListing.length > 0 ? (
            publishedListing.map((listing) => (
              <ListingCard listing={listing} key={listing.id} />
            ))
          ) : (
            <div>You don't have any published listing</div>
          )}
        </>
      ),
    },
    {
      label: "Unpublished",
      count: unpublishedListing.length,
      content: (
        <>
          {unpublishedListing.length > 0 ? (
            unpublishedListing.map((listing) => (
              <ListingCard listing={listing} key={listing.id} />
            ))
          ) : (
            <div>You don't have any unpublished listing</div>
          )}
        </>
      ),
    },
    {
      label: "Drafts",
      count: draftListing.length,
      content: (
        <>
          {draftListing.length > 0 ? (
            draftListing.map((listing) => (
              <ListingCard listing={listing} key={listing.id} />
            ))
          ) : (
            <div>You don't have any draft</div>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <Header
        title="Listings"
        subTitle="Here are all the houses you have listed"
        buttonText="Create a listing"
        buttonIcon={<PlusIcon />}
        showButton={true}
        onButtonClick={openCreateModal}
      />
      <CreateModal isOpen={isCreateOpen} setOpen={setIsCreateOpen} />

      {isLoading ? (
        <div className="max-w-screen-max-xl mx-auto grid grid-cols-1 justify-items-center gap-4 p-4 pt-6 sm:grid-cols-2 sm:px-12 sm:pt-10 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ListingCardSkeleton key={index} />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex items-center justify-center px-4 pt-4 pb-8">
          <EmptyPageState
            imageSrc={listingIllustration}
            title="You have no listings yet"
            subTitle="Kick start your journey with us by making your first listing. Clicking the button below"
            buttonText="Create a listing"
            buttonIcon={<PlusIcon />}
            showButton={true}
            onButtonClick={() => setIsCreateOpen(false)}
          />
        </div>
      ) : (
        <>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-background-secondary min-h-18 w-full items-end justify-start gap-3 rounded-none border-b px-4 py-0 sm:px-7 md:px-12">
              <div className="max-w-98 h-full flex items-end gap-3 w-full overflow-x-auto listing-image-preview-container">
                {tabData.map((tab) => (
                  <TabsTrigger
                    key={tab.label}
                    value={tab.label}
                    className="data-[state=active]:bg-background-accent-secondary! text-text-secondary! data-[state=active]:text-text-accent! data-[state=active]:border-text-disabled! max-h-12 rounded-t-sm rounded-b-none border-x border-t border-b-0 p-4"
                  >
                    {tab.label} ({tab.count})
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>

            {tabData.map((tab) => (
              <TabsContent key={tab.label} value={tab.label}>
                <div className="max-w-screen-max-xl mx-auto grid grid-cols-1 justify-items-center gap-4 p-4 pt-6 sm:grid-cols-1 sm:px-12 sm:pt-10 md:grid-cols-3 md:justify-items-start">
                  {tab.content}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}

      <Button
        className="fixed right-4 bottom-4 z-20 aspect-square w-14 rounded-md sm:hidden"
        onClick={openCreateModal}
      >
        <AddIcon />
      </Button>
    </>
  );
}
