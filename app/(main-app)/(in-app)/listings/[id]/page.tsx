"use client";

import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchListingById } from "@/hooks/use-listing-data";
import {
  deleteListingById,
  publishListing,
  unpublishListing,
} from "@/app/actions/supabase/listings";
import { ListingDetailsImageGallery } from "@/components/app/listing-details-image-gallery";
import { mapPaymentFrequencyToLabel } from "@/components/app/listing-home-details-preview";
import { HouseIcon } from "@/public/icons/icon-house";
import { BedIcon } from "@/public/icons/icon-bed";
import { TagIcon } from "@/public/icons/icon-tag";
import ListingActionModal from "@/components/app/listing-action-modal";
import { TrashCanIconFull } from "@/public/icons/icon-trash-full";
import { useModal } from "@/hooks/use-modal";
import { LoadingState } from "@/components/app/listing-detail-skeletons";
import { ErrorState } from "@/components/app/listing-error-state";
import { PropertyHighlightItem } from "@/components/app/property-highlight-item";
import { ListingDetailResponsiveHeader } from "@/components/app/listing-responsive-header";
import { IllustrationHouse } from "@/public/illustrations/illustration-house";
import ListingEditModal from "@/components/app/listing-edit-modal";
import { useState } from "react";

function getImageUrls(images: ListingImage[]): string[] {
  return images.map((item) => item.image_url);
}
type PaymentFrequency = "monthly" | "weekly" | "yearly";
type ListingImage = { image_url: string };
export default function ListingDetailPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = useParams();
  const listingId =
    typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";

  const { listing, isLoading, error } = useFetchListingById(listingId);
  const { modalData, openModal, closeModal } = useModal();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const invalidateListing = () =>
    queryClient.invalidateQueries({ queryKey: ["listings"] });

  if (isLoading) return <LoadingState />;

  if (error) {
    return (
      <ErrorState
        message={"Something went wrong"}
        onRetry={() =>
          queryClient.invalidateQueries({ queryKey: ["listing", listingId] })
        }
      />
    );
  }

  if (!listing) {
    return (
      <ErrorState
        message="We couldn't find the listing you're looking for."
        onRetry={() =>
          queryClient.invalidateQueries({ queryKey: ["listing", listingId] })
        }
      />
    );
  }

  const formattedTitle = `${listing.no_of_bedrooms} Bedroom ${listing.listing_type}`;
  const paymentFrequency = listing.payment_frequency as PaymentFrequency;
  const paymentInfo = `$${listing.price}/${mapPaymentFrequencyToLabel(paymentFrequency)}`;

  async function handlePublish(listingId: string) {
    try {
      openModal({
        variant: "success",
        title: "Publish listing",
        message: "You are about to publish this property to your listings",
        primaryButtonText: "Publish",
        secondaryButtonText: "Cancel",
        onPrimaryAction: async () => {
          await publishListing(listingId);
          await invalidateListing();
          await router.push("/listings");
          router.refresh();
        },
        onSecondaryAction: closeModal,
      });
    } catch (error) {
      openModal({
        variant: "error",
        title: "Error Publishing listing",
        message: "There was an error publishing this listing",
        primaryButtonText: "Try again",
        secondaryButtonText: "Cancel",
        onPrimaryAction: () => handlePublish(listingId),
        onSecondaryAction: closeModal,
      });
    }
  }
  async function handleUnPublish(listingId: string) {
    try {
      openModal({
        variant: "warning",
        title: "Unpublish listing",
        message:
          "You are about to unpublish this property from your listings, you can always republish anytime you want",
        primaryButtonText: "Unpublish",
        secondaryButtonText: "Cancel",
        onPrimaryAction: async () => {
          await unpublishListing(listingId);
          await invalidateListing();
          await router.push("/listings");
          router.refresh();
        },
        onSecondaryAction: closeModal,
        icon: <IllustrationHouse />,
      });
    } catch (error) {
      openModal({
        variant: "error",
        title: "Error Unpublishing listing",
        message: "There was an error unpublishing this listing",
        primaryButtonText: "Try again",
        secondaryButtonText: "Cancel",
        onPrimaryAction: () => handleUnPublish(listingId),
        onSecondaryAction: closeModal,
      });
    }
  }

  // Delete handler
  async function handleDeleteListing() {
    try {
      if (!listing?.uuid) throw new Error("Listing Doesn't exist");
      const response = await deleteListingById(listing?.uuid);
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      router.push("/listings");
    } catch (error) {}
  }

  return (
    <>
      <section className="px-4 py-5 sm:px-12 sm:py-10 md:px-16 md:py-12">
        <ListingDetailResponsiveHeader
          title={formattedTitle}
          subtitle={listing.location}
          onDeleteClick={() =>
            openModal({
              title: "Delete Listing",
              message:
                "You are about to delete this property from your listing, are you sure you want to continue?",
              primaryButtonText: "Delete",
              secondaryButtonText: "Cancel",
              onPrimaryAction: handleDeleteListing,
              onSecondaryAction: closeModal,
              icon: <TrashCanIconFull />,
            })
          }
          onEditClick={() => setIsEditModalOpen(true)}
          publicationStatus={listing.publication_status}
          listingId={listingId}
          openModal={openModal}
          closeModal={closeModal}
          handlePublish={() => handlePublish(listingId)}
          handleUnpublish={() => handleUnPublish(listingId)}
        />

        <section className="grid grid-cols-1 gap-6 md:grid-cols-[3fr_1fr]">
          <div className="flex flex-col items-start gap-6">
            <ListingDetailsImageGallery
              images={getImageUrls(listing.listing_images)}
            />
            <p>{listing.description}</p>
          </div>

          <div className="flex w-full flex-col items-center justify-start">
            <div className="border-line w-full overflow-hidden rounded-lg border bg-white shadow-sm md:max-w-82">
              <div className="bg-background-secondary border-line border-b p-4">
                <h2 className="text-text-primary text-xl font-bold">
                  Property Highlights
                </h2>
              </div>

              <PropertyHighlightItem
                icon={<TagIcon />}
                label="Price"
                value={<>{paymentInfo}</>}
              />

              <PropertyHighlightItem
                icon={<BedIcon />}
                label="No of Bedrooms"
                value={`${listing.no_of_bedrooms} Rooms`}
              />

              <PropertyHighlightItem
                icon={<HouseIcon />}
                label="Home Type"
                value={
                  <span className="capitalize">
                    {listing.listing_type.toString()}
                  </span>
                }
              />
            </div>
          </div>
        </section>
      </section>

      <ListingActionModal
        isOpen={modalData.open}
        onClose={closeModal}
        variant={modalData.variant}
        title={modalData.title}
        message={modalData.message}
        primaryButtonText={modalData.primaryButtonText}
        secondaryButtonText={modalData.secondaryButtonText}
        onPrimaryAction={modalData.onPrimaryAction}
        onSecondaryAction={modalData.onSecondaryAction}
        icon={modalData.icon}
      />
      <ListingEditModal
        listingId={listingId}
        isOpen={isEditModalOpen}
        setOpen={setIsEditModalOpen}
      />
    </>
  );
}
