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

  console.log("formatted price", formattedPrice);

  const imgSrc =
    listing.listing_images[0]?.image_url ||
    "/illustrations/illustration-house-placeholder.jpg";

  return (
    <article className="flex w-full max-w-79 flex-col items-stretch gap-4 rounded-md border px-3 pt-3 pb-4">
      <figure className="group aspect-auto h-50 w-full overflow-hidden rounded-md">
        <Image
          src={imgSrc}
          alt={listing.title || "Listing Image"}
          width={292}
          height={200}
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
            <p className="w-[14ch] truncate">{listing.location}</p>
          </div>
        )}
        {listing.title && (
          <h2 className="text-text-primary w-[14ch] truncate text-2xl font-semibold capitalize">
            {listing.title}
          </h2>
        )}
      </section>
      <section className="grid grid-cols-2 items-center text-sm">
        <p>
          <span className="text-xl font-semibold">${price}</span>/
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
