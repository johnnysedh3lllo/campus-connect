"use client";

import ListingCard from "./listing-card";

export function ListingsCardContainer({
  listings,
}: {
  listings: ListingWithImages[];
}) {
  return (
    <div className="max-w-screen-max-xl mx-auto grid w-full grid-cols-1 justify-items-center gap-4 px-4 sm:px-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard listing={listing} key={listing.uuid} />
      ))}
    </div>
  );
}
