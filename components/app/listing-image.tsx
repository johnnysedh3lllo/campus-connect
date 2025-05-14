import { useImageSize } from "@/hooks/use-image-size";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const ListingImage = ({
  url,
  className,
}: {
  url: string;
  className?: string;
}) => {
  const size = useImageSize(url);

  if (!size) return <p>Loading image...</p>;

  return (
    <Image
      src={url}
      width={size.width}
      height={size.height}
      alt="Uploaded image"
      className={cn(className)}
    />
  );
};
