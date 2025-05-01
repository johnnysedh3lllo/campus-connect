"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import ListingCreatePreviewImage from "@/components/app/listing-create-preview-image";
import { useListingCreationStore } from "@/lib/store/listing-creation-store";
import { PaymentFrequencyEnum } from "@/lib/form.schemas";
import { z } from "zod";
import Image from "next/image";
import { useCreditsStore } from "@/lib/store/credits-store";
import { CreditBalance } from "./credit-balance";
import { useUser } from "@/hooks/use-user";

type PaymentFrequency = z.infer<typeof PaymentFrequencyEnum>;
export function mapPaymentFrequencyToLabel(
  paymentFrequency: PaymentFrequency,
): string {
  const frequencyMap: Record<PaymentFrequency, string> = {
    daily: "Day",
    weekly: "Week",
    monthly: "Month",
    yearly: "Year",
  };

  return frequencyMap[paymentFrequency]?.toLowerCase() || "";
}

function HomeDetailsPreview({
  homeDetails,
  pricing,
}: {
  homeDetails?: {
    description: string;
    location: string;
    title: string;
    noOfBedRooms: string;
    listingType: "condo" | "apartment";
  };
  pricing?: { price?: number; paymentFrequency?: PaymentFrequency };
}) {
  const { credits } = useCreditsStore();
  const { data: user } = useUser();

  return (
    <section className="grid grid-cols-2 gap-6 sm:grid-cols-3">
      {[
        { label: "Title", value: homeDetails?.title },
        { label: "Home type", value: homeDetails?.listingType },
        { label: "Location", value: homeDetails?.location },
        pricing?.price && {
          label: "Price",
          value: `${pricing.price}/${mapPaymentFrequencyToLabel(pricing.paymentFrequency!)}`,
        },
        { label: "No of Bedrooms", value: homeDetails?.noOfBedRooms },
      ]
        .filter((detail): detail is { label: string; value: any } =>
          Boolean(detail),
        )
        .map((detail, index) => (
          <div
            key={detail.label}
            className={detail.label === "Description" ? "col-span-full" : ""}
          >
            <h3 className="text-sm leading-6 font-medium">{detail.label}</h3>
            <p className="text-sm text-gray-700 capitalize">{detail.value}</p>
          </div>
        ))}

      {homeDetails?.description && (
        <div className="col-span-full">
          <h3 className="text-sm leading-6 font-medium">Description</h3>
          <p className="text-sm text-gray-700">{homeDetails.description}</p>
        </div>
      )}

      <div className="col-span-full">
        <h3 className="text-sm leading-6 font-medium">
          Your Available Credits
        </h3>
        <CreditBalance userId={user?.id} />
      </div>
    </section>
  );
}

function ListingCreationPreviewPage({
  handlePublish,
  isPublishing,
}: {
  handlePublish: () => void;
  isPublishing: boolean;
}) {
  const { step, steps, photos, homeDetails, pricing, clearData, prevStep } =
    useListingCreationStore();

  const [previews, setPreviews] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Extracted preview URL management logic
  useEffect(() => {
    if (photos?.length) {
      const photoPreviewUrls = photos.map((file) => URL.createObjectURL(file));
      setPreviews(photoPreviewUrls);

      return () => {
        photoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [photos]);

  return (
    <div className="w-full md:max-w-202">
      <h1 className="flex w-full items-center justify-between text-2xl leading-10 font-semibold sm:text-4xl sm:leading-11">
        {steps[step]}
      </h1>

      <div className="mt-4"></div>

      {previews.length > 0 && (
        <>
          <ListingCreatePreviewImage
            isUploading={false}
            previews={previews}
            scrollContainerRef={scrollContainerRef}
          />
          <Separator className="my-6" />
        </>
      )}

      {homeDetails && (
        <HomeDetailsPreview homeDetails={homeDetails} pricing={pricing} />
      )}

      <div className="mt-16 flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="w-full sm:w-50"
          disabled={isPublishing}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handlePublish}
          disabled={previews.length === 0 || isPublishing}
          className="w-full sm:w-50"
        >
          {isPublishing ? "Publishing" : "Publish"}
        </Button>
      </div>
    </div>
  );
}

export default ListingCreationPreviewPage;
