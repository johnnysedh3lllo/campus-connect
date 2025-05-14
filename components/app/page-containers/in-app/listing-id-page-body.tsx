"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetListingByUUID } from "@/hooks/tanstack/use-get-listing-by-uuid";
import { BinStrokeIcon } from "@/public/icons/bin-stroke-icon";
import { EditIcon } from "@/public/icons/edit-icon";
import { KabobIcon } from "@/public/icons/kabob-icon";
import { LocationIcon } from "@/public/icons/location-icon";
import listingIllustration from "@/public/illustrations/illustration-listings.png";
import { useEffect, useState } from "react";
import Modal from "../../modals/modal";
import { ModalProps } from "@/lib/prop.types";
import Image from "next/image";
import { useUserStore } from "@/lib/store/user-store";
import { BackButton, ChangeListingPubStatusButton } from "../../action-buttons";
import { statusVerbMap } from "@/lib/app.config";
import { Separator } from "@/components/ui/separator";
import { BedIcon } from "@/public/icons/bed-icon";
import { TagIcon } from "@/public/icons/tag-icon";
import { HomeIcon } from "@/public/icons/home-icon";
import {
  formatCurrency,
  formatNumberWithSuffix,
  frequencyMap,
} from "@/lib/utils";
import { ListingImageGallery } from "../../listing-image-gallery";

