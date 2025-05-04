"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { BackIcon } from "@/public/icons/back-icon"
import { RightArrowBoxIcon } from "@/public/icons/icon-arrow-right-box"

interface ImageGalleryProps {
  images: string[]
  altText?: string
  className?: string
}

export function ListingDetailsImageGallery({ images, altText = "", className }: ImageGalleryProps) {
  // Ensure we don't exceed the maximum number of images
  const galleryImages = images.slice(0, 10)

  const isMobile = useMobile()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Handle navigation for mobile carousel
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  // Reset current index when switching between mobile and desktop
  useEffect(() => {
    setCurrentIndex(0)
  }, [isMobile])

  if (galleryImages.length === 0) {
    return null
  }

  // For desktop view, determine the appropriate layout based on image count
  const renderDesktopLayout = () => {
    // If only one image, show it full width
    if (galleryImages.length === 1) {
      return (
        <div className="h-full w-full">
          <div className="group relative h-full w-full overflow-hidden rounded-none" style={{ aspectRatio: "645/437" }}>
            <Image
              src={galleryImages[0] || "/placeholder.svg"}
              alt={altText}
              fill
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[0.95] group-hover:object-contain"
              priority
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>
        </div>
      )
    }

    // If 2-4 images, use a custom layout
    if (galleryImages.length < 5) {
      return (
        <div className="grid h-full grid-cols-2 gap-3">
          {/* First image larger */}
          <div
            className="group relative row-span-2 h-full w-full overflow-hidden rounded-none"
            style={{ aspectRatio: "645/437" }}
          >
            <Image
              src={galleryImages[0] || "/placeholder.svg"}
              alt={altText}
              fill
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[0.95] group-hover:object-contain"
              priority
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>

          {/* Remaining images */}
          {galleryImages.slice(1).map((image, index) => (
            <div
              key={index}
              className="group relative h-full w-full overflow-hidden rounded-none"
              style={{ aspectRatio: "645/437" }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={altText}
                fill
                className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[0.95] group-hover:object-contain"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      )
    }

    // Default layout for 5+ images
    return (
      <div className="grid h-full grid-cols-4 gap-3">
        {/* Main large image - spans 2 rows and 2 columns */}
        <div
          className="group relative col-span-2 row-span-2 h-full w-full overflow-hidden rounded-none"
          style={{ aspectRatio: "645/437" }}
        >
          <Image
            src={galleryImages[0] || "/placeholder.svg"}
            alt={altText}
            fill
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[0.95] group-hover:object-contain"
            priority
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </div>

        {/* Grid of smaller images */}
        {galleryImages.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="group relative h-full w-full overflow-hidden rounded-none"
            style={{ aspectRatio: "645/437" }}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={altText}
              fill
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[0.95] group-hover:object-contain"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("bg-background-secondary h-full w-full", className)}>
      {isMobile ? (
        // Mobile carousel layout
        <div className="relative h-full w-full">
          <div className="group relative h-full w-full overflow-hidden rounded-none" style={{ aspectRatio: "645/437" }}>
            <Image
              src={galleryImages[currentIndex] || "/placeholder.svg"}
              alt={altText}
              fill
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[0.95] group-hover:object-contain"
              priority={currentIndex === 0}
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 z-10 -translate-y-1/2 shadow-md hover:scale-105"
            aria-label="Previous image"
          >
            <BackIcon />
          </button>

          <button
            onClick={goToNext}
            className="absolute top-1/2 right-2 z-10 -translate-y-1/2 shadow-md hover:scale-105"
            aria-label="Next image"
          >
            <RightArrowBoxIcon size={40} />
          </button>
        </div>
      ) : (
        // Desktop layout - adaptive based on image count
        <div className="h-full min-h-[440px]">{renderDesktopLayout()}</div>
      )}
    </div>
  )
}
