"use client";

import { Header } from "@/components/app/header";
import {
  HomeDetailsForm,
  PhotoUploadForm,
  PreviewPage,
  PricingForm,
} from "@/components/app/listing-forms";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { animationConfig, formVariants } from "@/hooks/animations";
import { AnimationWrapper } from "@/lib/providers/animation-wrapper";
import { useCreateListingsStore } from "@/lib/store/create-listings-store";
import { CloseIconNoBorders } from "@/public/icons/close-icon-no-borders";

export default function CreateListingPage() {
  const { step, steps } = useCreateListingsStore();

  const createListingSteps = [
    <HomeDetailsForm />,
    <PhotoUploadForm />,
    <PricingForm />,
    <PreviewPage />,
  ];

  return (
    <section>
      <Header
        title="New Listing"
        subTitle="Enter any necessary information"
        button={<CloseIconNoBorders className="size-10" />}
      />

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
    </section>
  );
}
