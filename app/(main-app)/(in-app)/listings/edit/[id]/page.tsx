// TODO: Add loading state for the modal
"use client";

import { Header } from "@/components/app/header";
import HomeDetailsForm from "@/components/app/listing-home-details-form";
import ListingCreationPreviewPage from "@/components/app/listing-home-details-preview";
import PhotoUploadForm from "@/components/app/listing-photo-upload-form";
import PricingForm from "@/components/app/listing-pricing-form";
import ListingActionModal from "@/components/app/listing-action-modal";
import ListingStepperMobile from "@/components/app/listing-stepper-mobile";
import ListingStepperDesktop from "@/components/app/listing-stepper-desktop";

import { useFetchListingById } from "@/hooks/use-listing-data";
import { useListingCreationStore } from "@/lib/store/listing-creation-store";
import { urlToFile } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal";
import { AnimationWrapper } from "@/lib/providers/AnimationWrapper";
import { formVariants, animationConfig } from "@/hooks/animations";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { usePremiumStore } from "@/lib/store/use-premium-store";
import { useUser } from "@/hooks/use-user";
import { useUserCredits } from "@/hooks/use-user-credits";
import { useEditListing } from "@/hooks/use-edit-listing";
import {
  ListingEditSkeleton,
  ListingEditError,
} from "@/components/app/listing-edit-skeleton";

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { step, steps, setData, clearData, homeDetails, pricing, photos } =
    useListingCreationStore();

  const listingId =
    typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";

  const {
    isPremium,
    isLoading: isLoadingPremium,
    error: errorGettingPremium,
    checkPremiumStatus,
    setPremium,
  } = usePremiumStore();

  const { data: user } = useUser();
  const { data: credits } = useUserCredits(user?.id);

  const {
    listing,
    isLoading: isLoadingListing,
    error: errorLoadingListing,
  } = useFetchListingById(listingId);

  const { modalData, openModal, closeModal } = useModal();

  const listingFormWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function setListingData() {
      if (listing) {
        console.log("Listing data: ", listing);
        const photoFiles = await Promise.all(
          listing.listing_images.map((item, idx) =>
            urlToFile(item.image_url, `photo${idx}.jpg`),
          ),
        );
        setData({
          homeDetails: {
            title: listing.title || "",
            noOfBedRooms: listing.no_of_bedrooms?.toString() || "",
            listingType: listing.listing_type || "apartment",
            location: listing.location || "",
            description: listing.description || "",
          },
          pricing: {
            paymentFrequency:
              (listing.payment_frequency as ListingPaymentFrequency) || "daily",
            price: listing.price,
          },
          photos: photoFiles,
        });
      }
    }
    setListingData();
  }, [listing]);

  const { isPublishing, handleEditListing } = useEditListing({
    homeDetails,
    pricing,
    photos,
    isPremium,
    isLoadingPremium,
    errorGettingPremium,
    credits,
    openModal,
    closeModal,
    setPremium,
    clearData,
    listingId,
  });

  if (isLoadingListing) return <ListingEditSkeleton />;
  if (errorLoadingListing) return <ListingEditError />;
  if (!listing) return <ListingEditError message="Listing not found" />;

  const stepComponents = [
    <HomeDetailsForm />,
    <PhotoUploadForm />,
    <PricingForm />,
    <ListingCreationPreviewPage
      handlePublish={handleEditListing}
      isPublishing={isPublishing}
    />,
  ];

  return (
    <>
      <section className="flex flex-col gap-12">
        <Header
          title="Edit Listing"
          subTitle="Enter any necessary information"
          showButton={false}
        />

        <div
          className="max-w-screen-max-xl onboarding-form--wrapper mx-auto grid w-full grid-cols-1 gap-6 p-4 sm:gap-12 sm:px-12 sm:pt-10 md:grid-cols-[.7fr_4fr] md:px-12 lg:overflow-x-hidden lg:overflow-y-auto"
          ref={listingFormWrapper}
        >
          {/* Progress Bar (Mobile) */}
          <ListingStepperMobile step={step} steps={steps} />

          {/* Stepper (Desktop) */}
          <ListingStepperDesktop step={step} steps={steps} />

          {/* Step Content */}
          <AnimationWrapper
            variants={formVariants}
            transition={animationConfig}
            count={step}
            classes="w-full"
          >
            {stepComponents[step]}
          </AnimationWrapper>
        </div>
      </section>

      {/* Modal */}
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
      />
    </>
  );
}
