"use client";

import ListingCard from "./listing-card";

export function ListingsCardContainer({
  pageData,
}: {
  pageData: ListingWithImages[] | undefined;
}) {
  return (
    <div className="max-w-screen-max-xl mx-auto w-full">
      {pageData && (
        <div className="max-w-screen-max-xl mx-auto grid w-full grid-cols-1 justify-items-center gap-4 px-4 sm:px-12 md:grid-cols-2 lg:grid-cols-3">
          {pageData.map((listing) => (
            <ListingCard listing={listing} key={listing.uuid} />
          ))}
        </div>
      )}
    </div>
  );
}
