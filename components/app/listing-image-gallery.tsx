"use strict";

import Image from "next/image";
import { ListingImage } from "./listing-image";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { ListingImageCarousel } from "./listing-image-carousel";

export function ListingImageGallery({
  imageMetadata,
}: {
  imageMetadata: ListingWithImages["listing_images"] | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const limitedImages = imageMetadata?.slice(0, 3) ?? [];

  const getImageProps = (index: number) => {
    const img = limitedImages[index];
    return {
      src: img?.image_url ?? "/placeholder-image.jpg",
      width: img?.width ?? 0,
      height: img?.height ?? 0,
    };
  };

  const handleOpen = (index: number) => {
    setStartIndex(index);
    setOpen(true);
  };

  return (
    <>
      <ListingImageCarousel
        imageMetadata={imageMetadata}
        startIndex={startIndex}
        className="sm:hidden"
      />

      <div className="hidden w-full grid-cols-[3fr_1.5fr] grid-rows-2 sm:grid">
        <figure className="col-start-1 col-end-2 row-span-3 cursor-pointer pr-2">
          <Image
            {...getImageProps(1)}
            alt=""
            className="h-full w-full object-cover"
            onClick={() => handleOpen(1)}
          />
        </figure>

        <figure className="col-start-2 row-start-1 row-end-2 cursor-pointer pb-2">
          <Image
            {...getImageProps(0)}
            alt=""
            className="h-full w-full object-cover"
            onClick={() => handleOpen(0)}
          />
        </figure>

        <figure className="col-start-2 row-start-2 row-end-3 cursor-pointer">
          <Image
            {...getImageProps(2)}
            alt=""
            className="h-full w-full object-cover"
            onClick={() => handleOpen(2)}
          />
        </figure>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* Hidden trigger (we manually control open state) */}
          <div className="hidden" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-screen-max-xl flex w-full items-center justify-center rounded-lg">
          <DialogTitle className="sr-only">
            Carousel modal for listing images
          </DialogTitle>
          <DialogDescription className="sr-only">
            to display listing images
          </DialogDescription>

          <ListingImageCarousel
            imageMetadata={imageMetadata}
            startIndex={startIndex}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
