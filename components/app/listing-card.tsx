import React from "react";
import Image from "next/image";
import { ListingType } from "@/app/(main-app)/(in-app)/listings/page";
import { mapPaymentFrequencyToLabel } from "./listing-home-details-preview";
import { Button } from "../ui/button";
import { formatCurrencyToLocale, formatNumberWithSuffix } from "@/lib/utils";
import { useRouter } from "next/navigation";

function isValidPaymentFrequency(
  frequency: string,
): frequency is "daily" | "weekly" | "monthly" | "yearly" {
  return ["daily", "weekly", "monthly", "yearly"].includes(frequency);
}

function ListingCard({ listing }: { listing: ListingType }) {
  const router = useRouter();
  const goToListingDetails = (listingId: string) => {
    router.push(`/listings/${listingId}`);
  };

  return (
    <div className="flex w-full max-w-79 flex-col items-stretch gap-4 rounded-md border px-3 pt-3 pb-4">
      <figure className="aspect-[288/208] h-52 w-full">
        <Image
          src={
            listing.listing_images[0]?.image_url ||
            "/illustrations/illustration-house-placeholder.jpg"
          }
          alt={listing.description || "Listing Image"}
          onError={(e) => {
            e.currentTarget.src =
              "/illustrations/illustration-house-placeholder.jpg";
          }}
          width={500}
          height={300}
          className="h-full w-full rounded-md object-cover object-top"
        />
      </figure>
      <div className="flex flex-col gap-2">
        {listing.location && (
          <div className="text-text-secondary flex gap-2">
            <Image
              src={"/icons/icon-location-grey.svg"}
              alt={"Location Icon"}
              width={24}
              height={24}
            />
            <p>{listing.location}</p>
          </div>
        )}
        {listing.title && (
          <h2 className="text-text-primarys line-clamp-2 text-2xl font-semibold break-words capitalize">
            {listing.title}
          </h2>
        )}
      </div>
      <div className="grid grid-cols-2 items-center text-sm">
        <p>
          <span className="text-xl font-semibold">
            $
            {formatNumberWithSuffix(
             Number(
              parseFloat(
                formatCurrencyToLocale(listing.price).slice(1).replace(/,/g, ""),
              ),
            )
            )}
          </span>
          {listing.payment_frequency &&
            isValidPaymentFrequency(listing.payment_frequency) &&
            `/${mapPaymentFrequencyToLabel(listing.payment_frequency)}`}
        </p>
        <Button
          className="text-text-primary border-line flex h-12 items-center justify-center gap-2 p-2"
          variant={"outline"}
          onClick={() => goToListingDetails(listing.uuid)}
        >
          View Details
          <Image
            src={"/icons/icon-arrow-right.svg"}
            alt="Chevron Right"
            width={8}
            height={8}
            className="h-auto w-3"
          />
        </Button>
      </div>
    </div>
  );
}

export default ListingCard;