export default function ListingIdPageBody({
  listingUUID,
}: {
  listingUUID: string;
}) {
  const { userId, userRoleId } = useUserStore();
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const [isPublishStatusModalOpen, setIsPublishStatusModalOpen] =
    useState(false);
  const [selectedOption, setSelectedOption] = useState<
    ListingPublicationStatus | undefined
  >(undefined);

  const pubStatuses: ListingPublicationStatus[] = ["published", "unpublished"];

  type ListingPublicationStatus = "published" | "unpublished";

  const { data } = useGetListingByUUID(listingUUID);

  const listingData = data?.data;
  const title = listingData?.title;
  const currentPubStatus = listingData?.publication_status;
  const location = listingData?.location;
  const paymentFrequency =
    listingData?.payment_frequency &&
    frequencyMap[listingData?.payment_frequency];
  const price = formatCurrency(listingData?.price ?? 0, "internal");
  const noOfBedrooms = listingData?.no_of_bedrooms;
  const homeType = listingData?.listing_type;
  const description = listingData?.description;
  const images = listingData?.listing_images;

  const formattedPrice = formatNumberWithSuffix(price);

  async function handleStatusChange(status: ListingPublicationStatus) {
    console.log(status);
    setSelectedOption(status);
    setIsPublishStatusModalOpen(true);
  }

  const publicationStatusModalProps: ModalProps = {
    modalId: "land_publication_status",
    variant: "neutral",
    title: `${selectedOption && statusVerbMap[selectedOption]} Listing`,
    description: `You are about to change the status of this property, you can always change it anytime you want.`,
    modalImage: (
      <Image
        src={listingIllustration.src}
        width={120}
        height={120}
        alt="listing illustration"
      />
    ),
    open: isPublishStatusModalOpen,
    setOpen: setIsPublishStatusModalOpen,
    modalActionButton: (
      <ChangeListingPubStatusButton
        userId={userId}
        listingUUID={listingUUID}
        publicationStatus={selectedOption}
        setIsPublishStatusModalOpen={setIsPublishStatusModalOpen}
      />
    ),
  };

  return (
    <section className="max-w-screen-max-xl mx-auto z-10 bg-background px-4 pb-5 sm:px-12 sm:pb-10 lg:px-6 lg:pb-12">
      <div className="flex flex-col gap-6">
        <section className="flex flex-col-reverse items-center justify-between gap-3 sticky z-20 py-6 top-0 left-0 right-0 bg-background lg:flex-row">
          <section className="flex w-full gap-3">
            <BackButton route="/listings" />
            <header className="flex flex-col gap-3">
              <h1 className="text-2xl leading-10 font-semibold capitalize sm:text-4xl sm:leading-11">
                {title}
              </h1>
              <p className="text-text-secondary flex gap-2 text-sm leading-6">
                <LocationIcon /> {location}
              </p>
            </header>
          </section>

          <div className="flex w-full items-center justify-between gap-6 lg:w-fit">
            <BackButton route="/listings" className="flex lg:hidden" />

            <div className="flex gap-3">
              <div className="border-line flex gap-3 rounded-sm border p-1">
                {pubStatuses.map((status) => {
                  const isActiveStatus = currentPubStatus === status;
                  return (
                    <button
                      key={status}
                      className={`cursor-pointer rounded-sm px-4 py-2 text-sm leading-6 capitalize transition-all duration-200 disabled:cursor-not-allowed ${isActiveStatus ? "text-text-inverse bg-background-accent font-medium" : "text-text-secondary hover:bg-background-secondary font-normal"}`}
                      disabled={isActiveStatus}
                      onClick={() => handleStatusChange(status)}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>

              <DropdownMenu
                open={isOpenDropDown}
                onOpenChange={() => setIsOpenDropDown(false)}
              >
                <DropdownMenuTrigger
                  className="hover:bg-background-secondary flex cursor-pointer items-center justify-center gap-2 rounded-sm p-0 p-1 select-none"
                  onClick={() => setIsOpenDropDown(true)}
                >
                  <KabobIcon />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                  {/* THIS TRIGGERS THE SHEET COMPONENT FOR THE USER PROFILE ON MOBILE */}
                  <DropdownMenuItem asChild>
                    <button className="flex w-full items-center gap-2 p-2">
                      <EditIcon className="text-text-primary" />
                      <span className="text-sm leading-6">Edit</span>
                    </button>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <button className="text-text-accent flex w-full items-center gap-2 p-2">
                      <BinStrokeIcon className="text-text-accent" />
                      <span className="text-sm leading-6">Delete</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_1fr]">
          <section className="flex flex-3 flex-col gap-6">
            <ListingImageGallery imageMetadata={images} />

            <p className="text-sm leading-6">{description}</p>
          </section>

          <section className="flex flex-1 flex-col gap-6">
            {/* PROPERTY DETAILS */}

            <div className="border-line w-full min-w-fit overflow-hidden rounded-md border bg-white">
              <div className="bg-background-secondary p-4">
                <h2 className="text-text-primary text-2xl leading-8 font-bold whitespace-nowrap">
                  Property Highlights
                </h2>
              </div>
              <Separator className="w-full" />

              <div className="flex items-center gap-3 p-4">
                <TagIcon />

                <section className="flex flex-col">
                  <h3 className="text-text-secondary text-sm leading-6">
                    Price
                  </h3>

                  <p className="text-text-primary text-base leading-6 font-semibold">
                    <span className="text-2xl leading-8 font-semibold">
                      ${formattedPrice}
                    </span>
                    /{paymentFrequency}
                  </p>
                </section>
              </div>
              <Separator className="w-full" />

              <div className="flex items-center gap-3 p-4">
                <BedIcon />

                <section className="flex flex-col">
                  <h3 className="text-text-secondary text-sm leading-6">
                    No of Bedrooms
                  </h3>

                  <p className="text-text-primary text-base leading-6 font-semibold">
                    {noOfBedrooms && noOfBedrooms > 1
                      ? `${noOfBedrooms} Rooms`
                      : `${noOfBedrooms} Room`}
                  </p>
                </section>
              </div>
              <Separator className="w-full" />

              <div className="flex items-center gap-3 p-4">
                <HomeIcon />

                <section className="flex flex-col">
                  <h3 className="text-text-secondary text-sm leading-6">
                    Home Type
                  </h3>

                  <p className="text-text-primary text-base leading-6 font-semibold capitalize">
                    {homeType}
                  </p>
                </section>
              </div>
            </div>

            <div>map</div>
          </section>
        </section>
      </div>

      <Modal {...publicationStatusModalProps} />
    </section>
  );
}
