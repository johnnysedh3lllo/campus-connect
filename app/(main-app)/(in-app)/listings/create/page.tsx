"use client";
import { useListingCreationStore } from "@/lib/store/listing-creation-store";
import { Badge } from "@/components/ui/badge";
import { useRef, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import Image from "next/image";
import { AnimationWrapper } from "@/lib/providers/AnimationWrapper";
import { formVariants, animationConfig } from "@/hooks/animations";
import { useRouter } from "next/navigation";
import { insertListing } from "@/app/actions/actions";
import { Separator } from "@/components/ui/separator";
import HomeDetailsForm from "@/components/app/listing-home-details-form";
import PhotoUploadForm from "@/components/app/listing-photo-upload-form";
import PricingForm from "@/components/app/listing-pricing-form";
import ListingCreationPreviewPage from "@/components/app/listing-home-details-preview";
import { toast } from "@/hooks/use-toast";
import ListingActionModal from "@/components/app/listing-action-modal";
import { useCreditsStore } from "@/lib/store/credits-store";
import { CREDITS_REQUIRED_TO_CREATE_LISTING } from "@/lib/constants";
import ListingPageHeader from "@/components/app/listing-page-header";

function CreatePage() {
  const router = useRouter();
  const { step, steps, clearData, homeDetails, pricing, photos } =
    useListingCreationStore();
  const { credits, setCredits } = useCreditsStore();
  const { modalData, openModal, closeModal } = useModal();
  const [isPublishing, setIsPublishing] = useState(false);
  const listingFormWrapper = useRef<HTMLDivElement>(null);

  function handleEscape() {
    router.push("/listings");
    clearData();
  }
  async function handlePublish() {
    setIsPublishing(true);
    try {
      if (!homeDetails || Object.keys(homeDetails).length === 0) {
        throw new Error("Home details are missing");
      }
      if (!pricing || !pricing.price)
        throw new Error("Pricing information is required");
      if (!photos || photos.length === 0)
        throw new Error("At least one photo is required");

      if (credits < CREDITS_REQUIRED_TO_CREATE_LISTING) {
        openModal({
          variant: "error",
          title: "You don't have enough credits to list this property.",
          message: "Buy credits now, or join our premium plan",
          primaryButtonText: "Get Premium",
          secondaryButtonText: "Buy Credits",
          onPrimaryAction: () => router.push("/premium"),
          onSecondaryAction: () => router.push("/credits/purchase"),
        });
        return;
      }

      const formData = { homeDetails, pricing, photos };
      const data = await insertListing(formData);

      if (!data.success) {
        openModal({
          variant: "error",
          title: "Error Publishing Listing",
          message:
            data.message || "Failed to publish listing. Please try again.",
          primaryButtonText: "Try Again",
        });
        return;
      }

      await setCredits(credits - CREDITS_REQUIRED_TO_CREATE_LISTING);

      openModal({
        variant: "success",
        title: "Property listed successfully",
        message: `${CREDITS_REQUIRED_TO_CREATE_LISTING} credits have been deducted from your balance.`,
        primaryButtonText: "Back to listings",
        onPrimaryAction: () => {
          router.push("/listings");
          clearData();
        },
      });
    } catch (error: any) {
      toast({
        title: "Error Publishing Listing",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      openModal({
        variant: "error",
        title: "Error Publishing Listing",
        message:
          error.message || "An unexpected error occurred. Please try again.",
        primaryButtonText: "Try Again",
      });
    } finally {
      setIsPublishing(false);
    }
  }
  const stepComponents = [
    <HomeDetailsForm />,
    <PhotoUploadForm />,
    <PricingForm />,
    <ListingCreationPreviewPage
      handlePublish={handlePublish}
      isPublishing={isPublishing}
    />,
  ];

  return (
    <>
      <section className="flex flex-col gap-12">
        <ListingPageHeader
          heading="New Listing"
          subHeading="Enter any necessary information"
          handleEscape={handleEscape}
        />

        <div
          className="onboarding-form--wrapper grid grid-cols-1 gap-6 px-4 sm:gap-12 sm:px-12 md:mx-20 md:grid-cols-[.7fr_4fr] md:px-0 lg:overflow-x-hidden lg:overflow-y-auto"
          ref={listingFormWrapper}
        >
          <div className="bg-background sticky top-0 flex gap-1 py-4 sm:hidden lg:pe-4">
            <Badge variant="outline">{`${step + 1}/${steps.length}`}</Badge>

            <div className="grid w-full grid-flow-row grid-cols-4 items-center gap-1">
              {steps.map((_, index) => (
                <div
                  className="bg-accent-secondary h-0.5"
                  key={`step-${index}`}
                >
                  <div
                    className={`h-full transition-all duration-500 ${index <= step ? "bg-primary w-full" : "w-0"}`}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="hidden auto-cols-auto grid-flow-col items-center gap-3 sm:grid md:grid-flow-row md:auto-rows-auto md:items-start">
              {steps.map((item, index) => (
                <div
                  key={index}
                  className="grid auto-cols-auto grid-flow-col items-center gap-3 md:grid-flow-row md:items-start md:self-start"
                >
                  <div className="grid grid-flow-col items-center gap-3 md:justify-start">
                    <span
                      className={`inline-grid aspect-square w-7 place-items-center rounded-full bg-gray-600 ${
                        step === index &&
                        "border-primary text-primary border bg-transparent"
                      } ${step > index && "bg-primary text-white"}`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`text-gray-600 ${step === index && "font-semibold text-black!"}`}
                    >
                      {item}
                    </span>
                  </div>
                  {index !== steps.length - 1 && (
                    <Separator className="h-[2px] w-10 bg-gray-300 md:h-10 md:w-[2px] md:translate-x-3" />
                  )}
                </div>
              ))}
            </div>
          </div>

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

export default CreatePage;
