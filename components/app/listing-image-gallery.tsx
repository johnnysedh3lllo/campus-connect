"use strict";

import Image from "next/image";
import { ListingImage } from "./listing-image";

export function ListingImageGallery({
  imageMetadata,
}: {
  imageMetadata: ListingWithImages["listing_images"] | undefined;
}) {
  console.log(imageMetadata);

  const limitedImages = imageMetadata?.slice(0, 3) ?? [];

  const getImageProps = (index: number) => {
    const img = limitedImages[index];
    return {
      src: img?.image_url ?? "/placeholder-image.jpg",
      width: img?.width ?? 1200,
      height: img?.height ?? 800,
    };
  };

  return (
    <div className="grid w-full grid-rows-2 grid-cols-[3fr_1.5fr] gap-2">
      <Image
        {...getImageProps(1)}
        alt=""
        className="col-start-1 col-end-2 row-span-3 object-cover"
      />
      <Image
        {...getImageProps(0)}
        alt=""
        className="col-start-2 row-start-1 row-end-2 object-cover"
      />
      <Image
        {...getImageProps(2)}
        alt=""
        className="col-start-2 row-start-2 row-end-3 object-cover"
      />
    </div>
  );
}
