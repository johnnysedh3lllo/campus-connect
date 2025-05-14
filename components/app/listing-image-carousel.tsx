"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { cn } from "@/lib/utils";

export function ListingImageCarousel({
  startIndex,
  imageMetadata,
  className,
}: {
  startIndex: number;
  imageMetadata: ListingWithImages["listing_images"] | undefined;
  className?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        startIndex,
      }}
      className={cn("flex w-full max-w-3xl flex-col gap-4", className)}
    >
      <CarouselPrevious className="bg-background-secondary absolute -left-5 z-5 size-10 rounded-sm border-0 p-3 lg:size-14 [&_svg]:size-10" />

      <CarouselContent className="h-full">
        {imageMetadata?.map((img, idx) => (
          <CarouselItem key={idx} className="flex justify-center">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={img.image_url || "https://placehold.co/600x400"}
                alt={`Image ${idx}`}
                fill
                className="rounded object-contain"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center gap-1 lg:gap-3">
        {[...Array.from({ length: count })].map((_, idx) => {
          return (
            <div
              className={`size-2 cursor-pointer rounded-full transition-all duration-150 ${current === idx + 1 ? "bg-background-accent scale-110" : "bg-background-secondary"} sm:size-4`}
              key={idx}
              onClick={() => api?.scrollTo(idx)}
            ></div>
          );
        })}
      </div>
      <CarouselNext className="bg-background-secondary absolute -right-5 z-5 size-10 rounded-sm border-0 p-3 lg:size-14 [&_svg]:size-10" />
    </Carousel>
  );
}
