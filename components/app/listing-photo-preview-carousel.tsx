"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoPreview } from "@/components/app/listing-photo-preview";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface PhotoCarouselProps {
  photos: string[];
  onRemove?: (index: number) => void;
}

export function PhotoCarousel({ photos, onRemove }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const totalPhotos = photos.length;
  const photosPerPage = 3;

  // Calculate if we can navigate forward or backward
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex + photosPerPage < totalPhotos;

  // Navigate to previous image
  const goToPrevious = () => {
    if (canGoBack && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // Navigate to next image
  const goToNext = () => {
    if (canGoForward && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) =>
        Math.min(prev + 1, totalPhotos - photosPerPage),
      );
    }
  };

  // Reset animation state after transition completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Match this with the CSS transition duration

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleRemove = (idx: number) => {
    if (onRemove) {
      onRemove(idx);
    }
  };

  return (
    <div className="relative flex w-full flex-col gap-6">
      <div className="text-sm font-medium">
        {totalPhotos}/10 Photos
      </div>

      <div className="flex items-center">
        {/* Left navigation button */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "bg-background-secondary absolute -left-5 z-10 size-10 rounded-sm border-0 p-3",
            !canGoBack && "cursor-not-allowed opacity-50",
          )}
          onClick={goToPrevious}
          disabled={!canGoBack || isAnimating}
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Photos container */}
        <div className="w-full overflow-hidden">
          <div
            className="flex gap-2 transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex / totalPhotos) * 100}%)`,
              width: `${(totalPhotos * 100) / 3}%`,
            }}
          >
            {photos.map((url, idx) => (
              <div
                key={idx}
                className="w-full"
                style={{ width: `${100 / totalPhotos}%` }}
              >
                <PhotoPreview
                  url={url}
                  onRemove={handleRemove.bind(null, idx)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right navigation button */}
        <Button
          variant="outline"
          className={cn(
            "bg-background-secondary absolute -right-5 z-10 size-10 rounded-sm border-0 p-3",
            !canGoForward && "cursor-not-allowed opacity-50",
          )}
          onClick={goToNext}
          disabled={!canGoForward || isAnimating}
          aria-label="Next photo"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
