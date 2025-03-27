import Image from "next/image"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { RefObject } from "react";

function ListingCreatePreviewImage({ previews, scrollContainerRef, removeSpecificImage, isUploading }: {
    previews: string[], scrollContainerRef: RefObject<HTMLDivElement>, removeSpecificImage?: (index: number) => void, isUploading: boolean
}) {

    function scrollLeft() {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    function scrollRight() {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };
    return (
        <>
            <div className='mb-6 font-medium'>{previews.length}{" "}{isUploading ? "/10 Photos uploaded" : "Total Photos"}</div>

            <div className="w-full flex items-center gap-4 relative">
                {/* Left Navigation Button */}
                {previews.length > 0 && (
                    <Button
                        type="button"
                        size="icon"
                        onClick={scrollLeft}
                        className="shrink-0 absolute top-1/2 -left-3 w-8 z-100 -translate-y-1/2 bg-[#F8F8F8] hover:bg-[#d6d6d6ec] text-black"
                    >
                        <Image
                            src="/icons/icon-chevon-left.svg"
                            alt="Scroll Right"
                            width={24}
                            height={24}
                        />
                    </Button>
                )}

                {/* Horizontally Scrollable Image Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto space-x-4 scrollbar-hide py-2 px-1 flex-grow"
                    style={{
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {previews.map((preview, index) => (
                        <div
                            key={index}
                            className="relative flex-shrink-0 w-full sm:w-48 h-160 sm:h-50 scroll-snap-align-start"
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover rounded-md object-top"
                            />
                            {removeSpecificImage && <div
                                onClick={() => removeSpecificImage(index)}
                                className="absolute top-2 right-2 bg-red-100 border border-red-400 text-white rounded-sm p-1 hover:bg-red-200 flex items-center justify-center cursor-pointer aspect-square w-8"
                            >
                                <Image src={'/icons/icon-trash-outlined.svg'} alt='Icon to delete selected preview' width={16} height={16} />
                            </div>}
                        </div>
                    ))}
                </div>

                {/* Right Navigation Button */}
                {previews.length > 0 && (
                    <Button
                        type="button"
                        size="icon"
                        onClick={scrollRight}
                        className="shrink-0 absolute top-1/2 -right-3 w-8 z-100 -translate-y-1/2 bg-[#F8F8F8] hover:bg-[#d6d6d6ec] text-black"
                    >
                        <Image
                            src="/icons/icon-arrow-right.svg"
                            alt="Scroll Right"
                            width={24}
                            height={24}
                        />
                    </Button>
                )}
            </div>
        </>
    )
}

export default ListingCreatePreviewImage