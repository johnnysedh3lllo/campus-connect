"use client";

import { CancelListingButton } from "@/components/app/action-buttons";
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
import { ModalProps } from "@/lib/prop.types";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { useCreateListingsStore } from "@/lib/store/create-listings-store";
import { useClearListingStore } from "@/lib/store/store-utils";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import { XLarge } from "@/public/icons/x-large-icon";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateListingPage() {
  const { step, steps } = useCreateListingsStore();
  const clearStoreStorage = useClearListingStore();
  const [isDraftModalOpen, setIsDraftModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const createListingSteps = [
    <HomeDetailsForm />,
    <PhotoUploadForm />,
    <PricingForm />,
    <PreviewPage />,
  ];

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
    </section>
  );
}
