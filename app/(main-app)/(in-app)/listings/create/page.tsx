"use client";

import { Header } from "@/components/app/header";
import {
  HomeDetailsForm,
  PhotoUploadForm,
  PreviewPage,
  PricingForm,
} from "@/components/app/listing-forms";
import Modal from "@/components/app/modals/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { animationConfig, formVariants } from "@/hooks/animations";
import {
  CreateListingFormType,
  HomeDetailsFormType,
  PhotoUploadFormType,
  PricingFormType,
  UpsertListingType,
} from "@/lib/form.types";
import { ModalProps } from "@/lib/prop.types";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { useCreateListingsStore } from "@/lib/store/create-listings-store";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import { XLarge } from "@/public/icons/x-large-icon";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUploadListing } from "@/hooks/tanstack/mutations/use-upload-listing";
import { useUpdateCreditRecord } from "@/hooks/tanstack/mutations/use-update-credit-record";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { MIN_CREDITS } from "@/lib/app.config";
import { useUserStore } from "@/lib/store/user-store";
import { useGetUserCredits } from "@/hooks/tanstack/use-get-user-credits";
import { useGetActiveSubscription } from "@/hooks/tanstack/use-get-active-subscription";
import BuyCredits from "@/components/app/buy-credits";
import Link from "next/link";
import { SuccessShieldIcon } from "@/public/icons/success-shield-icon";
import { SadFaceIcon } from "@/public/icons/sad-face-icon";
import { clearStorage } from "@/lib/store/store-utils";

