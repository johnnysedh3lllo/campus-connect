import Image from "next/image";
import { Button } from "../ui/button";
import { RefObject } from "react";
import { LeftChevonIcon } from "@/public/icons/left-chevon-icon";
import { RightArrowBoxIcon } from "@/public/icons/icon-arrow-right-box";
import { RightArrowIcon } from "@/public/icons/icon-arrow-right";

function ListingCreatePreviewImage({
  previews,
  scrollContainerRef,
  removeSpecificImage,
  isUploading,
  showNumber,
}: {
  previews: string[];
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  removeSpecificImage?: (index: number) => void;
  isUploading: boolean;
  showNumber?: boolean;
}) {
  function scrollLeft() {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  }

  function scrollRight() {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  }

  return (
    <>
      {showNumber !== false && (
        <div className="mb-6 font-medium">
          {previews.length}{" "}
          {isUploading ? "/10 Photos uploaded" : "Total Photos"}
        </div>
      )}

      <div className="relative flex w-full items-center gap-4">
        {/* Left Navigation Button */}
        {previews.length > 0 && (
          <Button
            type="button"
            size="icon"
            onClick={scrollLeft}
            className="absolute top-1/2 -left-3 z-100 w-8 shrink-0 -translate-y-1/2 bg-background-secondary text-black hover:bg-[#d6d6d6ec]"
          >
            <LeftChevonIcon />
          </Button>
        )}

        {/* Horizontally Scrollable Image Container */}
        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex flex-grow space-x-4 overflow-x-auto px-1 py-2 listing-image-preview-container"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {previews.length > 0 && (
            previews.map((preview, index) => (
              <div
                key={index}
                className="scroll-snap-align-start relative h-160 w-full flex-shrink-0 sm:h-50 sm:w-48"
                style={{ scrollSnapAlign: "start" }}
              >
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="rounded-md object-cover object-top"
                />
                {removeSpecificImage && (
                  <div
                    onClick={() => removeSpecificImage(index)}
                    className="absolute top-2 right-2 flex aspect-square w-8 cursor-pointer items-center justify-center rounded-sm border border-red-400 bg-red-100 p-1 text-white hover:bg-red-200"
                  >
                    <Image
                      src={"/icons/icon-trash-outlined.svg"}
                      alt="Icon to delete selected preview"
                      width={16}
                      height={16}
                    />
                  </div>
                )}
              </div>
            ))
          ) }
        </div>

        {/* Right Navigation Button */}
        {previews.length > 0 && (
          <Button
            type="button"
            size="icon"
            onClick={scrollRight}
            className="absolute top-1/2 -right-3 z-100 w-8 shrink-0 -translate-y-1/2 bg-background-secondary text-black "
          >
            <RightArrowIcon />
          </Button>
        )}
      </div>
    </>
  );
}

export default ListingCreatePreviewImage;
