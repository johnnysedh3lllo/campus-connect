"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PlusIcon } from "@/public/icons/plus-icon";
import { Header } from "@/components/app/header";
import { EmptyPageState } from "@/components/app/empty-page-state";
import { getListings } from "@/app/actions/actions";
import listingIllustration from "@/public/illustrations/illustration-listings.svg";
import ListingCard from "@/components/app/listing-card";
import ListingCardSkeleton from "@/components/app/listing-card-skeleton";

// Types can be moved to a separate file like types/listing.ts
export type ListingType = {
  id: number;
  created_at: string;
  description: string | null;
  home_type: "condo" | "apartment" | null;
  landlord_id: string | null;
  location: string | null;
  no_of_bedrooms: number | null;
  price: number | null;
  payment_frequency: string | null;
  listing_images: { id: number; image_url: string }[];
  uuid: string;
};

// Tab component to reduce duplication
const Tab = ({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    className={`text-text-secondary cursor-pointer p-3 select-none ${
      isActive
        ? "border-x-text-disabled border-t-text-disabled bg-background-accent-secondary !text-text-accent rounded-t-sm border-x border-t"
        : ""
    }`}
    onClick={onClick}
  >
    {label} ({count})
  </button>
);

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Published");

  const { data, isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: getListings,
    staleTime: 1000 * 60 * 5,
  });

  const listings = data?.listings || [];

  const goToCreateListing = () => router.push("/listings/create");

  const tabData = [
    {
      label: "Published",
      count: listings.length,
      content: (
        <>
          {listings.map((listing: ListingType) => (
            <ListingCard listing={listing} key={listing.id} />
          ))}
        </>
      ),
    },
    {
      label: "Unpublished",
      count: 0,
      content: <div className="p-4">No unpublished listings</div>,
    },
    {
      label: "Drafts",
      count: 0,
      content: <div className="p-4">No drafts</div>,
    },
  ];

  const activeTabContent = tabData.find(
    (tab) => tab.label === activeTab,
  )?.content;

  return (
    <>
      <Header
        title="Listings"
        subTitle="Here are all the houses you have listed"
        buttonText="Create a listing"
        buttonIcon={<PlusIcon />}
        showButton={true}
        onButtonClick={goToCreateListing}
      />

      {isLoading ? (
        <div className="max-w-screen-max-xl mx-auto grid grid-cols-1 gap-4 p-4 pt-6 sm:grid-cols-2 sm:px-12 sm:pt-10 md:grid-cols-3">
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
            onButtonClick={goToCreateListing}
          />
        </div>
      ) : (
        <>
          <div className="bg-background-secondary flex min-h-18 w-full items-end justify-start gap-3 border-b px-4 sm:px-12">
            {tabData.map((tab) => (
              <Tab
                key={tab.label}
                label={tab.label}
                count={tab.count}
                isActive={activeTab === tab.label}
                onClick={() => setActiveTab(tab.label)}
              />
            ))}
          </div>
          <div className="max-w-screen-max-xl mx-auto grid grid-cols-1 gap-4 p-4 pt-6 sm:grid-cols-2 sm:px-12 sm:pt-10 md:grid-cols-3">
            {activeTabContent}
          </div>
        </>
      )}
    </>
  );
}