export default function CreateListingPage() {
  const { userId, userRoleId } = useUserStore();
  const { step, steps, data, setData, nextStep, setStep } =
    useCreateListingsStore();
  const clearStoreStorage = clearStorage(useCreateListingsStore);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const router = useRouter();

  const { data: creditRecord } = useGetUserCredits(
    userId || undefined,
    userRoleId,
  );
  const { data: userActiveSubscription } = useGetActiveSubscription(
    userId || undefined,
    userRoleId,
  );

  const hasActiveSubscription = userActiveSubscription?.status === "active";
  const creditAmount = creditRecord?.remaining_credits;
  const hasEnoughCredits = creditAmount && creditAmount >= MIN_CREDITS;

  // HOME DETAILS FORM
  const homeDetailsDefaultValue: HomeDetailsFormType = {
    title: data.title ?? "",
    noOfBedrooms: data.noOfBedrooms ?? 1,
    listingType: data.listingType ?? "apartment",
    location: data.location ?? "",
    description: data.description ?? "",
  };
  function handleHomeDetailsOnSubmit(values: HomeDetailsFormType) {
    setData(values);
    nextStep();
  }

  // PHOTO UPLOAD FORM
  const photoUploadDefaultValues: PhotoUploadFormType = {
    photos: data.photos || [],
  };
  function handlePhotoUploadOnSubmit(values: PhotoUploadFormType) {
    setData(values);
    nextStep();
  }

  // PRICING FORM
  const pricingDefaultValues: PricingFormType = {
    paymentFrequency: data.paymentFrequency ?? "monthly",
    price: data.price ?? 1,
  };
  function handlePricingOnSubmit(values: PricingFormType) {
    setData(values);
    nextStep();
  }

  // PREVIEW FORM
  const createListingMutation = useUploadListing();
  const updateCreditMutation = useUpdateCreditRecord();
  const idempotencyKey = data.idempotencyKey;

  const previewDefaultValues: CreateListingFormType = {
    ...(homeDetailsDefaultValue as HomeDetailsFormType),
    ...(photoUploadDefaultValues as PhotoUploadFormType),
    ...(pricingDefaultValues as PricingFormType),
    publicationStatus: "draft",
  };
  async function handlePublish(values: CreateListingFormType) {
    console.log("create listing form", values);

    let idemKey = idempotencyKey;
    if (!hasActiveSubscription && !hasEnoughCredits) {
      console.log("this user can't upload a property");
      setIsErrorModalOpen(true);
    } else {
      if (!idemKey) {
        idemKey = "listing-" + uuidv4();
        setData({ idempotencyKey: idemKey });
      }
      if (!userId) {
        throw new Error("User ID is required");
      }

      const listingDetails: UpsertListingType = {
        title: values.title,
        noOfBedrooms: values.noOfBedrooms,
        listingType: values.listingType,
        location: values.location,
        paymentFrequency: values.paymentFrequency,
        price: values.price,
        publicationStatus: values.publicationStatus,
        description: values.description,
      };

      const listingImages = values.photos;

      try {
        const createdListing = await createListingMutation.mutateAsync({
          userId: userId,
          idemKey: idemKey,
          listingDetails: listingDetails,
          images: listingImages,
        });

        if (createListingMutation.isError) {
          toast({
            variant: "destructive",
            description:
              "It seems an error occurred while creating your listing. Please try again",
            showCloseButton: false,
          });
          throw createListingMutation.error;
        }

        if (!hasActiveSubscription) {
          const updatedCredits = await updateCreditMutation.mutateAsync({
            userId: userId,
            addedCredits: MIN_CREDITS,
            tableColumn: "used_credits",
          });

          if (!updateCreditMutation.isError) {
            console.log("created listings", createdListing);
            console.log("updated credit record", updatedCredits);

            setIsSuccessModalOpen(true);
          }
        } else {
          setIsSuccessModalOpen(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  // FUNCTIONS
  function cancelListingCreation() {
    setIsDraftModalOpen(true);
  }

  function handleNoSave() {
    clearStoreStorage();
    setIsDraftModalOpen(false);
    router.push("/listings");
  }

  function handleSaveToDraft() {
    setIsDraftModalOpen(false);
    router.push("/listings");
  }

  function handleBackToListing() {
    clearStoreStorage();
    setIsSuccessModalOpen(false);
    router.push("/listings");
  }

  // STEPS
  const createListingSteps = [
    <HomeDetailsForm
      defaultValues={homeDetailsDefaultValue}
      onSubmit={handleHomeDetailsOnSubmit}
      useListingStore={useCreateListingsStore}
    />,
    <PhotoUploadForm
      defaultValues={photoUploadDefaultValues}
      onSubmit={handlePhotoUploadOnSubmit}
      useListingStore={useCreateListingsStore}
    />,
    <PricingForm
      defaultValues={pricingDefaultValues}
      onSubmit={handlePricingOnSubmit}
      useListingStore={useCreateListingsStore}
    />,
    <PreviewPage
      displayCreditBalance
      creditAmount={creditAmount}
      hasActiveSubscription={hasActiveSubscription}
      defaultValues={previewDefaultValues}
      onSubmit={handlePublish}
      useListingStore={useCreateListingsStore}
    />,
  ];

  // MODAL PROPS
  const successModalDescription = hasActiveSubscription
    ? "Now sit back and let a tenant make an inquiry"
    : `${MIN_CREDITS} credits have been deducted from your balance, Now sit back and let a tenant make an inquiry`;

  const listingDraftModal: ModalProps = {
    modalId: "land_listing_draft",
    variant: "neutral",
    title: "You are about to quit the listing process",
    description: "You can save to draft to draft and continue when you want",
    modalImage: <XLarge />,
    showCloseButton: true,
    open: isDraftModalOpen,
    setOpen: setIsDraftModalOpen,
  };

  const listingSuccessModal: ModalProps = {
    modalId: "land_listing_success",
    variant: "success",
    title: "Property listed successfully",
    description: successModalDescription,
    modalImage: <SuccessShieldIcon />,
    open: isSuccessModalOpen,
    setOpen: setIsSuccessModalOpen,
  };

  const listingErrorModal: ModalProps = {
    modalId: "land_listing_error",
    variant: "error",
    title: "You are unable to list a property",
    description: "Buy credits now, or join our premium plan",
    modalImage: <SadFaceIcon />,
    open: isErrorModalOpen,
    setOpen: setIsErrorModalOpen,
  };

  return (
    <section>
      <Header title="New Listing" subTitle="Enter any necessary information">
        <Button
          onClick={cancelListingCreation}
          variant="ghost"
          className="size-10 cursor-pointer gap-3 p-0 text-base leading-6 sm:flex"
        >
          <CloseIconNoBorders />
        </Button>
      </Header>

      <div className="max-w-screen-max-xl mx-auto grid w-full grid-cols-1 gap-6 p-4 sm:gap-12 sm:px-12 sm:pt-10 md:grid-cols-[.7fr_4fr] md:px-12 lg:overflow-x-hidden lg:overflow-y-auto">
        <div className="bg-background sticky top-0 flex gap-1 py-4 sm:hidden lg:pe-4">
          <Badge variant="outline">{`${step + 1}/${steps.length}`}</Badge>

          <div className="grid w-full grid-flow-row grid-cols-4 items-center gap-1">
            {steps.map((_, index) => (
              <div className="bg-accent-secondary h-0.5" key={`step-${index}`}>
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
                  <button
                    className="cursor-pointer"
                    onClick={() => setStep(index)}
                  >
                    <span
                      className={`bg-line inline-grid aspect-square w-7 place-items-center rounded-full ${
                        step === index &&
                        "border-primary text-primary border bg-transparent"
                      } ${step > index && "bg-primary text-white"}`}
                    >
                      {index + 1}
                    </span>
                  </button>
                  <p
                    className={`text-text-secondary ${step === index && "text-text-primary! font-semibold"}`}
                  >
                    {item}
                  </p>
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
          {createListingSteps[step]}
        </AnimationWrapper>
      </div>

      <Modal {...listingDraftModal}>
        <Button variant="outline" onClick={handleNoSave} className="w-full">
          Don't Save
        </Button>
        <Button onClick={handleSaveToDraft} className="w-full">
          Save to draft
        </Button>
      </Modal>

      <Modal {...listingErrorModal}>
        <BuyCredits variant="outline" />

        <Link className="w-full" href="/plans">
          <Button className="w-full">Get Premium</Button>
        </Link>
      </Modal>

      <Modal {...listingSuccessModal}>
        <Button onClick={handleBackToListing} className="w-full">
          Back to Listings
        </Button>
      </Modal>
    </section>
  );
}
