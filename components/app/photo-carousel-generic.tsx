import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";


export function PhotoCarouselGeneric({ photos }: { photos: string[] }) {
  return (
    <div className="relative w-full">
      <Carousel className="w-full" opts={{ align: "start", slidesToScroll: 1 }}>
        {/* Left navigation button - using ShadCN's CarouselPrevious */}
        <CarouselPrevious className="bg-background-secondary absolute -left-5 z-5 size-10 rounded-sm border-0 p-3" />

        {/* Photos container */}
        <CarouselContent className="flex w-full gap-3">
          {photos.map((url, idx) => (
            <CarouselItem key={idx} className="sm:basis-1/3">
              <Image
                width={200}
                height={200}
                src={url}
                className="aspect-square h-full w-full overflow-hidden rounded-sm object-cover"
                alt={url}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Right navigation button - using ShadCN's CarouselNext */}
        <CarouselNext className="bg-background-secondary absolute -right-5 z-5 size-10 rounded-sm border-0 p-3" />
      </Carousel>
    </div>
  );
}
