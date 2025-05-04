"use client";
import { useListingCreationStore } from "@/lib/store/listing-creation-store";
import { Badge } from "@/components/ui/badge";
import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import { useModal } from "@/hooks/use-modal";
import { AnimationWrapper } from "@/lib/providers/AnimationWrapper";
import { formVariants, animationConfig } from "@/hooks/animations";
import { useRouter } from "next/navigation";
import { insertListing } from "@/app/actions/supabase/listings";
import { Separator } from "@/components/ui/separator";
import HomeDetailsForm from "@/components/app/listing-home-details-form";
import PhotoUploadForm from "@/components/app/listing-photo-upload-form";
import PricingForm from "@/components/app/listing-pricing-form";
import ListingCreationPreviewPage from "@/components/app/listing-home-details-preview";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import ListingActionModal from "@/components/app/listing-action-modal";
import { useCreditsStore } from "@/lib/store/credits-store";
import { CREDITS_REQUIRED_TO_CREATE_LISTING } from "@/lib/constants";
import { Header } from "@/components/app/header";
import { usePremiumStore } from "@/lib/store/use-premium-store";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";

function CreateModal({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { step, steps, clearData, homeDetails, pricing, photos } =
    useListingCreationStore();
  const { credits, setCredits } = useCreditsStore();
  const { modalData, openModal, closeModal } = useModal();
  const [isPublishing, setIsPublishing] = useState(false);
  const listingFormWrapper = useRef<HTMLDivElement>(null);
  const {
    isPremium,
    isLoading: isLoadingPremium,
    error: errorGettingPremium,
    checkPremiumStatus,
    setPremium,
  } = usePremiumStore();

  function onClose() {
    setOpen(false);
  }

  useEffect(() => {
    checkPremiumStatus();
  }, [checkPremiumStatus]);

  async function handlePublish() {
    setIsPublishing(true);
    try {
      if (!homeDetails || Object.keys(homeDetails).length === 0) {
        throw new Error("Home details are missing");
      }
      if (!pricing || !pricing.price) {
        throw new Error("Pricing information is required");
      }
      if (!photos || photos.length === 0) {
        throw new Error("At least one photo is required");
      }

      if (isLoadingPremium) {
        toast({
          title: "Loading Premium Status",
          description: "Please wait while we verify your premium status.",
          variant: "destructive",
          // variant: "info",
        });
        return;
      }

      if (errorGettingPremium) {
        toast({
          title: "Error Checking Premium Status",
          description:
            "Unable to verify your premium status. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!isPremium && credits < CREDITS_REQUIRED_TO_CREATE_LISTING) {
        openModal({
          variant: "error",
          title: "Insufficient Credits or Premium Status",
          message:
            "You need to either have enough credits or be a premium user to list this property.",
          primaryButtonText: "Get Premium",
          secondaryButtonText: "Buy Credits",
          onPrimaryAction: () => {
            console.log("Setting Premium");
            setPremium();
            console.log("Closing Modal");
            closeModal();
          },
          onSecondaryAction: () => router.push("/buy-credits"),
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

      if (!isPremium) {
        await setCredits(credits - CREDITS_REQUIRED_TO_CREATE_LISTING);
      }

      queryClient.invalidateQueries({ queryKey: ["listings"] });

      openModal({
        variant: "success",
        title: "Property listed successfully",
        message: isPremium
          ? "Your property has been listed successfully as a premium user."
          : `${CREDITS_REQUIRED_TO_CREATE_LISTING} credits have been deducted from your balance.`,
        primaryButtonText: "Back to listings",
        onPrimaryAction: () => {
          onClose();
          clearData();
        },
      });
    } catch (error: any) {
      console.log("Error Publishing Listing :", error);
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

  async function handleSaveToDraft() {
    openModal({
      variant: "warning",
      title: "You are about to quit the listing process",
      message: "You can save to draft to draft and continue when you want",
      primaryButtonText: "Save to draft",
      secondaryButtonText: "Don’t Save",
      onPrimaryAction: async () => {
        if (
          !homeDetails?.title ||
          !homeDetails?.listingType ||
          !pricing?.price
        ) {
          toast({
            title: "Missing Required Fields",
            description:
              "Title, property type, and price are required to save draft",
            variant: "destructive",
          });
          return;
        }
        try {
          const formData = {
            homeDetails: {
              title: homeDetails.title,
              listingType: homeDetails.listingType,
              noOfBedRooms: homeDetails.noOfBedRooms,
              location: homeDetails.location,
              description: homeDetails.description,
            },
            pricing: {
              price: pricing.price,
              paymentFrequency: pricing.paymentFrequency,
            },
            photos: photos || [],
          };

          await insertListing(formData, true);
          clearData();
          await queryClient.invalidateQueries({ queryKey: ["listings"] });
          setOpen(false);
          closeModal();
        } catch (error) {
          console.error("Error saving draft:", error);
          toast({
            title: "Error Saving Draft",
            description: "Failed to save draft. Please try again.",
            variant: "destructive",
          });
        }
      },
      onSecondaryAction: () => {
        setOpen(false);
        closeModal();
      },
    });
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleSaveToDraft();
        else setOpen(open);
      }}
    >
      <DialogContent className="h-full w-screen max-w-none min-w-screen overflow-y-scroll rounded-none bg-white">
        <DialogTitle className="invisible">New Listing</DialogTitle>
        <Header
          title="New Listing"
          subTitle="Enter any necessary information"
          showButton={false}
          onlyIcon={true}
          buttonIcon={<CloseIconNoBorders />}
          onButtonClick={handleSaveToDraft}
        />

        <div
          className="max-w-screen-max-xl onboarding-form--wrapper mx-auto grid w-full grid-cols-1 gap-6 p-4 sm:gap-12 sm:px-12 sm:pt-10 md:grid-cols-[.7fr_4fr] md:px-12 lg:overflow-x-hidden lg:overflow-y-auto"
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
                      className={`bg-line inline-grid aspect-square w-7 place-items-center rounded-full ${
                        step === index &&
                        "border-primary text-primary border bg-transparent"
                      } ${step > index && "bg-primary text-white"}`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`text-text-secondary ${step === index && "text-text-primary! font-semibold"}`}
                    >
                      {item}
                    </span>
                  </div>
                  {index !== steps.length - 1 && (
                    <Separator className="bg-line h-[2px] w-10 md:h-10 md:w-[2px] md:translate-x-3" />
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
      </DialogContent>
    </Dialog>
  );
}

export default CreateModal;

/**
     
 */
