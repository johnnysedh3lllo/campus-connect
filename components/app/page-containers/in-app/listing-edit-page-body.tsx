"use client";

import { Header } from "@/components/app/header";
import {
  HomeDetailsForm,
  PhotoUploadForm,
  PreviewPage,
  PricingForm,
} from "@/components/app/listing-forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { animationConfig, formVariants } from "@/hooks/animations";
import { useGetListingByUUID } from "@/hooks/tanstack/use-get-listing-by-uuid";
import { useBackToLastPage } from "@/hooks/use-back-to-last-page";
import {
  EditListingFormType,
  HomeDetailsFormType,
  PhotoUploadFormType,
  PricingFormType,
} from "@/lib/form.types";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { useEditListingsStore } from "@/lib/store/edit-listings-store";
import { clearStorage } from "@/lib/store/store-utils";
import { fileFromUrl, getImageUrls } from "@/lib/utils";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";
import { useEffect, useState } from "react";

export default function ListingEditPageBody({
  listingUUID,
}: {
  listingUUID: string;
}) {
  const {
    step,
    steps,
    setData,
    data: storeData,
    nextStep,
    setStep,
  } = useEditListingsStore();
  const clearStoreStorage = clearStorage(useEditListingsStore);
  const [photos, setPhotos] = useState<File[]>([]);
  const { data, isLoading } = useGetListingByUUID(listingUUID);
  const backToLastPage = useBackToLastPage("/listings");

  useEffect(() => {
    if (!data?.data?.listing_images) return;

    const fetchPhotos = async () => {
      const imageUrls = getImageUrls(data.data.listing_images);

      const files = await Promise.all(imageUrls.map((url) => fileFromUrl(url)));

      setData({ photos: files });
      setPhotos(files);
    };

    fetchPhotos();
  }, [data]);

  const listingData = data?.data;
  const title = listingData?.title;
  const noOfBedrooms = listingData?.no_of_bedrooms;
  const homeType = listingData?.listing_type;
  const location = listingData?.location;
  const description = listingData?.description;

  const paymentFrequency = listingData?.payment_frequency;
  const price = listingData?.price;

  const currentPubStatus = listingData?.publication_status;

  // HOME DETAILS FORM
  const homeDetailsDefaultValue: HomeDetailsFormType = {
    title: title ?? "",
    noOfBedrooms: noOfBedrooms ?? 1,
    listingType: homeType ?? "apartment",
    location: location ?? "",
    description: description ?? "",
  };
  function handleHomeDetailsOnSubmit(values: HomeDetailsFormType) {
    setData(values);
    nextStep();
  }

  // PHOTO UPLOAD FORM
  const photoUploadDefaultValues: PhotoUploadFormType = {
    photos: photos || [],
  };
  function handlePhotoUploadOnSubmit(values: PhotoUploadFormType) {
    console.log(values);
    setData(values);
    setPhotos(values.photos);
    nextStep();
  }

  // PRICING FORM
  const pricingDefaultValues: PricingFormType = {
    paymentFrequency: paymentFrequency ?? "monthly",
    price: price ?? 1,
  };
  function handlePricingOnSubmit(values: PricingFormType) {
    setData(values);
    nextStep();
  }

  // PREVIEW FORM
  const previewDefaultValues: EditListingFormType = {
    title: title ?? "",
    noOfBedrooms: noOfBedrooms ?? 1,
    listingType: homeType ?? "apartment",
    location: location ?? "",
    description: description ?? "",
    photos: photos,
    paymentFrequency: paymentFrequency ?? "daily",
    price: price ?? 1,
    publicationStatus: currentPubStatus ?? "published",
  };

  async function handlePublishEdit(values: EditListingFormType) {
    console.log(values);
  }

  const editListingSteps = [
    <HomeDetailsForm
      defaultValues={homeDetailsDefaultValue}
      onSubmit={handleHomeDetailsOnSubmit}
      useListingStore={useEditListingsStore}
    />,
    <PhotoUploadForm
      defaultValues={photoUploadDefaultValues}
      onSubmit={handlePhotoUploadOnSubmit}
      useListingStore={useEditListingsStore}
    />,
    <PricingForm
      defaultValues={pricingDefaultValues}
      onSubmit={handlePricingOnSubmit}
      useListingStore={useEditListingsStore}
    />,
    <PreviewPage
      defaultValues={previewDefaultValues}
      onSubmit={handlePublishEdit}
      useListingStore={useEditListingsStore}
    />,
  ];

  function cancelListingEdit() {
    clearStoreStorage();
    backToLastPage();
  }

  return (
    <section>
      <Header title="Edit Listing" subTitle="Enter any necessary information">
        <Button
          onClick={cancelListingEdit}
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
              // TODO: ABSTRACT THIS
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
          {editListingSteps[step]}
        </AnimationWrapper>
      </div>
    </section>
  );
}
