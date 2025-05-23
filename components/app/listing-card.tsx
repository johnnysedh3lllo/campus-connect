import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  formatCurrency,
  formatNumberWithSuffix,
  frequencyMap,
} from "@/lib/utils";
import { ChevronRightIcon } from "@/public/icons/chevron-right-icon";
import { LocationIcon } from "@/public/icons/location-icon";
import imagePlaceholder from "@/public/illustrations/illustration-image-placeholder.png";

import Link from "next/link";

export default function ListingCard({
  listing,
}: {
  listing: ListingWithImages;
}) {
  const paymentFrequency =
    listing.payment_frequency && frequencyMap[listing.payment_frequency];

  const price = formatCurrency(listing.price, "internal");

  const formattedPrice = formatNumberWithSuffix(price);
  const listingId = listing.uuid;

  const firstImage = listing.listing_images[0];
  const imageSrc = firstImage?.url || imagePlaceholder.src;
  const width = firstImage?.width ?? 200;
  const height = firstImage?.height ?? 200;

  return (
    <article className="flex w-full flex-col items-stretch gap-4 rounded-md border px-3 pt-3 pb-4">
      <figure className="group aspect-auto h-50 w-full overflow-hidden rounded-md">
        <Image
          src={imageSrc}
          alt={listing.title || "Listing Image"}
          width={width}
          height={height}
          onError={(e) => {
            e.currentTarget.src =
              "/illustrations/illustration-house-placeholder.jpg";
          }}
          className="h-full w-full rounded-md object-cover object-top transition-all duration-300 group-hover:scale-110"
        />
      </figure>
      <section className="flex flex-col gap-2">
        {listing.location && (
          <div className="text-text-secondary flex gap-2">
            <LocationIcon />
            <p className="w-full truncate">{listing.location}</p>
          </div>
        )}
        {listing.title && (
          <h2 className="text-text-primary w-full truncate text-2xl font-semibold capitalize">
            {listing.title}
          </h2>
        )}
      </section>
      <section className="flex items-center justify-between gap-2 text-sm">
        <p>
          <span className="text-xl font-semibold">${formattedPrice}</span>/
          {paymentFrequency}
        </p>

        <Link href={`/listings/${listingId}`}>
          <Button
            className="text-text-primary border-line flex h-12 items-center justify-center gap-2 p-2 transition-all duration-150"
            variant="outline"
          >
            View Details
            <ChevronRightIcon />
          </Button>
        </Link>
      </section>
    </article>
  );
}
