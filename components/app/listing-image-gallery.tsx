"use strict";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ListingImageCarousel } from "./listing-image-carousel";

export function ListingImageGallery({
  imageMetadata,
}: {
  imageMetadata: ListingWithImages["listing_images"] | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const imagesToShow = imageMetadata?.slice(0, 3) ?? [];

  const layoutClass =
    imagesToShow.length === 3
      ? "grid-cols-[3fr_1.5fr] grid-rows-2"
      : imagesToShow.length === 2
        ? "grid-cols-[3fr_1.5fr]"
        : "grid-cols-1";

  const getImageProps = (index: number) => {
    const img = imagesToShow[index];
    return {
      src: img?.image_url,
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

      <div className={`hidden w-full ${layoutClass} gap-2 sm:grid`}>
        {/* Main image */}
        <figure
          className={`col-start-1 col-end-2 row-span-3 ${imagesToShow.length === 1 ? "max-h-[440px]" : ""} group cursor-pointer overflow-hidden`}
        >
          <Image
            {...getImageProps(0)}
            alt=""
            className="h-full w-full object-cover transition-all duration-400 group-hover:scale-105"
            onClick={() => handleOpen(0)}
          />
        </figure>

        {/* 2nd image */}
        {imagesToShow.length >= 2 && (
          <figure
            className={`col-start-2 row-start-1 ${imagesToShow.length === 3 ? "row-end-2" : "row-end-5"} group max-h-[440px] cursor-pointer overflow-hidden`}
          >
            <Image
              {...getImageProps(1)}
              alt=""
              className="h-full w-full object-cover transition-all duration-400 group-hover:scale-105"
              onClick={() => handleOpen(1)}
            />
          </figure>
        )}

        {/* 3rd image */}
        {imagesToShow.length === 3 && (
          <figure className="group col-start-2 row-start-2 row-end-3 max-h-[440px] cursor-pointer overflow-hidden">
            <Image
              {...getImageProps(2)}
              alt=""
              className="h-full w-full object-cover transition-all duration-400 group-hover:scale-105"
              onClick={() => handleOpen(2)}
            />
          </figure>
        )}
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
